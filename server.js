require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rate limiting - простий in-memory store
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 3000; // 3 секунди

function checkRateLimit(ip) {
  const now = Date.now();
  const lastRequest = rateLimitStore.get(ip);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return false;
  }

  rateLimitStore.set(ip, now);
  return true;
}

// Очищення старих записів кожні 10 секунд
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of rateLimitStore.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
    }
  }
}, 10000);

// Ініціалізація Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Завантаження віршів
let verses = [];
try {
  const versesData = fs.readFileSync(path.join(__dirname, 'data', 'verses.json'), 'utf-8');
  verses = JSON.parse(versesData);
  console.log(`✓ Завантажено ${verses.length} біблійних віршів`);
} catch (error) {
  console.error('Помилка завантаження verses.json:', error);
  process.exit(1);
}

// API endpoint
app.post('/api/verse', async (req, res) => {
  try {
    // Перевірка rate limit
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Зачекайте трохи перед наступним запитом'
      });
    }

    // Вибір випадкового вірша
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Промпт для Claude
    const prompt = `Ти — мудрий духовний наставник. Дай коротке трактування цього біблійного вірша українською мовою:

"${randomVerse.text}" — ${randomVerse.reference}

Структура відповіді:
1. **Контекст** (1-2 речення про історичний/біблійний контекст)
2. **Значення** (що цей вірш означає для віруючого)
3. **Застосування** (як це можна застосувати в житті сьогодні)

Тон: теплий, підтримуючий, без моралізаторства. Максимум 150 слів.`;

    // Запит до Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Отримання відповіді
    const interpretation = message.content[0].text;

    // Відправка результату
    res.json({
      verse: randomVerse.text,
      reference: randomVerse.reference,
      interpretation: interpretation
    });

  } catch (error) {
    console.error('Помилка API:', error);

    // Fallback-повідомлення
    res.status(500).json({
      error: 'Виникла помилка при обробці запиту',
      fallback: 'Спробуйте ще раз через кілька секунд. Якщо проблема повторюється, перевірте налаштування API.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    verses: verses.length,
    timestamp: new Date().toISOString()
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🌟 Сервер "Щоденне Слово" запущено`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📖 Біблійних віршів: ${verses.length}\n`);
});
