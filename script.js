// Данные пользователя
let userData = {
    mamcoins: 0,
    pavlushi: 0,
    history: []
};

// Загрузка данных при старте
window.onload = function() {
    loadData();
    updateDisplay();
};

// Загрузка данных из localStorage
function loadData() {
    const saved = localStorage.getItem('mamcoins-data');
    if (saved) {
        userData = JSON.parse(saved);
    }
}

// Сохранение данных
function saveData() {
    localStorage.setItem('mamcoins-data', JSON.stringify(userData));
}

// Обновление отображения
function updateDisplay() {
    document.getElementById('mamcoins').textContent = userData.mamcoins;
    document.getElementById('pavlushi').textContent = userData.pavlushi;
    updateHistory();
}

// Показать модальное окно заработка
function showEarnModal() {
    document.getElementById('earnModal').style.display = 'block';
}

// Закрыть модальное окно
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Добавить заработок
function addEarning() {
    const select = document.getElementById('earnAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value) {
        if (value >= 10) {
            userData.mamcoins += Math.floor(value / 10);
            userData.pavlushi += value % 10;
        } else {
            userData.pavlushi += value;
        }
        
        // Конвертация павлушей в мамкоины
        if (userData.pavlushi >= 10) {
            userData.mamcoins += Math.floor(userData.pavlushi / 10);
            userData.pavlushi = userData.pavlushi % 10;
        }
        
        // Добавляем в историю
        userData.history.unshift({
            date: new Date().toLocaleDateString(),
            action: text,
            type: 'earn',
            value: value
        });
        
        saveData();
        updateDisplay();
        closeModal();
    }
}

// Обновление истории
function updateHistory() {
    const historyDiv = document.getElementById('history-list');
    historyDiv.innerHTML = '';
    
    userData.history.slice(0, 10).forEach(item => {
        const div = document.createElement('div');
        div.className = `history-item ${item.type}`;
        div.innerHTML = `
            <span class="date">${item.date}</span>
            <span class="action">${item.action}</span>
        `;
        historyDiv.appendChild(div);
    });
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
}
