# 🌟 Щоденне Слово

Простий веб-сайт для отримання випадкових біблійних віршів з AI-трактуванням від Claude.

![Screenshot](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Функціонал

- 📖 30 популярних біблійних віршів українською мовою
- 🤖 AI-трактування від Claude (Anthropic)
- 🎨 Мінімалістичний дизайн з Tailwind CSS
- 📱 Повністю адаптивний (mobile-first)
- ⚡ Rate limiting для захисту від спаму
- 🔒 Обробка помилок з fallback-повідомленнями

## 🚀 Швидкий старт

### Вимоги

- Node.js >= 18.0.0
- Anthropic API ключ ([отримати тут](https://console.anthropic.com/))

### Встановлення

1. **Клонуйте репозиторій:**
```bash
git clone <your-repo-url>
cd bible-verse-app
```

2. **Встановіть залежності:**
```bash
npm install
```

3. **Налаштуйте змінні середовища:**
```bash
cp .env.example .env
```

Відредагуйте `.env` та додайте ваш API ключ:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PORT=3000
```

4. **Запустіть сервер:**
```bash
# Для розробки (з автоперезавантаженням)
npm run dev

# Для продакшну
npm start
```

5. **Відкрийте браузер:**
```
http://localhost:3000
```

## 📁 Структура проєкту

```
bible-verse-app/
├── public/
│   └── index.html          # Frontend з Tailwind CSS
├── data/
│   └── verses.json         # База біблійних віршів
├── server.js               # Express сервер + Anthropic API
├── package.json            # Залежності
├── .env.example            # Приклад налаштувань
└── README.md              # Документація
```

## 🌐 Деплой на Render.com

### Крок 1: Підготовка

1. Створіть акаунт на [Render.com](https://render.com)
2. Переконайтеся, що проєкт на GitHub

### Крок 2: Створення Web Service

1. **Dashboard → New → Web Service**
2. **Підключіть GitHub репозиторій**
3. **Налаштування:**
   - **Name:** `щоденне-слово` (або ваша назва)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

### Крок 3: Environment Variables

Додайте змінну середовища:
- **Key:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-api03-your-key-here`

### Крок 4: Deploy

1. Натисніть **Create Web Service**
2. Render автоматично задеплоїть ваш проєкт
3. Ваш сайт буде доступний на `https://your-app-name.onrender.com`

## 🛠️ API Endpoints

### `POST /api/verse`
Отримує випадковий вірш з AI-трактуванням.

**Response:**
```json
{
  "verse": "Господь — Пастир мій, і нічого мені не бракує.",
  "reference": "Псалом 23:1",
  "interpretation": "**Контекст:** Цей вірш написав..."
}
```

**Errors:**
```json
{
  "error": "Зачекайте трохи перед наступним запитом"
}
```

### `GET /api/health`
Перевірка стану сервера.

**Response:**
```json
{
  "status": "OK",
  "verses": 30,
  "timestamp": "2024-01-09T12:00:00.000Z"
}
```

## 🎨 Технології

- **Frontend:** HTML, Tailwind CSS (CDN), Vanilla JavaScript
- **Backend:** Node.js, Express
- **AI:** Anthropic Claude API
- **Fonts:** Google Fonts (Crimson Text, Inter)

## ⚙️ Особливості реалізації

### Rate Limiting
Простий in-memory rate limiter — 1 запит на 3 секунди на IP.

### AI Промпт
Структура трактування:
1. **Контекст** — історичний/біблійний фон
2. **Значення** — духовне значення
3. **Застосування** — практичне використання

Тон: теплий, підтримуючий, без моралізаторства (макс. 150 слів).

### Обробка помилок
- API помилки → fallback-повідомлення
- Network помилки → користувацьке повідомлення
- Rate limit → 429 статус код

## 📝 Ліцензія

MIT License - використовуйте вільно!

## 🤝 Контрибуція

Pull requests вітаються! Для великих змін спочатку відкрийте issue.

## 💡 Ідеї для розвитку

- [ ] Додати категорії віршів (надія, любов, мир...)
- [ ] Збереження улюблених віршів
- [ ] Поділитися віршем у соцмережах
- [ ] Щоденна розсилка на email
- [ ] Темна тема
- [ ] Багатомовність

---

Зроблено з ❤️ та Claude AI
