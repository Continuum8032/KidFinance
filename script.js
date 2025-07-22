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

// Конвертация павлушей в мамкоины
function convertCoins() {
    if (userData.pavlushi >= 10) {
        userData.mamcoins += Math.floor(userData.pavlushi / 10);
        userData.pavlushi = userData.pavlushi % 10;
    }
}

// Показать модальные окна
function showEarnModal() {
    document.getElementById('earnModal').style.display = 'block';
}

function showSpendModal() {
    document.getElementById('spendModal').style.display = 'block';
}

function showShopModal() {
    document.getElementById('shopModal').style.display = 'block';
}

// Закрыть все модальные окна
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
        
        convertCoins();
        
        userData.history.unshift({
            date: new Date().toLocaleString(),
            action: text,
            type: 'earn'
        });
        
        saveData();
        updateDisplay();
        closeModal();
        
        // Сброс выбора
        select.value = '';
    } else {
        alert('Выбери действие!');
    }
}

// Добавить штраф
function addSpending() {
    const select = document.getElementById('spendAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value) {
        // Вычитаем штраф
        if (value >= 10) {
            let mamcoinsToRemove = Math.floor(value / 10);
            let pavlushiToRemove = value % 10;
            
            // Если не хватает павлушей, конвертируем мамкоин
            if (userData.pavlushi < pavlushiToRemove) {
                if (userData.mamcoins > 0) {
                    userData.mamcoins--;
                    userData.pavlushi += 10;
                }
            }
            
            userData.pavlushi -= pavlushiToRemove;
            userData.mamcoins -= mamcoinsToRemove;
        } else {
            // Если не хватает павлушей, конвертируем мамкоин
            if (userData.pavlushi < value) {
                if (userData.mamcoins > 0) {
                    userData.mamcoins--;
                    userData.pavlushi += 10;
                }
            }
            userData.pavlushi -= value;
        }
        
        // Не допускаем отрицательные значения
        if (userData.mamcoins < 0) userData.mamcoins = 0;
        if (userData.pavlushi < 0) userData.pavlushi = 0;
        
        userData.history.unshift({
            date: new Date().toLocaleString(),
            action: text,
            type: 'spend'
        });
        
        saveData();
        updateDisplay();
        closeModal();
        
        select.value = '';
    } else {
        alert('Выбери проступок!');
    }
}

// Купить в магазине
function buyItem() {
    const select = document.getElementById('shopAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value) {
        const totalPavlushi = userData.mamcoins * 10 + userData.pavlushi;
        
        if (totalPavlushi >= value) {
            // Вычитаем стоимость
            let remainingPavlushi = totalPavlushi - value;
            userData.mamcoins = Math.floor(remainingPavlushi / 10);
            userData.pavlushi = remainingPavlushi % 10;
            
            userData.history.unshift({
                date: new Date().toLocaleString(),
                action: `🛒 Купил: ${text}`,
                type: 'buy'
            });
            
            saveData();
            updateDisplay();
            closeModal();
            
            alert(`🎉 Поздравляю! Ты купил: ${text.split('(')[0]}!`);
            select.value = '';
        } else {
            alert('😞 Не хватает мамкоинов! Нужно еще заработать.');
        }
    } else {
        alert('Выбери что хочешь купить!');
    }
}

// Обновление истории
function updateHistory() {
    const historyDiv = document.getElementById('history-list');
    historyDiv.innerHTML = '';
    
    userData.history.slice(0, 15).forEach(item => {
        const div = document.createElement('div');
        div.className = `history-item ${item.type}`;
        
        let emoji = '';
        if (item.type === 'earn') emoji = '✅';
        if (item.type === 'spend') emoji = '❌';
        if (item.type === 'buy') emoji = '🛒';
        
        div.innerHTML = `
            <span class="date">${item.date}</span>
            <span class="action">${emoji} ${item.action}</span>
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
