package controllers

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"gorm.io/gorm"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
)

type CommentInput struct {
	ArticleID uint   `json:"articleID" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Content   string `json:"content" binding:"required"`
	IsApprove bool   `json:"isApprove"`
}

// Tambah komentar (public)
// CreateComment (public) - User mengirim komentar
func CreateOrReplyComment(c *gin.Context) {
	db := config.DB

	// 1) Dapatkan dan validasi articleID
	articleIDStr := c.Param("id")
	articleIDUint64, err := strconv.ParseUint(articleIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}
	articleID := uint(articleIDUint64)

	// 2) Pastikan artikel ada
	var article models.Article
	if err := db.First(&article, articleID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 3) Ambil data dari request
	parentIDStr := c.PostForm("parent_id") // optional
	name := c.PostForm("name")             // required, tapi jika anon => override
	email := c.PostForm("email")           // optional
	content := c.PostForm("content")       // required
	isAnonymousStr := c.PostForm("is_anonymous")

	// Minimal validasi
	if strings.TrimSpace(content) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}
	if strings.TrimSpace(name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name is required (or use anonymous)"})
		return
	}

	// 4) Konversi parentID => *uint
	var parentID *uint
	if parentIDStr != "" {
		p, err := strconv.ParseUint(parentIDStr, 10, 64)
		if err == nil {
			tmp := uint(p)
			parentID = &tmp
		}
	}

	// 5) Jika ada parentID, pastikan parent comment valid dan milik artikel yang sama
	if parentID != nil {
		var parentComment models.Comments
		if err := db.First(&parentComment, *parentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "Parent comment not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		// Cek apakah parent comment milik artikel yg sama
		if parentComment.ArticleID != articleID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Parent comment does not belong to this article"})
			return
		}
	}

	// 6) Anonim?
	var isAnon bool
	if isAnonymousStr == "true" {
		isAnon = true
		name = "Anonymous"
		email = "" // optional: kosongkan email
	}

	// 7) Buat objek komentar
	newComment := models.Comments{
		ArticleID:   articleID,
		ParentID:    parentID,
		Name:        name,
		Email:       email,
		Content:     content,
		Status:      "pending", // butuh approval
		IsAnonymous: isAnon,
	}

	// 8) Simpan ke DB
	if err := db.Create(&newComment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Kirim email notifikasi ke admin (jika diinginkan)
	subject := "New Comment on Article: " + article.Title
	body := fmt.Sprintf(
		"Hi Admin,\n\nUser %s just commented on article '%s'.\nComment: %s\n\nPlease review in admin panel.\n",
		name, article.Title, content,
	)

	go func() {
		if err := utils.SendEmail(subject, body); err != nil {
			fmt.Println("Failed to send email notification to Admin:", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment submitted, pending approval",
		"data":    newComment,
	})
}

// ---------------------------------------------------
// 2. GET COMMENTS (Multi-level Tree, only Approved)
// ---------------------------------------------------
// GET /articles/:articleID/comments
// - Hanya tampilkan status = "approved"
// - Root comment (ParentID = nil) => Urut terbaru di atas (desc)
// - Balasan (reply) => Urut tertua di atas (asc)
func GetCommentsByArticle(c *gin.Context) {
	db := config.DB

	// 1) Dapatkan articleID
	articleIDStr := c.Param("id")
	articleIDUint64, err := strconv.ParseUint(articleIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}
	articleID := uint(articleIDUint64)

	// 2) Validasi artikel (opsional).
	//    Jika Anda ingin pastikan artikel exist meski pun kita hanya fetch comments.
	var article models.Article
	if err := db.First(&article, articleID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 3) Ambil semua comment (approved) untuk article ini
	var allApproved []models.Comments
	if err := db.Where("article_id = ? AND status = ?", articleID, "approved").
		Find(&allApproved).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 4) Kita akan membangun tree
	//    parent_id = nil => root
	//    parent_id != nil => child
	//    + Sorting root desc, child asc

	// Buat map parent -> []child
	childrenMap := make(map[uint][]models.Comments)
	// Juga simpan comment ke map
	commentMap := make(map[uint]models.Comments)

	for _, cmt := range allApproved {
		commentMap[cmt.ID] = cmt
		if cmt.ParentID != nil {
			pid := *cmt.ParentID
			childrenMap[pid] = append(childrenMap[pid], cmt)
		}
	}

	// Ambil root comments
	var rootComments []models.Comments
	for _, cmt := range allApproved {
		if cmt.ParentID == nil {
			rootComments = append(rootComments, cmt)
		}
	}

	// Sort root desc by CreatedAt (terbaru di atas)
	sort.Slice(rootComments, func(i, j int) bool {
		return rootComments[i].CreatedAt.After(rootComments[j].CreatedAt)
	})

	// Definisikan struct tree
	type CommentTree struct {
		ID        uint          `json:"id"`
		Name      string        `json:"name"`
		Content   string        `json:"content"`
		CreatedAt time.Time     `json:"created_at"`
		Children  []CommentTree `json:"children,omitempty"`
	}

	// Fungsi rekursif
	var buildNode func(cmt models.Comments) CommentTree
	buildNode = func(cmt models.Comments) CommentTree {
		node := CommentTree{
			ID:        cmt.ID,
			Name:      cmt.Name,
			Content:   cmt.Content,
			CreatedAt: cmt.CreatedAt,
		}

		childs := childrenMap[cmt.ID]

		// Sort childs asc
		sort.Slice(childs, func(i, j int) bool {
			return childs[i].CreatedAt.Before(childs[j].CreatedAt)
		})

		for _, child := range childs {
			node.Children = append(node.Children, buildNode(child))
		}
		return node
	}

	// Bangun result
	var result []CommentTree
	for _, root := range rootComments {
		result = append(result, buildNode(root))
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": result,
	})
}

// ---------------------------------------------------
// 3. ADMIN - Approve Comment
// ---------------------------------------------------
// PATCH /admin/comments/:id/approve
func ApproveComment(c *gin.Context) {
	db := config.DB

	idStr := c.Param("id")
	idUint64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	commentID := uint(idUint64)

	var comment models.Comments
	if err := db.First(&comment, commentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	comment.Status = "approved"
	if err := db.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment approved", "data": comment})
}

// ---------------------------------------------------
// 4. ADMIN - Reject Comment
// ---------------------------------------------------
// PATCH /admin/comments/:id/reject
func RejectComment(c *gin.Context) {
	db := config.DB

	idStr := c.Param("id")
	idUint64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	commentID := uint(idUint64)

	var comment models.Comments
	if err := db.First(&comment, commentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	comment.Status = "rejected"
	if err := db.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment rejected", "data": comment})
}

// ---------------------------------------------------
// 5. ADMIN - Reset Comment to pending
// ---------------------------------------------------
// PATCH /admin/comments/:id/reset
func ResetComment(c *gin.Context) {
	db := config.DB

	idStr := c.Param("id")
	idUint64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	commentID := uint(idUint64)

	var comment models.Comments
	if err := db.First(&comment, commentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	comment.Status = "pending"
	if err := db.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment reset to pending", "data": comment})
}

func ReplyComments(c *gin.Context) {
	// 1. Baca ID komentar induk dari path
	parentIDStr := c.Param("id")
	if strings.TrimSpace(parentIDStr) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parent Comment ID is required"})
		return
	}

	// 2. Pastikan parentID valid
	parentIDUint64, err := strconv.ParseUint(parentIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Parent Comment ID"})
		return
	}
	parentID := uint(parentIDUint64)

	// 3. Ambil komentar induk dari DB
	var parentComment models.Comments
	if err := config.DB.First(&parentComment, parentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Parent comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 4. Ambil data balasan dari form-data atau JSON
	replyContent := c.PostForm("content")
	if strings.TrimSpace(replyContent) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reply content is required"})
		return
	}

	// 5. Buat comment baru sebagai balasan
	replyComment := models.Comments{
		ArticleID: parentComment.ArticleID,
		ParentID:  &parentID,
		Name:      "Admin (Yeremia Yosefan Pane)", // atau ambil dari user admin login
		Content:   replyContent,
		Status:    "approved", // balasan admin otomatis approved (atau "pending" jika masih perlu moderasi)
		// Email kosong karena ini dari admin
	}

	// 6. Simpan balasan ke DB
	if err := config.DB.Create(&replyComment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 7. Notifikasi email ke user yang menulis komentar induk (jika tidak anonim dan punya email)
	if !parentComment.IsAnonymous && parentComment.Email != "" {
		subject := fmt.Sprintf("Your comment on article (ID %d) has a reply", parentComment.ArticleID)
		body := fmt.Sprintf(
			"Hi %s,\n\nAdmin has replied to your comment:\n\n\"%s\"\n\nThanks!",
			parentComment.Name, replyContent,
		)

		go func() {
			if err := utils.SendEmailTo(parentComment.Email, subject, body); err != nil {
				fmt.Println("Failed to send email to user:", err)
			}
		}()
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Reply created successfully",
		"data":    replyComment,
	})
}

func GetCommentDetail(c *gin.Context) {
	idStr := c.Param("id")
	commentIDUint64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	commentID := uint(commentIDUint64)

	var comment models.Comments
	if err := config.DB.First(&comment, commentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Inisialisasi response
	// di sini kita bisa menambahkan field "ParentComment" jika dibutuhkan
	type CommentDetailResponse struct {
		ID            uint             `json:"id"`
		ArticleID     uint             `json:"article_id"`
		ParentID      *uint            `json:"parent_id,omitempty"`
		Name          string           `json:"name"`
		Email         string           `json:"email,omitempty"`
		Content       string           `json:"content"`
		Status        string           `json:"status"`
		IsApprove     bool             `json:"is_approve"`
		IsAnonymous   bool             `json:"is_anonymous"`
		ParentComment *models.Comments `json:"parent_comment,omitempty"`
		// atau ringkasan parent comment
		// CreatedAt, UpdatedAt, dsb. juga bisa
	}

	resp := CommentDetailResponse{
		ID:          comment.ID,
		ArticleID:   comment.ArticleID,
		ParentID:    comment.ParentID,
		Name:        comment.Name,
		Email:       comment.Email,
		Content:     comment.Content,
		Status:      comment.Status,
		IsApprove:   comment.IsApprove,
		IsAnonymous: comment.IsAnonymous,
	}

	// Jika comment punya parent, kita bisa ambil detail parent
	if comment.ParentID != nil {
		var parent models.Comments
		if err := config.DB.First(&parent, *comment.ParentID).Error; err == nil {
			resp.ParentComment = &parent
		}
	}

	c.JSON(http.StatusOK, resp)
}

// GetAllAdminComments menampilkan list komentar dengan paging & search
func GetAllAdminComments(c *gin.Context) {
	db := config.DB

	// Ambil query param
	pageStr := c.Query("page")
	if pageStr == "" {
		pageStr = "1"
	}
	page, _ := strconv.Atoi(pageStr)

	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "10"
	}
	limit, _ := strconv.Atoi(limitStr)

	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Query builder
	query := db.Model(&models.Comments{})

	// Jika ada search, cari di name / content / email dsb.
	if search != "" {
		likeStr := "%" + search + "%"
		query = query.Where("name LIKE ? OR content LIKE ? OR email LIKE ?", likeStr, likeStr, likeStr)
	}

	var total int64
	query.Count(&total)

	var comments []models.Comments
	err := query.Order("id DESC").Limit(limit).Offset(offset).Find(&comments).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (total + int64(limit) - 1) / int64(limit) // hitung total page

	c.JSON(http.StatusOK, gin.H{
		"data":       comments,
		"total_data": total,
		"page":       page,
		"limit":      limit,
		"total_page": totalPages,
	})
}
