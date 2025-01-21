document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateArticleForm');
    if (!form) {
        console.error("Update form not found!");
        return;
    }

    Quill.register('modules/blotFormatter', QuillBlotFormatter.default);
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
    ];

    const quill = new Quill('#quillEditor', {
        theme: 'snow',
        placeholder: 'Start writing your article here...',
        modules: {
            toolbar: toolbarOptions,
            syntax: {
                highlight: text => hljs.highlightAuto(text).value
            },
            blotFormatter: {}
        }
    });

    // Get article ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    if (!articleId) {
        alert("Article ID not found in URL.");
        return;
    }

    // Fetch article details to populate form fields
    fetch(`/articles/${articleId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch article details');
            }
            return response.json();
        })
        .then(article => {
            document.getElementById('title').value = article.title || '';
            document.getElementById('author').value = article.author || '';
            document.getElementById('category').value = article.category || '';
            document.getElementById('tags').value = article.tags || '';
            document.getElementById('description').value = article.description || '';

            // Set Quill content jika ada konten
            if (article.content) {
                quill.root.innerHTML = article.content;
            }
            // Note: Tidak bisa mengisi input file (image) secara otomatis untuk alasan keamanan
        })
        .catch(error => {
            console.error(error);
            alert('Error loading article details');
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const content = quill.root.innerHTML.trim();
        const category = document.getElementById('category').value.trim();
        const description = document.getElementById('description').value.trim();
        const author = document.getElementById('author').value.trim();
        const tags = document.getElementById('tags').value.trim();
        const imageInput = document.getElementById('image');
        const image = imageInput.files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('author', author);
        formData.append('tags', tags);

        // Append published_at as current time in ISO format
        formData.append('published_at', new Date().toISOString());

        if (image) {
            formData.append('image', image);
        }

        fetch(`/articles/${articleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                // Jangan set Content-Type untuk FormData
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text || 'Failed to update article'); });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Article updated successfully!');
                loadContent("dashboard.html", "Dashboard")
            })
            .catch(error => {
                console.error(error);
                alert('Error updating article: ' + error.message);
            });
    });
});

const previewButton = document.getElementById('previewButton');
const previewModal = document.getElementById('previewModal');
const previewContent = document.getElementById('previewContent');
const closePreview = document.getElementById('closePreview');

if (previewButton) {
    previewButton.addEventListener('click', () => {
        const title = document.getElementById('title')?.value || '';
        const author = document.getElementById('author')?.value || '';
        const imageFile = document.getElementById('image')?.files[0];
        const content = quill.root.innerHTML;

        let imagePreviewUrl = '';
        if (imageFile) {
            imagePreviewUrl = URL.createObjectURL(imageFile);
        }

        const sanitizedContent = DOMPurify.sanitize(content);

        previewContent.innerHTML = `
              <section class="flex flex-column" id="mainArticle">
                <header id="article_title">
                  <h1>${title}</h1>
                </header>
                <div id="main_article_image">
                  ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${title}" />` : ''}
                </div>
                <article class="flex flex-column">
                  <div class="content">
                    <header id="article_writers">
                      <h4>By ${author}</h4>
                      <p>${new Date().toLocaleDateString()}</p>
                    </header>
                  </div>
                  <p>${sanitizedContent}</p>
                </article>
              </section>
            `;
        previewModal.style.display = 'block';
    });
}

if (closePreview) {
    closePreview.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });
}