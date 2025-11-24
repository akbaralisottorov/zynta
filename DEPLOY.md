# Loyihani Vercelga Joylash (Deploy)

Bu loyihani bepul serverga (Vercel) va bepul domenga joylash bo'yicha qo'llanma.

## 1. Tayyorgarlik

Biz loyihani **PostgreSQL** bazasiga o'tkazdik (chunki Vercel serverless muhitida SQLite ishlamaydi).

### Kerakli narsalar:
1. **GitHub hisobi** (kodni yuklash uchun).
2. **Vercel hisobi** (saytni joylash uchun).
3. **Neon.tech** yoki **Vercel Postgres** (bepul baza uchun).

## 2. Kodni GitHub ga yuklash

1. GitHub da yangi **repository** oching (masalan `zynta-app`).
2. Terminalda quyidagi buyruqlarni bajaring:
   ```bash
   git add .
   git commit -m "Deployga tayyorlash"
   git branch -M main
   git remote add origin https://github.com/SIZNING_USERNAME/zynta-app.git
   git push -u origin main
   ```

## 3. Ma'lumotlar bazasini yaratish (Neon.tech)

1. [Neon.tech](https://neon.tech) ga kiring va ro'yxatdan o'ting.
2. Yangi loyiha yarating.
3. Sizga **Connection String** beriladi (masalan: `postgres://...`). Buni nusxalab oling.

## 4. Vercel ga ulash

1. [Vercel.com](https://vercel.com) ga kiring.
2. "Add New..." -> "Project" tugmasini bosing.
3. GitHub dagi `zynta-app` loyihangizni tanlang ("Import").
4. **Environment Variables** bo'limiga quyidagilarni qo'shing:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Neon dan olingan Connection String |
   | `GEMINI_API_KEY` | O'zingizning Gemini API kalitingiz |
   | `GOOGLE_CLIENT_ID` | Google Cloud Console dan olingan ID |
   | `GOOGLE_CLIENT_SECRET` | Google Cloud Console dan olingan Secret |
   | `NEXTAUTH_SECRET` | Uzun maxfiy so'z (o'zingiz o'ylab toping) |
   | `NEXTAUTH_URL` | `https://sizning-loyihangiz.vercel.app` (deploy bo'lgandan keyin o'zgartirasiz) |

5. **Deploy** tugmasini bosing.

## 5. Bazani sozlash

Deploy tugagandan so'ng, Vercel terminalida yoki o'z kompyuteringizda (agar `.env` faylga Neon URL ni yozsangiz) quyidagi buyruqni bajarish kerak:

```bash
npx prisma db push
```
Bu buyruq yangi PostgreSQL bazasida jadvallarni yaratadi.

## Tabriklaymiz!
Endi saytingiz `https://zynta-app.vercel.app` kabi manzilda hamma uchun ochiq bo'ladi.

---

## Muqobil variant: Google Cloud Run (Docker)

Agar siz baribir Cloud Run ishlatmoqchi bo'lsangiz, biz loyihaga `Dockerfile` qo'shdik.

1. `gcloud` CLI o'rnating va kiring.
2. Quyidagi buyruqlarni bajaring:
   ```bash
   # Docker image qurish
   docker build -t gcr.io/PROJECT_ID/zynta-app .

   # Push qilish
   docker push gcr.io/PROJECT_ID/zynta-app

   # Deploy
   gcloud run deploy zynta-app --image gcr.io/PROJECT_ID/zynta-app --platform managed --allow-unauthenticated --region us-central1 --set-env-vars DATABASE_URL=...,NEXTAUTH_SECRET=...
   ```
Lekin bu usul qiyinroq va Docker talab qiladi. Vercel tavsiya etiladi.
