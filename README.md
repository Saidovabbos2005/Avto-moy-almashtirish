# Moy almashtirish eslatma boti

Avto servis mijozlariga Telegram orqali "moy almashtirish vaqti keldimi?" eslatmasini
avtomatik yuboradigan bot + Mini App (ro'yxatdan o'tish formasi).

## 1-qadam: Bot yaratish
1. Telegramda **@BotFather** ga yozing
2. `/newbot` buyrug'ini yuboring, botga nom va username bering
3. Sizga **BOT_TOKEN** beradi — uni saqlab qo'ying

## 2-qadam: Kompyuterda o'rnatish
```bash
npm install
```

## 3-qadam: Sozlash
`BOT_TOKEN` va `MINI_APP_URL` ni muhit o'zgaruvchisi sifatida bering, yoki
to'g'ridan-to'g'ri `server.js` faylidagi quyidagi qatorlarga yozing:

```js
const BOT_TOKEN = 'SIZNING_TOKENINGIZ';
const MINI_APP_URL = 'https://sizning-domen.uz';
```

**MUHIM:** Telegram Mini App faqat **https** manzilda ishlaydi (http yoki localhost ishlamaydi).
Sinov uchun [ngrok](https://ngrok.com) dan foydalanishingiz mumkin:
```bash
ngrok http 3000
```
ngrok bergan https manzilini `MINI_APP_URL` ga qo'ying.

Doimiy ishlatish uchun loyihani biror hostingga (Railway, Render, VPS va h.k.)
joylashtirishingiz kerak bo'ladi — shunda doimiy https manzil bo'ladi.

## 4-qadam: Ishga tushirish
```bash
npm start
```

## Qanday ishlaydi
- Mijoz botga `/start` yozadi → "Ro'yxatdan o'tish" tugmasi chiqadi
- Tugmani bosib Mini App ochiladi, mijoz ism, mashina, oxirgi moy sanasi va
  necha oyda eslatma kerakligini kiritadi
- Har kuni soat 09:00 da tizim barcha mijozlarni tekshiradi, muddati kelganlarga
  botdan avtomatik xabar yuboradi
- Mijoz moyni almashtirgach botga `/yangiladim` deb yozsa, hisob qaytadan boshlanadi

## Keyinroq qo'shsa bo'ladigan narsalar
- Admin panel (barcha mijozlarni ko'rish, tahrirlash)
- Navbat (booking) tizimi — mijoz avto servisga vaqt band qilishi
- SMS orqali eslatma (Telegram'i yo'q mijozlar uchun, pullik SMS xizmati kerak bo'ladi)
