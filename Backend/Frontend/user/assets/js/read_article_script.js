document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'http://localhost:8080'; // Sesuaikan dengan backend Anda

  // Misal URL: http://localhost:8080/article/123
  const pathSegments = window.location.pathname.split('/');
  const articleId = pathSegments[pathSegments.length - 1]; // ambil segmen terakhir sebagai ID
  if (!articleId) {
    showAlert('Article ID is missing!', 'error');
    return;
  }


  // Endpoint
  const articleUrl = `${BASE_URL}/articles/${articleId}`;
  const commentUrl = `${BASE_URL}/articles/${articleId}/comments`;
  const likeUrl = `${BASE_URL}/articles/${articleId}/like`;
  const allArticlesUrl = `${BASE_URL}/articles`;

  // DOM Elements
  const titleEl = document.getElementById('articleTitle');
  const categoryEl = document.getElementById('articleCategory');
  const tagsContainer = document.getElementById('articleTags');
  const authorEl = document.getElementById('articleAuthor');
  const dateEl = document.getElementById('articleDate');
  const updatedEl = document.getElementById('articleUpdated');
  const readingTimeEl = document.getElementById('articleReadingTime');

  const likeIconEl = document.getElementById('likeIcon');
  const likeCountEl = document.getElementById('likeCount');
  const commentCountEl = document.getElementById('commentCount');

  const imgEl = document.getElementById('articleImage');
  const captionEl = document.getElementById('articleCaption');
  const contentEl = document.getElementById('articleContent');

  const commentList = document.getElementById('commentList');
  const commentForm = document.getElementById('commentForm');
  const anonymousToggle = document.getElementById('anonymousToggle');
  const nameField = document.getElementById('nameField');
  const emailField = document.getElementById('emailField');

  const commentNameInput = document.getElementById('commentName');
  const commentEmailInput = document.getElementById('commentEmail');
  const quillContainer = document.getElementById('quillEditor');

  const relatedPostsContainer = document.getElementById('relatedPostsContainer');

  // Alert
  const customAlert = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');

  // Init Quill
  const quill = new Quill(quillContainer, {
    theme: 'snow',
    placeholder: 'Write your comment here...',
  });

  // 1. Fetch Article Detail
  fetch(articleUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
      })
      .then(article => {
        // Title, Category, Tags
        titleEl.textContent = article.Title || 'Untitled';
        categoryEl.textContent = article.Category || 'Uncategorized';
        if (article.Tags) {
          tagsContainer.innerHTML = '';
          const tagArr = article.Tags.split(',').map(t => t.trim());
          tagArr.forEach(tag => {
            const span = document.createElement('span');
            span.classList.add('tag-item');
            span.textContent = tag;
            tagsContainer.appendChild(span);
          });
        }

        // Author & Date
        authorEl.textContent = `By ${article.Publisher || 'Unknown'}`;
        const createdDate = new Date(article.CreatedAt);
        dateEl.textContent = createdDate.toLocaleDateString();

        // Updated
        if (article.UpdatedAt && article.UpdatedAt !== article.CreatedAt) {
          updatedEl.textContent = 'Updated';
        }
        // Reading Time
        readingTimeEl.textContent = `${article.ReadingTime || 1} min read`;

        // Likes
        likeCountEl.textContent = article.Likes || 0;
        if (article.likedByUser) likeIconEl.style.color = 'red'; // opsional

        // Image
        if (article.MainImage) {
          imgEl.src = `${BASE_URL}/${article.MainImage}`;
          imgEl.alt = article.Title;
        } else {
          imgEl.src = 'assets/img/no-image.png';
          imgEl.alt = 'No Image';
        }
        if (article.Caption) captionEl.textContent = article.Caption;

        // Content
        contentEl.innerHTML = article.Content || 'No content';

        // Load Comments
        loadComments();
      })
      .catch(err => {
        showAlert(`Error loading article: ${err.message}`, 'error');
      });

  // 2. Load Comments
  function loadComments() {
    fetch(commentUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch comments');
          return res.json();
        })
        .then(comments => {
          renderComments(comments);
        })
        .catch(err => {
          showAlert(`Error fetching comments: ${err.message}`, 'error');
        });
  }

  function renderComments(comments) {
    commentList.innerHTML = '';
    let total = 0;
    comments.forEach(c => {
      // Tampilkan only approved (asumsi backend filter, or check c.Approved)
      total += 1;
      const commentItem = createCommentItem(c);
      commentList.appendChild(commentItem);
    });
    commentCountEl.textContent = total;
  }

  function createCommentItem(comment) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('comment-item');

    const header = document.createElement('div');
    header.classList.add('comment-header');

    const author = document.createElement('span');
    author.classList.add('comment-author');
    author.textContent = comment.Name || 'Anonymous';

    const date = document.createElement('span');
    date.classList.add('comment-date');
    date.textContent = new Date(comment.CreatedAt).toLocaleString();

    const text = document.createElement('div');
    text.classList.add('comment-text');
    text.innerHTML = comment.Content; // jika plaintext, pakai textContent

    header.appendChild(author);
    header.appendChild(date);

    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Actions
    const actions = document.createElement('div');
    actions.classList.add('comment-actions');
    const replyBtn = document.createElement('span');
    replyBtn.textContent = 'Reply';
    replyBtn.addEventListener('click', () => {
      // Tampilkan form reply
      const replyForm = createReplyForm(comment.ID);
      wrapper.appendChild(replyForm);
    });
    actions.appendChild(replyBtn);
    wrapper.appendChild(actions);

    // Jika ada replies
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(child => {
        const childWrapper = document.createElement('div');
        childWrapper.classList.add('comment-reply-form');
        childWrapper.appendChild(createCommentItem(child));
        wrapper.appendChild(childWrapper);
      });
    }

    return wrapper;
  }

  function createReplyForm(parentId) {
    const formWrapper = document.createElement('div');
    formWrapper.classList.add('comment-reply-form');

    const replyForm = document.createElement('form');
    replyForm.classList.add('comment-form');
    replyForm.innerHTML = `
      <label>
        <input type="checkbox" class="anonymous-reply" />
        Reply as Anonymous
      </label>
      <div class="form-group reply-name-field">
        <label>Your Name</label>
        <input type="text" class="replyName" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="replyEmail" required />
      </div>
      <div class="form-group">
        <label>Your Reply</label>
        <div class="replyQuill" style="height: 100px;"></div>
      </div>
      <button type="submit" class="btn-submit">Submit Reply</button>
    `;
    formWrapper.appendChild(replyForm);

    // Inisialisasi Quill
    const quillEl = replyForm.querySelector('.replyQuill');
    const replyQuill = new Quill(quillEl, {
      theme: 'snow',
      placeholder: 'Write your reply here...',
    });

    const anonymousCheckbox = replyForm.querySelector('.anonymous-reply');
    const replyNameField = replyForm.querySelector('.reply-name-field');
    anonymousCheckbox.addEventListener('change', () => {
      replyNameField.style.display = anonymousCheckbox.checked ? 'none' : 'flex';
    });

    replyForm.addEventListener('submit', e => {
      e.preventDefault();
      const nameVal = anonymousCheckbox.checked
          ? 'Anonymous'
          : replyForm.querySelector('.replyName').value.trim();
      const emailVal = replyForm.querySelector('.replyEmail').value.trim();
      const contentVal = replyQuill.root.innerHTML;

      if (!emailVal || !contentVal) {
        showAlert('Please fill required fields!', 'warning');
        return;
      }

      const payload = {
        Name: nameVal,
        Email: emailVal,
        Content: contentVal,
        ParentID: parentId
      };

      fetch(commentUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
          .then(res => {
            if (!res.ok) throw new Error('Failed to submit reply');
            return res.json();
          })
          .then(_data => {
            showAlert('Reply submitted (awaiting approval)', 'success');
            // Remove form or keep for more replies
            formWrapper.remove();
          })
          .catch(err => {
            showAlert(`Error: ${err.message}`, 'error');
          });
    });

    return formWrapper;
  }

  // 3. Comment Form (New Comment)
  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    const isAnonymous = anonymousToggle.checked;
    const nameVal = isAnonymous ? 'Anonymous' : commentNameInput.value.trim();
    const emailVal = isAnonymous ? 'Anonymous' :commentEmailInput.value.trim();
    const contentVal = quill.root.innerHTML;

    if (isAnonymous === false && (!emailVal || !contentVal)) {
      showAlert('Please fill all required fields!', 'warning');
      return;
    }

    const payload = {
      Name: nameVal,
      Email: emailVal,
      Content: contentVal,
      ParentID: null
    };

    fetch(commentUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
        .then(res => {
          if (!res.ok) throw new Error('Failed to post comment');
          return res.json();
        })
        .then(_data => {
          showAlert('Comment submitted (awaiting approval)', 'success');
          // Reset
          quill.setText('');
          commentNameInput.value = '';
          commentEmailInput.value = '';
          anonymousToggle.checked = false;
          nameField.style.display = 'flex';
        })
        .catch(err => {
          showAlert(`Error: ${err.message}`, 'error');
        });
  });

  anonymousToggle.addEventListener('change', () => {
    if (anonymousToggle.checked) {
      nameField.style.display = 'none';  // sembunyikan nama
      emailField.style.display = 'none'; // sembunyikan email
    } else {
      nameField.style.display = 'flex';
      emailField.style.display = 'flex';
    }
  });

  // 4. Like Toggle
  let isLiked = false;
  likeIconEl.addEventListener('click', () => {
    fetch(likeUrl, { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to toggle like');
          return res.json();
        })
        .then(data => {
          // { liked: boolean, likes: number }
          isLiked = data.liked;
          likeCountEl.textContent = data.likes;
          likeIconEl.style.color = isLiked ? 'red' : '';
        })
        .catch(err => {
          showAlert(`Error: ${err.message}`, 'error');
        });
  });

  // 5. Related Posts
  fetch(allArticlesUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch all articles');
        return res.json();
      })
      .then(articles => {
        let others = articles.filter(a => a.ID != articleId);
        shuffleArray(others);
        others = others.slice(0, 3);
        renderRelatedPosts(others);
      })
      .catch(err => {
        console.error('Error fetching related articles:', err);
      });

  function renderRelatedPosts(articles) {
    relatedPostsContainer.innerHTML = '';
    articles.forEach(a => {
      const item = document.createElement('div');
      item.classList.add('related-item');

      const thumb = document.createElement('img');
      thumb.src = a.MainImage ? `${BASE_URL}/${a.MainImage}` : 'assets/img/no-image.png';
      thumb.alt = a.Title || 'Untitled';

      const info = document.createElement('div');
      info.classList.add('related-info');

      const link = document.createElement('a');
      link.classList.add('related-title');
      link.href = `read_article.html?id=${a.ID}`;
      link.textContent = a.Title || 'Untitled';

      const date = document.createElement('div');
      date.classList.add('related-date');
      date.textContent = new Date(a.CreatedAt).toLocaleDateString();

      info.appendChild(link);
      info.appendChild(date);

      item.appendChild(thumb);
      item.appendChild(info);
      relatedPostsContainer.appendChild(item);
    });
  }

  // Utils
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function showAlert(message, type='success') {
    alertMessage.textContent = message;
    customAlert.style.backgroundColor = getAlertColor(type);

    customAlert.classList.remove('hidden');
    customAlert.classList.add('show');

    setTimeout(() => {
      customAlert.classList.remove('show');
      customAlert.classList.add('hidden');
    }, 3000);
  }

  function getAlertColor(type) {
    switch(type) {
      case 'error': return '#d9534f';
      case 'warning': return '#f0ad4e';
      case 'info': return '#5bc0de';
      default:
        return '#2e5077'; // success
    }
  }
});
