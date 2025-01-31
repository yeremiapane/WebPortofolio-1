package utils

import "strings"

// Template untuk email notifikasi ke Admin
// (menyampaikan bahwa ada komentar baru).
// Gunakan placeholder sbb:
// - $ARTICLE_ID
// - $ARTICLE_TITLE
// - $USER_NAME
// - $USER_EMAIL
// - $COMMENT_CONTENT
var AdminEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Comment Notification</title>
  <style>
    body {
      margin: 0; padding: 0;
      font-family: Arial, sans-serif;
      background-color: #1A1A1A;
      color: #FFFFFF;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #2E2E2E;
      padding: 20px;
    }
    h1 {
      background: linear-gradient(135deg, #09C6F9 0%, #045DE9 100%);
      padding: 30px;
      text-align: center;
      color: #fff;
      margin-top: 0;
      margin-bottom: 20px;
      text-shadow: 0 0 4px rgba(255,255,255,0.4);
    }
    .info {
      background-color: #3C3C3C;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .info p {
      margin: 5px 0;
    }
    .comment {
      background-color: #444;
      padding: 15px;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Comment on Your Article</h1>
    <div class="info">
      <p><strong>Article ID:</strong> $ARTICLE_ID</p>
      <p><strong>Article Title:</strong> $ARTICLE_TITLE</p>
      <p><strong>Comment from:</strong> $USER_NAME</p>
      <p><strong>User Email:</strong> $USER_EMAIL</p>
    </div>
    <div class="comment">
      <!-- Konten Quill (HTML) akan muncul di sini -->
      $COMMENT_CONTENT
    </div>
    <div class="footer">
      &copy; 2025 Futuristic Blog - Admin Panel
    </div>
  </div>
</body>
</html>
`

// Template untuk email notifikasi ke User
// (misalnya ketika Admin membalas komentar, atau notifikasi lain).
// Placeholder sbb:
// - $ARTICLE_ID
// - $ARTICLE_TITLE
// - $USER_NAME
// - $COMMENT_CONTENT (isi balasan dari Admin atau info lain)
var UserEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Comment Reply Notification</title>
  <style>
    body {
      margin: 0; padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 20px;
    }
    h1 {
      background: linear-gradient(135deg, #FA709A 0%, #FEE140 100%);
      padding: 30px;
      text-align: center;
      color: #222;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .info {
      background-color: #f7f7f7;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .info p {
      margin: 5px 0;
    }
    .comment {
      background-color: #fafafa;
      padding: 15px;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Comment Has a Reply</h1>
    <div class="info">
      <p><strong>Article ID:</strong> $ARTICLE_ID</p>
      <p><strong>Article Title:</strong> $ARTICLE_TITLE</p>
      <p><strong>Hello,</strong> $USER_NAME</p>
    </div>
    <div class="comment">
      $COMMENT_CONTENT
    </div>
    <div class="footer">
      &copy; 2025 Futuristic Blog - Thank you for commenting!
    </div>
  </div>
</body>
</html>
`

// Helper untuk menggantikan placeholder di template
func BuildEmailTemplate(template string, replacements map[string]string) string {
	result := template
	for placeholder, value := range replacements {
		result = strings.ReplaceAll(result, placeholder, value)
	}
	return result
}
