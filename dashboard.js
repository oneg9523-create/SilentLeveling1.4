document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('sl_currentUser');
    if (!currentUser) {
        window.location.href = 'signin.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('sl_users')) || [];
    const user = users.find(u => u.email === currentUser);
    
    document.getElementById('greeting').textContent = `Welcome, ${user.name.split(' ')[0]}`;
    
    const date = new Date();
    const monthNames = ["January", "February", "March", "April Fools Month", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('currentMonthStr').textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const defaultHabits = [
        "Wake up at 5am ⏰",
        "Gym/Stretch 💪",
        "Meditate 🧘",
        "Cold Shower 🚿",
        "Reading / Learning 📖",
        "Budget Tracking 💰",
        "Project Work 🎯",
        "No Sugar 🍬",
        "No Alcohol/Soft Drinks 🍺",
        "Social Media Detox 🌿",
        "Drink 3L of Water 💧",
        "Goal Journaling 📜"
    ];
    const dataKey = `sl_data_${currentUser}`;
    let userData = JSON.parse(localStorage.getItem(dataKey));


    if (!userData || !userData.habits || userData.habits.length === 0) {
        userData = {
            habits: defaultHabits.map(name => ({
                name: name,
                days: Array(daysInMonth).fill(false)
            }))
        };
        saveData();
    }

    const trackerGrid = document.getElementById('trackerGrid');
    const addHabitForm = document.getElementById('addHabitForm');
    const statCompleted = document.getElementById('statCompleted');
    const statRate = document.getElementById('statRate');

    function renderGrid() {
        trackerGrid.innerHTML = '';
        trackerGrid.style.gridTemplateColumns = `200px repeat(${daysInMonth}, minmax(32px, 1fr))`;

        // Render Day Headers (1-31)
        const emptyHeader = document.createElement('div');
        trackerGrid.appendChild(emptyHeader);
        for (let i = 1; i <= daysInMonth; i++) {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'grid-header';
            dayHeader.textContent = i;
            trackerGrid.appendChild(dayHeader);
        }
        userData.habits.forEach((habit, hIndex) => {
            const nameContainer = document.createElement('div');
            nameContainer.className = 'habit-name';
            nameContainer.textContent = habit.name;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'habit-row-delete';
            delBtn.innerHTML = '✕';
            delBtn.onclick = () => deleteHabit(hIndex);
            nameContainer.appendChild(delBtn);

            trackerGrid.appendChild(nameContainer);

            for (let i = 0; i < daysInMonth; i++) {
                const cell = document.createElement('div');
                cell.className = `habit-cell ${habit.days[i] ? 'done' : ''}`;
                cell.onclick = () => toggleHabit(hIndex, i);
                trackerGrid.appendChild(cell);
            }
        });

        updateStats();
    }

    function toggleHabit(hIndex, dayIndex) {
        userData.habits[hIndex].days[dayIndex] = !userData.habits[hIndex].days[dayIndex];
        saveData();
        renderGrid();
    }

    function deleteHabit(hIndex) {
        if(confirm('Remove this habit from your system?')) {
            userData.habits.splice(hIndex, 1);
            saveData();
            renderGrid();
        }
    }

    function saveData() {
        localStorage.setItem(dataKey, JSON.stringify(userData));
    }

    function updateStats() {
        let totalPossible = userData.habits.length * daysInMonth;
        let totalDone = 0;

        userData.habits.forEach(habit => {
            totalDone += habit.days.filter(d => d === true).length;
        });

        statCompleted.textContent = totalDone;
        let rate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
        statRate.textContent = `${rate}%`;
    }

    addHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newHabitName');
        const name = input.value.trim();
        if (name) {
            userData.habits.push({
                name: name,
                days: Array(daysInMonth).fill(false)
            });
            input.value = '';
            saveData();
            renderGrid();
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('sl_currentUser');
        window.location.href = 'index.html';
    });

    renderGrid();
});
