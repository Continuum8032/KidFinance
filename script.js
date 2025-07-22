// Конфигурация Firebase (ваша)
const firebaseConfig = {
    apiKey: "AIzaSyB8i6XUdNv8XdMEtip7mMBZe_f1-6MuawE",
    authDomain: "mamcoins-tracker.firebaseapp.com",
    projectId: "mamcoins-tracker",
    storageBucket: "mamcoins-tracker.firebasestorage.app",
    messagingSenderId: "655371831130",
    appId: "1:655371831130:web:1bd473c42b14cb4bd15563"
};

// Инициализация Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID пользователя (можно изменить на уникальный для каждой семьи)
const USER_ID = 'family_main';

let mamcoins = 0;
let pavlushi = 0;
let history = [];
let isOnline = true;

// Проверка соединения
function checkOnlineStatus() {
    isOnline = navigator.onLine;
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
        statusIndicator.textContent = isOnline ? '🌐 Онлайн' : '📴 Оффлайн';
        statusIndicator.style.color = isOnline ? '#4caf50' : '#f44336';
    }
}

// Загрузка данных из Firebase
async function loadData() {
    console.log('🔄 Загружаем данные...');
    
    try {
        const docRef = doc(db, 'mamcoins', USER_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            mamcoins = data.mamcoins || 0;
            pavlushi = data.pavlushi || 0;
            history = data.history || [];
            console.log('✅ Данные загружены из Firebase');
        } else {
            console.log('📝 Создаем новый профиль');
            // Создаем новый документ
            await saveData();
        }
        
        updateDisplay();
        renderHistory();
        
        // Подписка на изменения в реальном времени
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const newMamcoins = data.mamcoins || 0;
                const newPavlushi = data.pavlushi || 0;
                const newHistory = data.history || [];
                
                // Обновляем только если данные действительно изменились
                if (newMamcoins !== mamcoins || newPavlushi !== pavlushi || 
                    JSON.stringify(newHistory) !== JSON.stringify(history)) {
                    
                    mamcoins = newMamcoins;
                    pavlushi = newPavlushi;
                    history = newHistory;
                    
                    updateDisplay();
                    renderHistory();
                    
                    console.log('🔄 Данные синхронизированы');
                }
            }
        });
        
        isOnline = true;
        checkOnlineStatus();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки из Firebase:', error);
        isOnline = false;
        checkOnlineStatus();
        
        // Загружаем из localStorage как резерв
        loadFromLocalStorage();
    }
}

// Сохранение данных в Firebase
async function saveData() {
    try {
        const docRef = doc(db, 'mamcoins', USER_ID);
        const dataToSave = {
            mamcoins: mamcoins,
            pavlushi: pavlushi,
            history: history,
            lastUpdated: new Date().toISOString()
        };
        
        await setDoc(docRef, dataToSave);
        console.log('💾 Данные сохранены в Firebase');
        
        // Также сохраняем локально как резерв
        saveToLocalStorage();
        
        isOnline = true;
        checkOnlineStatus();
        
    } catch (error) {
        console.error('❌ Ошибка сохранения в Firebase:', error);
        isOnline = false;
        checkOnlineStatus();
        
        // Сохраняем локально если Firebase недоступен
        saveToLocalStorage();
    }
}

// Резервные функции для localStorage
function loadFromLocalStorage() {
    mamcoins = parseInt(localStorage.getItem('mamcoins')) || 0;
    pavlushi = parseInt(localStorage.getItem('pavlushi')) || 0;
    
    const savedHistory = localStorage.getItem('history');
    history = savedHistory ? JSON.parse(savedHistory) : [];
    
    updateDisplay();
    renderHistory();
    console.log('📱 Данные загружены из локального хранилища');
}

function saveToLocalStorage() {
    localStorage.setItem('mamcoins', mamcoins.toString());
    localStorage.setItem('pavlushi', pavlushi.toString());
    localStorage.setItem('history', JSON.stringify(history));
    console.log('💾 Данные сохранены локально');
}

// Обновление отображения
function updateDisplay() {
    const mamcoinsElement = document.getElementById('mamcoins');
    const pavlushiElement = document.getElementById('pavlushi');
    
    if (mamcoinsElement) mamcoinsElement.textContent = mamcoins;
    if (pavlushiElement) pavlushiElement.textContent = pavlushi;
}

// Автоматическая конвертация павлушей в мамкоины
function convertCurrency() {
    if (pavlushi >= 10) {
        const newMamcoins = Math.floor(pavlushi / 10);
        mamcoins += newMamcoins;
        pavlushi = pavlushi % 10;
        
        if (newMamcoins > 0) {
            addToHistory(`Конвертировано в мамкоины`, `+${newMamcoins} 🟢`, 'positive');
            
            // Показать уведомление о конвертации
            showNotification(`Конвертировано: +${newMamcoins} 🟢`);
        }
    }
}

// Уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Убираем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавление в историю
function addToHistory(text, amount, type = 'positive') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateStr = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
    });
    
    history.unshift({
        text: text,
        amount: amount,
        type: type,
        time: timeStr,
        date: dateStr,
        timestamp: now.toISOString()
    });
    
    // Ограничиваем историю 100 записями
    if (history.length > 100) {
        history = history.slice(0, 100);
    }
    
    renderHistory();
}

// Отображение истории
function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; color: #666; font-size: 10px; padding: 20px;">
                История операций пока пустая 🦊<br>
                Начни зарабатывать мамкоины!
            </div>
        `;
        return;
    }
    
    // Показываем последние 20 записей
    history.slice(0, 20).forEach(item => {
        const div = document.createElement('div');
        div.className = `history-item ${item.type}`;
        div.innerHTML = `
            <div class="history-text">${item.text}</div>
            <div class="history-amount">${item.amount}</div>
            <div style="font-size: 8px; color: #666; margin-top: 2px;">
                ${item.date} ${item.time}
            </div>
        `;
        historyList.appendChild(div);
    });
}

// Добавление мамкоинов/павлушей
function addCurrency(amount, description, type = 'positive') {
    pavlushi += amount;
    convertCurrency();
    updateDisplay();
    
    const displayAmount = amount >= 10 ? 
        `+${Math.floor(amount/10)} 🟢 ${amount%10} 🟡` : 
        `+${amount} 🟡`;
    
    addToHistory(description, displayAmount, type);
    saveData();
    
    // Анимация увеличения баланса
    animateBalance('positive');
}

// Отнимание мамкоинов/павлушей
function subtractCurrency(amount, description) {
    const totalPavlushi = mamcoins * 10 + pavlushi;
    
    if (totalPavlushi < amount) {
        showNotification('❌ Недостаточно мамкоинов!');
        return false;
    }
    
    // Сначала отнимаем из павлушей
    if (pavlushi >= amount) {
        pavlushi -= amount;
    } else {
        // Если не хватает павлушей, конвертируем мамкоины
        const neededPavlushi = amount - pavlushi;
        const neededMamcoins = Math.ceil(neededPavlushi / 10);
        
        mamcoins -= neededMamcoins;
        pavlushi = (neededMamcoins * 10) - neededPavlushi;
    }
    
    updateDisplay();
    
    const displayAmount = amount >= 10 ? 
        `-${Math.floor(amount/10)} 🟢 ${amount%10} 🟡` : 
        `-${amount} 🟡`;
    
    addToHistory(description, displayAmount, 'negative');
    saveData();
    
    // Анимация уменьшения баланса
    animateBalance('negative');
    
    return true;
}

// Покупка в магазине
function purchase(cost, description) {
    const totalPavlushi = mamcoins * 10 + pavlushi;
    
    if (totalPavlushi < cost) {
        showNotification('❌ Недостаточно мамкоинов для покупки!');
        return false;
    }
    
    // Отнимаем из общего количества
    if (pavlushi >= cost) {
        pavlushi -= cost;
    } else {
        const neededFromMamcoins = cost - pavlushi;
        const mamcoinsToSpend = Math.ceil(neededFromMamcoins / 10);
        
        mamcoins -= mamcoinsToSpend;
        pavlushi = (mamcoinsToSpend * 10) - neededFromMamcoins;
    }
    
    updateDisplay();
    
    const displayAmount = cost >= 10 ? 
        `-${Math.floor(cost/10)} 🟢 ${cost%10} 🟡` : 
        `-${cost} 🟡`;
    
    addToHistory(`Купил: ${description}`, displayAmount, 'purchase');
    saveData();
    
    // Анимация покупки
    animateBalance('purchase');
    showNotification(`🛒 Куплено: ${description}`);
    
    return true;
}

// Анимация баланса
function animateBalance(type) {
    const mamcoinsEl = document.getElementById('mamcoins');
    const pavlushiEl = document.getElementById('pavlushi');
    
    const color = type === 'positive' ? '#4caf50' : 
                 type === 'negative' ? '#f44336' : '#2196f3';
    
    [mamcoinsEl, pavlushiEl].forEach(el => {
        if (el) {
            el.style.color = color;
            el.style.transform = 'scale(1.2)';
            
            setTimeout(() => {
                el.style.color = '';
                el.style.transform = '';
            }, 500);
        }
    });
}

// Модальные окна
function showEarnModal() {
    document.getElementById('earnModal').style.display = 'block';
}

function showSpendModal() {
    document.getElementById('spendModal').style.display = 'block';
}

function showShopModal() {
    document.getElementById('shopModal').style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Подтверждение действий
function confirmEarn() {
    const select = document.getElementById('earnAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value && text) {
        const cleanText = text.replace(/\s*\([^)]*\)/g, '').trim();
        addCurrency(value, cleanText, 'positive');
        select.value = '';
        hideModal('earnModal');
    } else {
        showNotification('⚠️ Выберите действие!');
    }
}

function confirmSpend() {
    const select = document.getElementById('spendAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value && text) {
        const cleanText = text.replace(/\s*\([^)]*\)/g, '').trim();
        if (subtractCurrency(value, cleanText)) {
            select.value = '';
            hideModal('spendModal');
        }
    } else {
        showNotification('⚠️ Выберите проступок!');
    }
}

function confirmShop() {
    const select = document.getElementById('shopAction');
    const value = parseInt(select.value);
    const text = select.options[select.selectedIndex].text;
    
    if (value && text) {
        const cleanText = text.replace(/\s*\([^)]*\)/g, '').trim();
        if (purchase(value, cleanText)) {
            select.value = '';
            hideModal('shopModal');
        }
    } else {
        showNotification('⚠️ Выберите покупку!');
    }
}

// Дополнительные функции управления
function clearHistory() {
    if (confirm('🗑️ Очистить всю историю операций?')) {
        history = [];
        renderHistory();
        saveData();
        showNotification('🗑️ История очищена');
    }
}

function resetBalance() {
    if (confirm('⚠️ Сбросить баланс мамкоинов до нуля?')) {
        mamcoins = 0;
        pavlushi = 0;
        updateDisplay();
        addToHistory('Баланс сброшен', '0 🟢 0 🟡', 'negative');
        saveData();
        showNotification('🔄 Баланс сброшен');
    }
}

// События для закрытия модальных окон
function setupModalEvents() {
    // Закрытие при клике вне модального окна
    window.addEventListener('click', (event) => {
        const modals = ['earnModal', 'spendModal', 'shopModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                hideModal(modalId);
            }
        });
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const modals = ['earnModal', 'spendModal', 'shopModal'];
            modals.forEach(modalId => {
                hideModal(modalId);
            });
        }
    });
}

// Обработчики событий онлайн/оффлайн
function setupConnectionEvents() {
    window.addEventListener('online', () => {
        console.log('🌐 Соединение восстановлено');
        checkOnlineStatus();
        // Попытаться синхронизировать данные
        saveData();
    });
    
    window.addEventListener('offline', () => {
        console.log('📴 Соединение потеряно');
        checkOnlineStatus();
    });
}

// Инициализация приложения
function initApp() {
    console.log('🚀 Запуск приложения Мамкоины...');
    
    // Проверка поддержки браузера
    if (!window.navigator.onLine === undefined) {
        console.warn('⚠️ Браузер не поддерживает проверку соединения');
    }
    
    // Настройка событий
    setupModalEvents();
    setupConnectionEvents();
    
    // Добавление индикатора статуса
    const header = document.querySelector('header h1');
    if (header) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'status-indicator';
        statusDiv.style.cssText = `
            font-size: 8px;
            margin-top: 5px;
            opacity: 0.8;
        `;
        header.appendChild(statusDiv);
    }
    
    // Загрузка данных
    loadData();
    checkOnlineStatus();
}

// Загрузка данных при старте страницы
document.addEventListener('DOMContentLoaded', initApp);

// Глобальные функции для HTML
window.showEarnModal = showEarnModal;
window.showSpendModal = showSpendModal;  
window.showShopModal = showShopModal;
window.hideModal = hideModal;
window.confirmEarn = confirmEarn;
window.confirmSpend = confirmSpend;
window.confirmShop = confirmShop;
window.clearHistory = clearHistory;
window.resetBalance = resetBalance;

// CSS стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(300px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(300px); opacity: 0; }
    }
    
    #mamcoins, #pavlushi {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

console.log('✅ Скрипт мамкоинов загружен!');
