document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const errorMsg = document.getElementById('error-msg');

    function initDB() {
        if (!localStorage.getItem('sl_users')) {
            localStorage.setItem('sl_users', JSON.stringify([]));
        }
    }

    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }


    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            initDB();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!name || !email || !password) {
                showError('All fields are required.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('sl_users'));


            if (users.some(u => u.email === email)) {
                showError('This email is already registered.');
                return;
            }


            users.push({ name, email, password });
            localStorage.setItem('sl_users', JSON.stringify(users));
            

            localStorage.setItem('sl_currentUser', email);
            
            window.location.replace('dashboard.html');
        });
    }


    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            initDB();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showError('All fields are required.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('sl_users'));
            

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('sl_currentUser', email);
                
                window.location.replace('dashboard.html');
            } else {
                showError('Invalid email or password.');
            }
        });
    }
});
