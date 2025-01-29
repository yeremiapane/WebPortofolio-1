document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    // const confirmPasswordInput = document.getElementById('confirmPassword'); // jika Anda pakai konfirmasi

    // Endpoint register (sesuaikan dengan register.go)
    // Berdasarkan code, Anda sepertinya pakai "/admin/register"
    const registerEndpoint = `/admin/register`;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        // const confirmPassword = confirmPasswordInput.value.trim(); // opsional

        // Contoh validasi "confirm password"
        // if (password !== confirmPassword) {
        //   alert("Passwords do not match!");
        //   return;
        // }

        // Buat payload sesuai RegisterInput struct:
        // { "username": "...", "password": "..." }
        const payload = {
            username: username,
            password: password
        };

        try {
            const response = await fetch(registerEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Cek status code
                // Misal 409 (Conflict) -> Username already exists
                const errorData = await response.json();
                alert(`Register failed: ${errorData.error || 'Unknown error'}`);
                return;
            }

            // Jika sukses
            const data = await response.json();
            alert(`Success: ${data.message}`);

            // Mungkin redirect ke halaman login
            window.location.href = '/admin/login';
        } catch (err) {
            console.error('Error registering:', err);
            alert('An error occurred during registration. Please try again.');
        }
    });
});
