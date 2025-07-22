// Конфигурация Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB8i6XUdNv8XdMEtip7mMBZe_f1-6MuawE',
  authDomain: 'mamcoins-tracker.firebaseapp.com',
  projectId: 'mamcoins-tracker',
  storageBucket: 'mamcoins-tracker.firebasestorage.app',
  messagingSenderId: '655371831130',
  appId: '1:655371831130:web:1bd473c42b14cb4bd15563',
};

// Глобальные переменные
let mamcoins = 0;
let pavlushi = 0;
let history = [];
let isLoading = true;
let db = null;
let userId = 'family_child_1';

// Инициализация Firebase v8
function initializeFirebase() {
  try {
    console.log('🔥 Инициализируем Firebase v8...');
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('✅ Firebase v8 инициализирован');
    startDataListener();
  } catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
    console.log('📱 Используем localStorage');
    loadFromLocalStorage();
    isLoading = false;
    updateDisplay();
    loadHistory();
  }
}

// Слушатель изменений данных Firebase
function startDataListener() {
  try {
    const userDocRef = db.collection('users').doc(userId);
    
    userDocRef.onSnapshot((docSnapshot) => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        mamcoins = data.mamcoins || 0;
        pavlushi = data.pavlushi || 0;
        history = data.history || [];
        
        console.log(`💰 Загружено из Firebase: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
      } else {
        console.log('👶 Создаем нового пользователя');
        createNewUser();
      }
      
      isLoading = false;
      updateDisplay();
      loadHistory();
    }, (error) => {
      console.error('❌ Ошибка подключения к Firebase:', error);
      loadFromLocalStorage();
      isLoading = false;
      updateDisplay();
      loadHistory();
    });
    
  } catch (error) {
    console.error('❌ Ошибка настройки слушателя Firebase:', error);
    loadFromLocalStorage();
    isLoading = false;
    updateDisplay();
    loadHistory();
  }
}

// Создание нового пользователя в Firebase
function createNewUser() {
  try {
    const userDocRef = db.collection('users').doc(userId);
    
    userDocRef.set({
      mamcoins: 0,
      pavlushi: 0,
      history: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastActive: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      console.log('✅ Новый пользователь создан в Firebase');
    }).catch((error) => {
      console.error('❌ Ошибка создания пользователя:', error);
    });
    
  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error);
  }
}

// Сохранение в Firebase
function saveToFirebase() {
  if (isLoading || !db) {
    console.log('⏳ Firebase не готов, сохраняем локально');
    saveToLocalStorage();
    return;
  }
  
  try {
    const userDocRef = db.collection('users').doc(userId);
    
    userDocRef.update({
      mamcoins: mamcoins,
      pavlushi: pavlushi,
      history: history,
      lastActive: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      console.log(`💾 Сохранено в Firebase: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
    }).catch((error) => {
      console.error('❌ Ошибка сохранения в Firebase:', error);
      saveToLocalStorage();
    });
    
  } catch (error) {
    console.error('❌ Ошибка сохранения в Firebase:', error);
    saveToLocalStorage();
  }
}

// Fallback методы для localStorage
function loadFromLocalStorage() {
  const savedMamcoins = localStorage.getItem('mamcoins');
  const savedPavlushi = localStorage.getItem('pavlushi');
  const savedHistory = localStorage.getItem('history');

  if (savedMamcoins !== null) {
    mamcoins = parseInt(savedMamcoins) || 0;
  }

  if (savedPavlushi !== null) {
    pavlushi = parseInt(savedPavlushi) || 0;
  }

  if (savedHistory) {
    try {
      history = JSON.parse(savedHistory) || [];
    } catch (e) {
      history = [];
    }
  }

  console.log(`📱 Загружено из localStorage: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
}

function saveToLocalStorage() {
  localStorage.setItem('mamcoins', mamcoins.toString());
  localStorage.setItem('pavlushi', pavlushi.toString());
  localStorage.setItem('history', JSON.stringify(history));
  
  console.log(`📱 Сохранено в localStorage: ${mamcoins} мамкоинов, ${pavlushi} павлушей`);
}

// Обновление отображения
function updateDisplay() {
  const mamcoinsEl = document.getElementById('mamcoins');
  const pavlushiEl = document.getElementById('pavlushi');
  
  if (mamcoinsEl) mamcoinsEl.textContent = mamcoins;
  if (pavlushiEl) pavlushiEl.textContent = pavlushi;
}

// Конвертация павлушей в мамкоины
function convertPavlushi() {
  if (pavlushi >= 10) {
    const newMamcoins = Math.floor(pavlushi / 10);
    mamcoins += newMamcoins;
    pavlushi = pavlushi % 10;

    addToHistory(`🔄 Конвертация: ${newMamcoins} мамкоинов из павлушей`, 'earn');
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
    timestamp: now.getTime(),
  };

  history.unshift(newHistoryItem);

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
  
  if (isLoading) {
    historyList.innerHTML = '<div class="history-item">🔄 Загружаем данные из Firebase...</div>';
    return;
  }

  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-item">🦊 Лисичка еще ничего не делала</div>';
    return;
  }

  history.forEach(item => {
    const div = document.createElement('div');
    div.className = `history-item ${item.type}`;
    div.innerHTML = `<strong>[${item.time}]</strong> ${item.text}`;
    historyList.appendChild(div);
  });
}

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML onclick

function showEarnModal() {
  console.log('🦊 Показываем модальное окно заработка');
  const modal = document.getElementById('earnModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('❌ Модальное окно earnModal не найдено');
  }
}

function showSpendModal() {
  console.log('🦊 Показываем модальное окно штрафа');
  const modal = document.getElementById('spendModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('❌ Модальное окно spendModal не найдено');
  }
}

function showShopModal() {
  console.log('🦊 Показываем модальное окно магазина');
  const modal = document.getElementById('shopModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('❌ Модальное окно shopModal не найдено');
  }
}

function closeModal(modalId) {
  console.log(`🦊 Закрываем модальное окно: ${modalId}`);
  
  if (!modalId) {
    console.error('❌ modalId не передан в closeModal');
    return;
  }
  
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';

    const selectors = {
      earnModal: 'earnAction',
      spendModal: 'spendAction',
      shopModal: 'shopAction',
    };

    if (selectors[modalId]) {
      const selectElement = document.getElementById(selectors[modalId]);
      if (selectElement) {
        selectElement.value = '';
      }
    }
  } else {
    console.error(`❌ Модальное окно ${modalId} не найдено`);
  }
}

function confirmEarn() {
  const select = document.getElementById('earnAction');
  if (!select) {
    console.error('❌ Элемент earnAction не найден');
    return;
  }
  
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;

  if (!value || !text || value <= 0) {
    alert('Выберите действие!');
    return;
  }

  console.log(`✅ Заработал: ${text} (+${value} павлушей)`);

  pavlushi += value;
  convertPavlushi();
  addToHistory(`✅ ${text}`, 'earn');
  updateDisplay();
  closeModal('earnModal');
}

function confirmSpend() {
  const select = document.getElementById('spendAction');
  if (!select) {
    console.error('❌ Элемент spendAction не найден');
    return;
  }
  
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;

  if (!value || !text || value <= 0) {
    alert('Выберите проступок!');
    return;
  }

  console.log(`❌ Штраф: ${text} (-${value} павлушей/мамкоинов)`);

  if (value >= 100) {
    const mamcoinsToRemove = Math.floor(value / 10);
    if (mamcoins >= mamcoinsToRemove) {
      mamcoins -= mamcoinsToRemove;
    } else {
      const totalPavlushi = mamcoins * 10 + pavlushi;
      if (totalPavlushi >= value) {
        const remainingPavlushi = totalPavlushi - value;
        mamcoins = Math.floor(remainingPavlushi / 10);
        pavlushi = remainingPavlushi % 10;
      } else {
        mamcoins = 0;
        pavlushi = 0;
      }
    }
  } else {
    if (pavlushi >= value) {
      pavlushi -= value;
    } else {
      const totalPavlushi = mamcoins * 10 + pavlushi;
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
  updateDisplay();
  closeModal('spendModal');
}

function confirmShop() {
  const select = document.getElementById('shopAction');
  if (!select) {
    console.error('❌ Элемент shopAction не найден');
    return;
  }
  
  const value = parseInt(select.value);
  const text = select.options[select.selectedIndex].text;

  if (!value || !text || value <= 0) {
    alert('Выберите награду!');
    return;
  }

  const mamcoinsNeeded = Math.floor(value / 10);
  const totalMamcoins = mamcoins + Math.floor(pavlushi / 10);

  if (totalMamcoins < mamcoinsNeeded) {
    alert(`Недостаточно мамкоинов! Нужно: ${mamcoinsNeeded}, есть: ${totalMamcoins}`);
    return;
  }

  console.log(`🛒 Покупка: ${text} (-${mamcoinsNeeded} мамкоинов)`);

  const totalPavlushi = mamcoins * 10 + pavlushi;
  const remainingPavlushi = totalPavlushi - value;

  mamcoins = Math.floor(remainingPavlushi / 10);
  pavlushi = remainingPavlushi % 10;

  addToHistory(`🛒 Купил: ${text}`, 'shop');
  updateDisplay();
  closeModal('shopModal');
}

// ALIAS для совместимости
function addEarning() {
  console.warn('⚠️ Используется устаревшая функция addEarning, используйте confirmEarn');
  confirmEarn();
}

function addSpending() {
  console.warn('⚠️ Используется устаревшая функция addSpending, используйте confirmSpend');
  confirmSpend();
}

function addShopping() {
  console.warn('⚠️ Используется устаревшая функция addShopping, используйте confirmShop');
  confirmShop();
}

// Закрытие модальных окон по клику вне их
window.onclick = function (event) {
  const modals = ['earnModal', 'spendModal', 'shopModal'];

  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal && event.target === modal) {
      closeModal(modalId);
    }
  });
};

// Функции для отладки
window.mamcoinsDebug = {
  showData: () => console.log({ 
    mamcoins, 
    pavlushi, 
    history: history.slice(0, 5),
    totalHistory: history.length,
    isLoading, 
    firebaseConnected: !!db,
    elements: {
      earnModal: !!document.getElementById('earnModal'),
      spendModal: !!document.getElementById('spendModal'),
      shopModal: !!document.getElementById('shopModal'),
      earnAction: !!document.getElementById('earnAction'),
      spendAction: !!document.getElementById('spendAction'),
      shopAction: !!document.getElementById('shopAction')
    }
  }),
  addMamcoins: (amount) => { 
    mamcoins += amount; 
    updateDisplay(); 
    saveToFirebase(); 
    console.log(`➕ Добавлено ${amount} мамкоинов`);
  },
  addPavlushi: (amount) => { 
    pavlushi += amount; 
    updateDisplay(); 
    saveToFirebase(); 
    console.log(`➕ Добавлено ${amount} павлушей`);
  },
  reset: () => { 
    if (confirm('Точно сбросить все данные?')) {
      mamcoins = 0; 
      pavlushi = 0; 
      history = []; 
      updateDisplay(); 
      saveToFirebase();
      console.log('🔄 Все данные сброшены');
    }
  },
  forceSync: () => {
    saveToFirebase();
    console.log('🔄 Принудительная синхронизация');
  },
  testFirebase: () => {
    console.log('🔥 Тестируем Firebase подключение...');
    console.log('Firebase app:', typeof firebase !== 'undefined' ? '✅ Загружен' : '❌ Не загружен');
    console.log('Firestore:', db ? '✅ Подключен' : '❌ Не подключен');
    console.log('User ID:', userId);
    console.log('Loading state:', isLoading ? 'Загружается...' : 'Готов');
  },
  testElements: () => {
    console.log('🔍 Проверяем HTML элементы...');
    ['earnModal', 'spendModal', 'shopModal', 'earnAction', 'spendAction', 'shopAction'].forEach(id => {
      const el = document.getElementById(id);
      console.log(`${id}:`, el ? '✅ Найден' : '❌ НЕ найден');
    });
  }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  console.log('🦊 Запускаем систему мамкоинов...');
  updateDisplay();
  loadHistory();
  
  setTimeout(() => {
    window.mamcoinsDebug.testElements();
  }, 100);
  
  if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase SDK загружен');
    initializeFirebase();
  } else {
    console.error('❌ Firebase SDK не загружен, используем localStorage');
    loadFromLocalStorage();
    isLoading = false;
    updateDisplay();
    loadHistory();
  }
});

console.log('🦊 Система мамкоинов с Firebase v8 готова! Команды отладки: window.mamcoinsDebug'); 
