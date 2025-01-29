document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const BASE_URL = 'http://157.245.57.235:8080';
    const loginEndpoint = `${BASE_URL}/login`;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Payload JSON
        const payload = {
            username,
            password
        };

        try {
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Misal 401 Unauthorized
                const errorData = await response.json();
                alert(`Login failed: ${errorData.message || 'Unknown error'}`);
                return;
            }

            // Jika sukses, server kirim { token: '...', username: '...' } (contoh)
            const data = await response.json();

            // Simpan token ke localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            alert(`Login success! Welcome, ${data.username || username}.`);

            // Redirect ke halaman admin dashboard
            window.location.href = '/admin/dashboard';

        } catch (err) {
            console.error('Error during login:', err);
            alert('An error occurred while logging in. Please try again.');
        }
    });
});
