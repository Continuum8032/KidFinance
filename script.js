// Конфигурация Firebase (ваша)
const firebaseConfig = {
  apiKey: 'AIzaSyB8i6XUdNv8XdMEtip7mMBZe_f1-6MuawE',
  authDomain: 'mamcoins-tracker.firebaseapp.com',
  projectId: 'mamcoins-tracker',
  storageBucket: 'mamcoins-tracker.firebasestorage.app',
  messagingSenderId: '655371831130',
  appId: '1:655371831130:web:1bd473c42b14cb4bd15563',
};

// Инициализация Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID пользователя (можно сделать выбор пользователя позже)
const userId = 'family_child_1'; // Пока один ребенок

// Локальные переменные
let mamcoins = 0;
let pavlushi = 0;
let history = [];
let isLoading = true;

// Загружаем данные при запуске
window.addEventListener('DOMContentLoaded', function () {
  console.log('🦊 Загружаем данные из Firebase...');
  loadFromFirebase();
});

// Загрузка данных из Firebase
async function loadFromFirebase() {
  try {
    const userDoc = doc(db, 'users', userId);
    
    // Слушаем изменения в реальном времени
    onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        mamcoins = data.mamcoins || 0;
        pavlushi = data.pavlushi || 0;
        history = data.history || [];
        
        console.log(`💰 Загружено: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
      } else {
        // Создаем новый документ для пользователя
        console.log('👶 Создаем нового пользователя');
        createNewUser();
      }
      
      isLoading = false;
      updateDisplay();
      loadHistory();
    });
    
  } catch (error) {
    console.error('❌ Ошибка загрузки из Firebase:', error);
    
    // Fallback на localStorage если Firebase не работает
    console.log('📱 Используем локальное хранение');
    loadFromLocalStorage();
    isLoading = false;
  }
}

// Создание нового пользователя
async function createNewUser() {
  try {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, {
      mamcoins: 0,
      pavlushi: 0,
      history: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
    console.log('✅ Новый пользователь создан');
  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error);
  }
}

// Сохранение данных в Firebase
async function saveToFirebase() {
  if (isLoading) return;
  
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      mamcoins: mamcoins,
      pavlushi: pavlushi,
      history: history,
      lastActive: new Date().toISOString()
    });
    
    console.log(`💾 Сохранено: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
    
  } catch (error) {
    console.error('❌ Ошибка сохранения в Firebase:', error);
    
    // Fallback на localStorage
    saveToLocalStorage();
  }
}

// Fallback методы для localStorage
function loadFromLocalStorage() {
  const savedMamcoins = localStorage.getItem('mamcoins');
  const savedPavlushi = localStorage.getItem('pavlushi');
  const savedHistory = localStorage.getItem('history');
  
  if (savedMamcoins !== null) {
    mamcoins = parseInt(savedMamcoins);
  }
  
  if (savedPavlushi !== null) {
    pavlushi = parseInt(savedPavlushi);
  }
  
  if (savedHistory) {
    try {
      history = JSON.parse(savedHistory);
    } catch (e) {
      history = [];
    }
  }
  
  updateDisplay();
  loadHistory();
}

function saveToLocalStorage() {
  localStorage.setItem('mamcoins', mamcoins.toString());
  localStorage.setItem('pavlushi', pavlushi.toString());
  localStorage.setItem('history', JSON.stringify(history));
}

// Обновление отображения
function updateDisplay() {
  document.getElementById('mamcoins').textContent = mamcoins;
  document.getElementById('pavlushi').textContent = pavlushi;
}

// Конвертация павлушей в мамкоины
function convertPavlushi() {
  if (pavlushi >= 10) {
    const newMamcoins = Math.floor(pavlushi / 10);
    mamcoins += newMamcoins;
    pavlushi = pavlushi % 10;
    
    addToHistory(`🔄 Конвертация: ${newMamcoins} мамкоинов из павлушей`, 'earn');
    updateDisplay();
  }
}

// Добавление записи в историю
function addToHistory(text, type = 'earn') {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  
  const newHistoryItem = {
    text: text,
    time: timeStr,
    type: type,
    timestamp: now.getTime()
  };
  
  history.unshift(newHistoryItem);
  
  // Ограничиваем историю 50 записями
  if (history.length > 50) {
    history = history.slice(0, 50);
  }
  
  saveToFirebase();
  loadHistory();
}

// Загрузка истории
function loadHistory() {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  // Показываем индикатор загрузки
  if (isLoading) {
    historyList.innerHTML = '<div class="history-item">🔄 Загрузка...</div>';
    return;
  }
  
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-item">📝 История пуста</div>';
    return;
  }
  
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = `history-item ${item.type}`;
    div.innerHTML = `<strong>[${item.time}]</strong> ${item.text}`;
    historyList.appendChild(div);
  });
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

// Закрыть модальные окна
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  
  // Очистить выбор
  const selectors = {
    'earnModal': 'earnAction',
    'spendModal': 'spendAction',
    'shopModal': 'shopAction'
  };
  
  if (selectors[modalId]) {
    const selectElement = document.getElementById(selectors[modalId]);
    if (selectElement) {
      selectElement.value = '';
    }
  }
}

// Подтвердить заработок
function confirmEarn() {
  const select = document.getElementById('earnAction');
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;
  
  if (!value || !text) {
    alert('Выберите действие!');
    return;
  }
  
  // Добавляем павлуши
  pavlushi += value;
  
  // Автоматически конвертируем в мамкоины
  convertPavlushi();
  
  addToHistory(`✅ ${text}`, 'earn');
  
  closeModal('earnModal');
}

// Подтвердить штраф
function confirmSpend() {
  const select = document.getElementById('spendAction');
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;
  
  if (!value || !text) {
    alert('Выберите проступок!');
    return;
  }
  
  // Вычитаем павлуши или мамкоины
  if (value >= 100) { // Это мамкоины (значения 100 и больше)
    const mamcoinsToRemove = Math.floor(value / 10);
    if (mamcoins >= mamcoinsToRemove) {
      mamcoins -= mamcoinsToRemove;
    } else {
      // Конвертируем все мамкоины в павлуши и вычитаем
      const totalPavlushi = (mamcoins * 10) + pavlushi;
      if (totalPavlushi >= value) {
        const remainingPavlushi = totalPavlushi - value;
        mamcoins = Math.floor(remainingPavlushi / 10);
        pavlushi = remainingPavlushi % 10;
      } else {
        mamcoins = 0;
        pavlushi = 0;
      }
    }
  } else { // Это павлуши
    if (pavlushi >= value) {
      pavlushi -= value;
    } else {
      // Берем из мамкоинов
      const totalPavlushi = (mamcoins * 10) + pavlushi;
      if (totalPavlushi >= value) {
        const remainingPavlushi = totalPavlushi - value;
        mamcoins = Math.floor(remainingPavlushi / 10);
        pavlushi = remainingPavlushi % 10;
      } else {
        mamcoins = 0;
        pavlushi = 0;
      }
    }
  }
  
  addToHistory(`❌ ${text}`, 'spend');
  
  closeModal('spendModal');
}

// Подтвердить покупку
function confirmShop() {
  const select = document.getElementById('shopAction');
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;
  
  if (!value || !text) {
    alert('Выберите награду!');
    return;
  }
  
  // Проверяем, достаточно ли мамкоинов
  const mamcoinsNeeded = Math.floor(value / 10);
  const totalMamcoins = mamcoins + Math.floor(pavlushi / 10);
  
  if (totalMamcoins < mamcoinsNeeded) {
    alert(`Недостаточно мамкоинов! Нужно: ${mamcoinsNeeded}, есть: ${totalMamcoins}`);
    return;
  }
  
  // Списываем мамкоины
  const totalPavlushi = (mamcoins * 10) + pavlushi;
  const remainingPavlushi = totalPavlushi - value;
  
  mamcoins = Math.floor(remainingPavlushi / 10);
  pavlushi = remainingPavlushi % 10;
  
  addToHistory(`🛒 Купил: ${text}`, 'shop');
  
  closeModal('shopModal');
}

// Закрытие модальных окон по клику вне их
window.onclick = function(event) {
  const modals = ['earnModal', 'spendModal', 'shopModal'];
  
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      closeModal(modalId);
    }
  });
}

// Глобальные функции для HTML
window.showEarnModal = showEarnModal;
window.showSpendModal = showSpendModal;
window.showShopModal = showShopModal;
window.closeModal = closeModal;
window.confirmEarn = confirmEarn;
window.confirmSpend = confirmSpend;
window.confirmShop = confirmShop;
