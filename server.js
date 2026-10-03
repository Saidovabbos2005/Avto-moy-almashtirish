// server.js — Bot, Mini App API va kundalik eslatma tekshiruvi
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const db = require('./db');

// ====== SOZLAMALAR ======
// BotFather'dan olingan tokenni shu yerga yozing (yoki muhit o'zgaruvchisi orqali bering)
const BOT_TOKEN = process.env.BOT_TOKEN || 'BOT_TOKEN_SHU_YERGA';
// Mini App joylashgan https manzil (masalan https://sizning-domen.uz yoki ngrok manzili)
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://sizning-domen.uz';
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();
app.use(express.json());
app.use(express.static('public'));

// ====== BOT: /start ======
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Assalomu alaykum! 👋\nMoy almashtirish eslatma xizmatiga xush kelibsiz.\nRo\'yxatdan o\'tish uchun pastdagi tugmani bosing.', {
    reply_markup: {
      inline_keyboard: [[
        { text: '📝 Ro\'yxatdan o\'tish', web_app: { url: MINI_APP_URL } }
      ]]
    }
  });
});

// ====== API: Mini App'dan ma'lumot qabul qilish ======
app.post('/api/register', (req, res) => {
  const { chat_id, ism, telefon, mashina, oxirgi_sana, interval_oy } = req.body;

  if (!chat_id || !ism || !oxirgi_sana || !interval_oy) {
    return res.status(400).json({ ok: false, error: 'Majburiy maydonlar to\'ldirilmagan' });
  }

  const stmt = db.prepare(`
    INSERT INTO mijozlar (chat_id, ism, telefon, mashina, oxirgi_sana, interval_oy)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(chat_id, ism, telefon || null, mashina || null, oxirgi_sana, interval_oy);

  // Tasdiq xabarini botdan yuboramiz
  bot.sendMessage(chat_id, `✅ Ro'yxatdan o'tdingiz!\nHar ${interval_oy} oyda moy almashtirish vaqti kelganda sizga shu yerda xabar beramiz.`);

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));

// ====== KUNDALIK TEKSHIRUV (har kuni ertalab soat 09:00 da) ======
cron.schedule('0 9 * * *', () => {
  console.log('Eslatmalarni tekshirish boshlandi:', new Date().toISOString());

  const bugun = new Date();
  const mijozlar = db.prepare('SELECT * FROM mijozlar').all();

  for (const mijoz of mijozlar) {
    const oxirgiSana = new Date(mijoz.oxirgi_sana);
    const keyingiSana = new Date(oxirgiSana);
    keyingiSana.setMonth(keyingiSana.getMonth() + mijoz.interval_oy);

    const bugunStr = bugun.toISOString().slice(0, 10);

    // Muddat kelgan va bugun hali eslatma yuborilmagan bo'lsa
    if (keyingiSana <= bugun && mijoz.oxirgi_eslatma_sana !== bugunStr) {
      bot.sendMessage(
        mijoz.chat_id,
        `🚗 ${mijoz.ism}, ${mijoz.mashina ? mijoz.mashina + ' uchun ' : ''}moy almashtirish vaqti keldimi?\n\nAgar almashtirgan bo'lsangiz, botga /yangiladim deb yozing — hisob qaytadan boshlanadi.`
      );

      db.prepare('UPDATE mijozlar SET oxirgi_eslatma_sana = ? WHERE id = ?')
        .run(bugunStr, mijoz.id);
    }
  }
});

// ====== Mijoz moyni yangilaganini bildirishi ======
bot.onText(/\/yangiladim/, (msg) => {
  const chatId = msg.chat.id;
  const bugunStr = new Date().toISOString().slice(0, 10);

  const mijoz = db.prepare('SELECT * FROM mijozlar WHERE chat_id = ? ORDER BY id DESC LIMIT 1').get(chatId);
  if (!mijoz) {
    return bot.sendMessage(chatId, 'Siz hali ro\'yxatdan o\'tmagansiz. /start bosing.');
  }

  db.prepare('UPDATE mijozlar SET oxirgi_sana = ?, oxirgi_eslatma_sana = NULL WHERE id = ?')
    .run(bugunStr, mijoz.id);

  bot.sendMessage(chatId, `✅ Yangilandi! Keyingi eslatma ${mijoz.interval_oy} oydan keyin yuboriladi.`);
});
