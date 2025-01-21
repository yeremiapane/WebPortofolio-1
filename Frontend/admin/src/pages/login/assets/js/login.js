document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!username || username.length < 3 || !password) {
            alert("Username must be at least 3 characters and password should not be empty!");
            return;
        }

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                const messageDiv = document.getElementById("login-message");

                if (data.message === "Login Successful" && data.token) {
                    localStorage.setItem('authToken', data.token);
                    messageDiv.className = "alert alert-success";
                    messageDiv.textContent = "Login successful!";
                    messageDiv.style.display = "block";


                    console.log('Token:', data.token);

                    window.location.href = '/frontend/admin/src/pages/dashboard/index.html';
                } else {
                    throw new Error("Invalid credentials");
                }
            })
            .catch(error => {
                const messageDiv = document.getElementById("login-message");
                messageDiv.className = "alert alert-danger";
                messageDiv.textContent =
                    error.message === "Login failed"
                        ? "Invalid username or password!"
                        : "An unexpected error occurred. Please try again later.";
                messageDiv.style.display = "block";
            });
    });
});