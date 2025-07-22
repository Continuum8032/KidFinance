@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

body {
    font-family: 'Press Start 2P', monospace;
    background: 
        linear-gradient(0deg, #4a4a4a 0px, #4a4a4a 2px, transparent 2px),
        linear-gradient(90deg, #4a4a4a 0px, #4a4a4a 2px, transparent 2px),
        linear-gradient(45deg, #7cb342 25%, transparent 25%, transparent 75%, #7cb342 75%),
        linear-gradient(-45deg, #8bc34a 25%, transparent 25%, transparent 75%, #8bc34a 75%),
        #689f38;
    background-size: 20px 20px, 20px 20px, 40px 40px, 40px 40px, auto;
    min-height: 100vh;
    padding: 10px;
    overflow-x: hidden;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: rgba(139, 69, 19, 0.95);
    border: 4px solid #654321;
    border-style: inset;
    box-shadow: 
        inset 2px 2px 4px rgba(255,255,255,0.5),
        inset -2px -2px 4px rgba(0,0,0,0.5),
        0 8px 16px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
}

/* ЭМОДЗИ ЛИСИЧКИ В УГЛАХ */
.container::before,
.container::after {
    content: '🦊';
    position: absolute;
    width: 48px;
    height: 48px;
    z-index: 10;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: foxBounce 3s ease-in-out infinite;
}

.container::before {
    top: 10px;
    left: 10px;
}

.container::after {
    top: 10px;
    right: 10px;
}

@keyframes foxBounce {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(5deg); }
}

/* ПЛАВАЮЩИЕ ЛИСИЧКИ ПО ЭКРАНУ */
.fox-decoration {
    position: fixed;
    z-index: 5;
    pointer-events: none;
    font-size: 24px;
    animation: floatFox 4s ease-in-out infinite;
}

.fox-decoration::before {
    content: '🦊';
}

.fox-decoration:nth-child(1) {
    top: 15%;
    left: 5%;
    animation-delay: 0s;
}

.fox-decoration:nth-child(2) {
    top: 25%;
    right: 8%;
    animation-delay: 1s;
}

.fox-decoration:nth-child(3) {
    bottom: 30%;
    left: 3%;
    animation-delay: 2s;
}

.fox-decoration:nth-child(4) {
    bottom: 20%;
    right: 5%;
    animation-delay: 0.5s;
}

@keyframes floatFox {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(5deg); }
    75% { transform: translateY(-5px) rotate(-5deg); }
}

/* ДОБАВЛЯЕМ ЛИСИЧЕК В УГЛЫ ЭКРАНА */
body::before {
    content: '🦊 🦊 🦊 🦊';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    opacity: 0.3;
}

header {
    text-align: center;
    padding: 30px 20px 20px;
    background: rgba(76, 175, 80, 0.9);
    border: 3px solid #4caf50;
    border-style: inset;
    margin: 10px;
    position: relative;
}

header h1 {
    font-size: 16px;
    color: #2e7d32;
    text-shadow: 1px 1px 0px #fff;
    margin-bottom: 15px;
    line-height: 1.4;
}

.minecraft-fox {
    display: inline-block;
    font-size: 24px;
    vertical-align: middle;
    margin: 0 5px;
}

.minecraft-fox::before {
    content: '🦊';
}

.balance {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10px;
}

.balance-item {
    background: rgba(255, 235, 59, 0.9);
    border: 2px solid #fbc02d;
    border-style: inset;
    padding: 10px 15px;
    font-size: 12px;
    color: #f57f17;
    text-shadow: 1px 1px 0px #fff;
    min-width: 120px;
    text-align: center;
}

.balance-item span:last-child {
    font-weight: bold;
    font-size: 14px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    flex-wrap: wrap;
}

.actions button {
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    padding: 15px 20px;
    border: 3px solid;
    border-style: outset;
    cursor: pointer;
    transition: all 0.1s;
    min-width: 120px;
    position: relative;
}

.actions button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.actions button:active {
    transform: translateY(0);
    border-style: inset;
}

/* ДОБАВЛЯЕМ ЛИСИЧЕК НА КНОПКИ */
.btn-earn::before {
    content: '🦊 ';
}

.btn-spend::before {
    content: '🦊 ';
}

.btn-shop::before {
    content: '🦊 ';
}

.btn-earn {
    background: #4caf50;
    border-color: #66bb6a;
    color: white;
    text-shadow: 1px 1px 0px #2e7d32;
}

.btn-spend {
    background: #f44336;
    border-color: #ef5350;
    color: white;
    text-shadow: 1px 1px 0px #c62828;
}

.btn-shop {
    background: #ff9800;
    border-color: #ffb74d;
    color: white;
    text-shadow: 1px 1px 0px #ef6c00;
}

.history {
    margin: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 3px solid #666;
    border-style: inset;
    padding: 20px;
}

.history h3 {
    font-size: 14px;
    color: #333;
    margin-bottom: 15px;
    text-align: center;
}

.history h3::before {
    content: '🦊 ';
}

.history h3::after {
    content: ' 🦊';
}

#history-list {
    max-height: 200px;
    overflow-y: auto;
}

.history-item {
    padding: 10px;
    margin: 5px 0;
    background: rgba(240, 240, 240, 0.8);
    border: 2px solid #ccc;
    border-style: inset;
    font-size: 10px;
    line-height: 1.4;
}

.history-item.earn {
    background: rgba(76, 175, 80, 0.2);
    border-color: #4caf50;
}

.history-item.spend {
    background: rgba(244, 67, 54, 0.2);
    border-color: #f44336;
}

.history-item.shop {
    background: rgba(255, 152, 0, 0.2);
    border-color: #ff9800;
}

/* МОДАЛЬНЫЕ ОКНА */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: rgba(139, 69, 19, 0.95);
    border: 4px solid #654321;
    border-style: inset;
    margin: 5% auto;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    animation: slideIn 0.3s;
}

@keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal h3 {
    font-size: 16px;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 2px 2px 0px #333;
}

.modal h3::before {
    content: '🦊 ';
}

.modal h3::after {
    content: ' 🦊';
}

.modal select {
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    width: 100%;
    padding: 15px;
    border: 3px solid #666;
    border-style: inset;
    background: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
    line-height: 1.4;
}

.modal select option {
    font-size: 12px;
    padding: 8px;
    line-height: 1.6;
    background: rgba(255, 255, 255, 0.95);
}

.modal select optgroup {
    font-weight: bold;
    background: rgba(76, 175, 80, 0.2);
    font-size: 12px;
    padding: 5px;
}

.modal-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.modal button {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    padding: 12px 20px;
    border: 3px solid;
    border-style: outset;
    cursor: pointer;
    transition: all 0.1s;
}

.modal button:hover {
    transform: translateY(-1px);
}

.modal button:active {
    transform: translateY(0);
    border-style: inset;
}

.btn-confirm {
    background: #4caf50;
    border-color: #66bb6a;
    color: white;
    text-shadow: 1px 1px 0px #2e7d32;
}

.btn-confirm::before {
    content: '🦊 ';
}

.btn-cancel {
    background: #f44336;
    border-color: #ef5350;
    color: white;
    text-shadow: 1px 1px 0px #c62828;
}

.btn-cancel::before {
    content: '🦊 ';
}

/* АДАПТИВНОСТЬ ДЛЯ МОБИЛЬНЫХ */
@media (max-width: 768px) {
    body {
        padding: 5px;
        font-size: 10px;
    }
    
    .container {
        border-width: 2px;
    }
    
    .container::before,
    .container::after {
        width: 32px;
        height: 32px;
        top: 5px;
        font-size: 28px;
    }
    
    .container::before {
        left: 5px;
    }
    
    .container::after {
        right: 5px;
    }
    
    .fox-decoration {
        font-size: 18px;
    }
    
    body::before {
        font-size: 16px;
        padding: 10px;
    }
    
    header {
        padding: 20px 10px 15px;
        margin: 5px;
    }
    
    header h1 {
        font-size: 12px;
        line-height: 1.2;
    }
    
    .minecraft-fox {
        font-size: 18px;
        margin: 0 3px;
    }
    
    .balance {
        flex-direction: column;
        gap: 8px;
    }
    
    .balance-item {
        padding: 8px 12px;
        font-size: 10px;
        min-width: auto;
    }
    
    .balance-item span:last-child {
        font-size: 12px;
    }
    
    .actions {
        flex-direction: column;
        gap: 10px;
        padding: 15px;
    }
    
    .actions button {
        font-size: 10px;
        padding: 12px 15px;
        min-width: auto;
    }
    
    .history {
        margin: 10px;
        padding: 15px;
    }
    
    .history h3 {
        font-size: 12px;
    }
    
    .modal-content {
        width: 95%;
        padding: 20px;
        margin: 10% auto;
    }
    
    .modal h3 {
        font-size: 14px;
    }
    
    .modal select {
        font-size: 14px;
        padding: 12px;
    }
    
    .modal select option {
        font-size: 14px;
    }
    
    .modal select optgroup {
        font-size: 14px;
    }
    
    .modal button {
        font-size: 10px;
        padding: 10px 15px;
    }
    
    .modal-buttons {
        flex-direction: column;
        gap: 10px;
    }
}

@media (max-width: 480px) {
    header h1 {
        font-size: 10px;
    }
    
    .minecraft-fox {
        font-size: 16px;
    }
    
    .actions button {
        font-size: 9px;
        padding: 10px 12px;
    }
    
    .modal select {
        font-size: 16px;
    }
    
    .modal select option {
        font-size: 16px;
    }
    
    .modal select optgroup {
        font-size: 16px;
    }
} 
