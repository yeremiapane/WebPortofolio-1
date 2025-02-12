// =====================================================
// 1) Ambil articleId dari URL (misal path: /article/123)
// =====================================================
const articleId = (() => {
  const pathParts = window.location.pathname.split("/");
  // Asumsi URL: /article/{id}/{slug}
  return pathParts[2];
})();


// Quill toolbar dengan Font.whitelist yang sudah diperbaiki
const Font = Quill.import('formats/font');
Font.whitelist = ['roboto', 'montserrat', 'nunito-sans', 'mulish', 'poppins'];
Quill.register(Font, true);

const toolbarOptions = [
  ['bold','italic','underline','strike'],
  ['blockquote','code-block'],
  ['link','image','video','formula'],
  [{ 'header':1 },{ 'header':2 }],
  [{ 'list':'ordered' },{ 'list':'bullet' },{ 'list':'check' }],
  [{ 'script':'sub' },{ 'script':'super' }],
  [{ 'indent':'-1' },{ 'indent':'+1' }],
  [{ 'direction':'rtl' }],
  [{ 'size':['small',false,'large','huge'] }],
  [{ 'header':[1,2,3,4,5,6,false] }],
  [{ 'color':[] },{ 'background':[] }],
  [{ 'font': Font.whitelist }],
  [{ 'align':[] }],
  ['clean']
];

// =====================================================
// 2) Inisialisasi Quill Editor
// =====================================================
const commentEditor = new Quill('#comment-editor', {
  modules: {
    syntax: true,
    toolbar: toolbarOptions
  },
  theme: 'snow'
});


// =====================================================
// 3) Fetch Detail Artikel
// =====================================================
async function fetchArticleDetail() {
  try {
    const response = await fetch(`/articles/${articleId}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch article detail');
    }
    const article = await response.json();

    document.getElementById('articleTitle').textContent = article.Title;
    document.getElementById('articleCategory').textContent = article.Category || 'Kategori';

    const infoEl = document.getElementById('articleInfo');
    let htmlInfo = `Author: <strong>${article.Publisher}</strong> | Published at: <strong>${new Date(article.CreatedAt).toLocaleDateString()}</strong>`;
    const createdTime = new Date(article.CreatedAt);
    const updatedTime = new Date(article.UpdatedAt);
    if (updatedTime > createdTime) {
      htmlInfo += ` | Updated at: <strong>${updatedTime.toLocaleDateString()}</strong>`;
    }
    htmlInfo += ` | ${article.ReadingTime} menit baca`;
    infoEl.innerHTML = htmlInfo;

    const mainImageEl = document.getElementById('articleMainImage');
    if (article.MainImage) {
      mainImageEl.src = `/${article.MainImage}`;
    } else {
      mainImageEl.style.display = 'none';
    }

    const tagsWrap = document.getElementById('tagsWrap');
    tagsWrap.innerHTML = '';
    if (article.Tags) {
      const tagArr = article.Tags.split(',');
      tagArr.forEach(tag => {
        const t = tag.trim();
        if (t) {
          const span = document.createElement('span');
          span.classList.add('tag-item');
          span.textContent = t;
          tagsWrap.appendChild(span);
        }
      });
    }

    const articleContent = document.getElementById('articleContent');
    articleContent.innerHTML = article.Content || '';

    document.getElementById('likeCount').textContent = article.Likes || 0;

  } catch (error) {
    console.error('Error fetching article detail:', error);
  }
}

// =====================================================
// 4) Fetch Status Like
// =====================================================
let liked = false;
async function fetchLikeStatus() {
  try {
    const resp = await fetch(`/articles/${articleId}/like_status`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('Failed to get like status');
    }
    const data = await resp.json();
    const likeCountEl = document.getElementById('likeCount');
    likeCountEl.textContent = data.likes;
    liked = data.liked;

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.classList.toggle('liked', liked);
    const icon = likeBtn.querySelector('ion-icon');
    if (liked) {
      icon.setAttribute('name','heart');
    } else {
      icon.setAttribute('name','heart-outline');
    }
  } catch (error) {
    console.error('Error fetching like status:', error);
  }
}

// 5) Toggle Like
const likeBtn = document.getElementById('likeBtn');
likeBtn.addEventListener('click', async () => {
  try {
    const resp = await fetch(`/articles/${articleId}/toggle_like`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('Failed to toggle like');
    }
    const data = await resp.json();
    const likeCountEl = document.getElementById('likeCount');
    likeCountEl.textContent = data.likes;
    liked = data.liked;

    likeBtn.classList.toggle('liked', liked);
    const icon = likeBtn.querySelector('ion-icon');
    if (liked) {
      icon.setAttribute('name','heart');
      showAlert('Berhasil menyukai artikel!, Terima kasih😇','success');
    } else {
      icon.setAttribute('name','heart-outline');
      showAlert('Berhasil membatalkan like!','success');
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    showAlert('Gagal melakukan like/unlike.','error');
  }
});

// =====================================================
// 6) Fetch Comments
// =====================================================
async function fetchComments() {
  try {
    const resp = await fetch(`/articles/${articleId}/comments`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await resp.json();
    const comments = data.comments || [];
    renderComments(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

function renderComments(commentTree) {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = '<h3>Daftar Komentar</h3>'; // reset

  if (!Array.isArray(commentTree)) {
    console.warn('Comment tree is not an array:', commentTree);
    return;
  }

  let totalComments = 0;

  function createCommentElement(cmt) {
    totalComments++;

    const singleComment = document.createElement('div');
    singleComment.classList.add('single-comment');
    singleComment.dataset.commentid = cmt.id;

    // Author
    const authorDiv = document.createElement('div');
    authorDiv.classList.add('comment-author');
    authorDiv.textContent = cmt.name;
    singleComment.appendChild(authorDiv);

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('comment-content');
    contentDiv.innerHTML = cmt.content;
    singleComment.appendChild(contentDiv);

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('comment-actions');
    const replySpan = document.createElement('span');
    replySpan.classList.add('reply-btn');
    replySpan.textContent = 'Balas';
    replySpan.setAttribute('data-replyto', cmt.id);
    actionsDiv.appendChild(replySpan);
    singleComment.appendChild(actionsDiv);

    // Buat .reply-list agar balasan bisa ditempel di mana pun
    const replyList = document.createElement('div');
    replyList.classList.add('reply-list');
    singleComment.appendChild(replyList);

    // Jika ada children
    if (Array.isArray(cmt.children) && cmt.children.length > 0) {
      cmt.children.forEach(child => {
        const childEl = createCommentElement(child);
        replyList.appendChild(childEl);
      });
    }

    return singleComment;
  }

  commentTree.forEach(cmt => {
    const cmtEl = createCommentElement(cmt);
    commentsList.appendChild(cmtEl);
  });

  document.getElementById('commentCountText').textContent = totalComments + ' Komentar';
}

// =====================================================
// 7) Submit Comment
// =====================================================
const anonymousToggle = document.getElementById('anonymousToggle');
const namedFields = document.getElementById('namedFields');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

anonymousToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    namedFields.style.display = 'none';
    nameInput.value = '';
    emailInput.value = '';
    nameInput.removeAttribute('required');
    emailInput.removeAttribute('required');
  } else {
    namedFields.style.display = 'block';
    nameInput.setAttribute('required','');
    emailInput.setAttribute('required','');
  }
});

const commentForm = document.getElementById('commentForm');
let activeReplyTo = null;
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const commentContent = commentEditor.root.innerHTML.trim();

  let isAnon = anonymousToggle.checked;
  let nameVal = nameInput.value.trim();
  let emailVal = emailInput.value.trim();

  if (!isAnon && (!nameVal || !emailVal)) {
    showAlert('Nama dan Email wajib diisi jika tidak anonim.','error');
    return;
  }
  if (commentContent === '' || commentContent === '<p><br></p>') {
    showAlert('Komentar tidak boleh kosong.','error');
    return;
  }
  if (isAnon) {
    nameVal = 'Anonymous';
    emailVal = '';
  }

  // parent_id
  const parentId = activeReplyTo || '';

  const formData = new FormData();
  formData.append('parent_id', parentId);
  formData.append('name', nameVal);
  formData.append('email', emailVal);
  formData.append('content', commentContent);
  formData.append('is_anonymous', isAnon ? 'true' : 'false');

  try {
    const resp = await fetch(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('Gagal mengirim komentar');
    }
    const result = await resp.json();
    console.log('Komentar terkirim:', result);
    showAlert('Komentar berhasil dikirim!, Terima kasih atas masukannya','success');

    // Reset form
    commentEditor.root.innerHTML = '';
    if (!isAnon) {
      nameInput.value = '';
      emailInput.value = '';
    }
    activeReplyTo = null;

    // Taruh form kembali ke .comments-section
    document.getElementById('commentsSection').appendChild(commentForm);

    // Refresh
    fetchComments();
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Terjadi kesalahan saat mengirim komentar.');
    showAlert(`Gagal mengirim komentar! ${error.message}`);
  }
});

// =====================================================
// 8) Handle Balas Komentar (Memindah form)
// =====================================================
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('reply-btn')) {
    const commentId = e.target.getAttribute('data-replyto');
    const parentComment = document.querySelector(`.single-comment[data-commentid="${commentId}"]`);
    if (!parentComment) {
      console.error(`Parent comment with ID ${commentId} not found.`);
      showAlert('Komentar induk tidak ditemukan.', 'error');
      return;
    }
    const replyList = parentComment.querySelector('.reply-list');
    if (!replyList) {
      console.error(`Reply list for comment ID ${commentId} not found.`);
      showAlert('Wadah balasan tidak ditemukan.', 'error');
      return;
    }

    // Pindahkan form ke .reply-list
    replyList.appendChild(commentForm);
    activeReplyTo = commentId;

    // Kosongkan editor, dsb.
    commentEditor.root.innerHTML = '';
    if (!anonymousToggle.checked) {
      nameInput.value = '';
      emailInput.value = '';
    }
  }
});

// =====================================================
// 9) Fetch Artikel Terkait
// =====================================================
async function fetchAnotherPosts() {
  try {
    const resp = await fetch('/articles', {
      method: 'GET',
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('Failed to fetch related articles');
    }
    const allArticles = await resp.json();
    // Exclude current
    const filtered = allArticles.filter(a => a.ID !== parseInt(articleId));
    const relatedContainer = document.getElementById('relatedArticles');
    relatedContainer.innerHTML = '';

    // Tampilkan 3 pertama
    const top3 = filtered.slice(0, 3);
    top3.forEach(a => {
      const card = document.createElement('div');
      card.classList.add('related-article-card');

      const img = document.createElement('img');
      img.classList.add('related-article-image');
      img.src = `/${a.MainImage}` || '';
      img.alt = a.Title;
      card.appendChild(img);

      const content = document.createElement('div');
      content.classList.add('related-article-content');

      const title = document.createElement('a');
      title.classList.add('related-article-title');
      title.href = `/article/${a.ID}`;
      title.textContent = a.Title;
      content.appendChild(title);

      // Meta info
      const meta = document.createElement('div');
      meta.classList.add('related-article-meta');

      // Author
      const author = document.createElement('div');
      author.classList.add('meta-item');
      const authorIcon = document.createElement('ion-icon');
      authorIcon.setAttribute('name','person-outline');
      author.appendChild(authorIcon);
      author.appendChild(document.createTextNode(a.Publisher));
      meta.appendChild(author);

      // Likes
      const likes = document.createElement('div');
      likes.classList.add('meta-item');
      const likeIcon = document.createElement('ion-icon');
      likeIcon.setAttribute('name','heart-outline');
      likes.appendChild(likeIcon);
      likes.appendChild(document.createTextNode(a.Likes));
      meta.appendChild(likes);

      // Comments
      const comments = document.createElement('div');
      comments.classList.add('meta-item');
      const commentIcon = document.createElement('ion-icon');
      commentIcon.setAttribute('name','chatbubble-outline');
      comments.appendChild(commentIcon);
      comments.appendChild(document.createTextNode(a.Comments || 0));
      meta.appendChild(comments);

      content.appendChild(meta);
      card.appendChild(content);
      relatedContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching related articles:', error);
  }
}

// =====================================================
// Alert System
// =====================================================
function showAlert(message, type='success') {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alert = document.createElement('div');
  alert.classList.add('alert', type === 'success' ? 'success' : 'error');

  // Icon
  const icon = document.createElement('span');
  icon.classList.add('alert-icon');
  icon.innerHTML = (type === 'success')
      ? '<ion-icon name="checkmark-circle-outline"></ion-icon>'
      : '<ion-icon name="close-circle-outline"></ion-icon>';
  alert.appendChild(icon);

  // Message
  const msg = document.createElement('span');
  msg.classList.add('alert-message');
  msg.textContent = message;
  alert.appendChild(msg);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(),300);
  };
  alert.appendChild(closeBtn);

  alertContainer.appendChild(alert);

  // Show
  setTimeout(() => {
    alert.classList.add('show');
  },10);

  // Auto hide after 3s
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(),300);
  },3000);
}

// =====================================================
// 10) Inisialisasi Setelah DOM Loaded
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
  await fetchArticleDetail();
  await fetchLikeStatus();
  await fetchComments();
  await fetchAnotherPosts();
});