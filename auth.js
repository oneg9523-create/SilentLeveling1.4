/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const errorMsg = document.getElementById('error-msg');

    // Ensure the local database is ready
    function initDB() {
        if (!localStorage.getItem('sl_users')) {
            localStorage.setItem('sl_users', JSON.stringify([]));
        }
    }

    // Display errors to the user
    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg); // Fallback if the element is missing
        }
    }

    // --- SIGN UP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Strictly prevent the page from refreshing
            initDB();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!name || !email || !password) {
                showError('All fields are required.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('sl_users'));

            // Check if user already exists
            if (users.some(u => u.email === email)) {
                showError('This email is already registered.');
                return;
            }

            // Create and save new user
            users.push({ name, email, password });
            localStorage.setItem('sl_users', JSON.stringify(users));
            
            // Log the user in
            localStorage.setItem('sl_currentUser', email);
            
            // Redirect to dashboard (using replace so they can't hit "back" to go to signup)
            window.location.replace('dashboard.html');
        });
    }

    // --- SIGN IN LOGIC ---
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Strictly prevent the page from refreshing
            initDB();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showError('All fields are required.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('sl_users'));
            
            // Find matching user
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Log the user in
                localStorage.setItem('sl_currentUser', email);
                
                // Redirect to dashboard
                window.location.replace('dashboard.html');
            } else {
                showError('Invalid email or password.');
            }
        });
    }
});