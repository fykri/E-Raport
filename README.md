# 🎓 E-Raport TK Al-Ikhlas Balla

<p align="center">
  <strong>Sistem Informasi E-Raport Berbasis Web untuk Taman Kanak-Kanak</strong>
</p>

<p align="center">
  Aplikasi Full-Stack untuk membantu pengelolaan data peserta didik, penilaian, dan pencetakan rapor secara lebih terstruktur dan efisien.
</p>

---

## 📌 Tentang Project

**E-Raport TK Al-Ikhlas Balla** merupakan aplikasi sistem informasi berbasis web yang dikembangkan sebagai **proyek skripsi** untuk membantu proses pengelolaan dan pencetakan rapor peserta didik di **TK Al-Ikhlas Balla**.

Sebelum adanya sistem ini, proses pengolahan nilai dan pembuatan rapor masih dilakukan menggunakan spreadsheet. Proses tersebut membutuhkan pengelolaan data secara manual dan berpotensi meningkatkan kesalahan dalam proses input maupun pengolahan nilai.

Aplikasi ini dikembangkan untuk menyediakan sistem yang lebih terstruktur dalam mengelola **data peserta didik, tahun ajaran, semester, kategori penilaian, subkategori, indikator penilaian, serta hasil penilaian peserta didik**.

Sistem juga menyediakan fitur **pencetakan rapor** sehingga guru dapat menghasilkan rapor peserta didik secara langsung melalui aplikasi.

Project ini dibangun menggunakan arsitektur **Full-Stack**, dengan **React** sebagai frontend, **Node.js dan Express.js** sebagai backend, **Prisma ORM** sebagai penghubung antara aplikasi dengan database, serta **MySQL** sebagai database.

### 🎯 Tujuan

Pengembangan aplikasi ini bertujuan untuk:

* Membantu guru dalam mengelola data peserta didik.
* Mempermudah proses input dan pengelolaan nilai.
* Mengurangi potensi kesalahan dalam proses pengolahan nilai.
* Mengelola data penilaian secara lebih terstruktur.
* Mempercepat proses pembuatan dan pencetakan rapor.
* Mengurangi ketergantungan terhadap pengolahan data menggunakan spreadsheet.

---

## ✨ Fitur

### 👨‍🎓 Manajemen Peserta Didik

* Menambahkan data peserta didik
* Mengubah data peserta didik
* Menghapus data peserta didik
* Melihat daftar peserta didik
* Mengelola informasi peserta didik
* Mengelola pembagian kelas

### 📚 Tahun Ajaran & Semester

* Mengelola tahun ajaran
* Mengelola semester
* Menentukan periode penilaian
* Menghubungkan peserta didik dengan tahun ajaran dan semester

### 📊 Manajemen Penilaian

* Mengelola kategori penilaian
* Mengelola subkategori penilaian
* Mengelola indikator penilaian
* Menginput nilai peserta didik
* Mengubah data penilaian
* Melihat hasil penilaian

### 📝 Pengelolaan Rapor

* Menghasilkan data rapor peserta didik
* Menampilkan hasil penilaian berdasarkan kategori
* Menampilkan identitas peserta didik
* Menampilkan hasil perkembangan peserta didik
* Menyiapkan rapor untuk dicetak

### 🖨️ Pencetakan Rapor

* Mencetak rapor langsung dari aplikasi
* Format rapor disesuaikan dengan kebutuhan sekolah
* Mempermudah proses pencetakan rapor setiap peserta didik

### 📱 Antarmuka

* User interface berbasis web
* Tampilan sederhana dan mudah digunakan
* Layout disesuaikan dengan kebutuhan guru
* Responsive pada beberapa ukuran layar

---

## 🛠️ Teknologi yang Digunakan

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

* React
* Vite
* Axios
* Zustand
* React Router

### Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
</p>

* Node.js
* Express.js
* Prisma ORM
* REST API
* Middleware
* Authentication & Authorization

### Database

<p>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

* MySQL
* Prisma ORM
* Relational Database
* Database Relationships
* Prisma Migrations
* SQL Queries

---

## 🏗️ Arsitektur Aplikasi

```text
┌───────────────────────────────┐
│           Frontend            │
│                               │
│ React + Vite                  │
│ Axios + React Router          │
└───────────────┬───────────────┘
                │
                │ HTTP / REST API
                ▼
┌───────────────────────────────┐
│            Backend            │
│                               │
│ Node.js + Express.js          │
│                               │
│ REST API                      │
│ Authentication                │
│ Authorization                 │
│ Business Logic                │
└───────────────┬───────────────┘
                │
                │ Prisma ORM
                ▼
┌───────────────────────────────┐
│             MySQL             │
│                               │
│ Users                         │
│ Peserta Didik                 │
│ Tahun Ajaran                  │
│ Semester                      │
│ Kategori                      │
│ Subkategori                   │
│ Indikator                     │
│ Penilaian                     │
└───────────────────────────────┘
```

---

## 📂 Struktur Project

```text
e-raport-tk/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── containers/
│   │   ├── context/
│   │   ├── css/
│   │   ├── data/
│   │   ├── helpers/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── env.example
│   ├── eslint.config.js
│   ├── index.html
│   └── package-lock.json
│   └── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── amount/
│   │   ├── auth-users/
│   │   ├── guru/
│   │   ├── kesimpulan/
│   │   ├── orang-tua/
│   │   ├── penilian/
│   │   └── peserta-didik.js
│   │   └── profil-sekolah.js
│   │   └── seed.js
│   │   └── tahun-ajaran.js
│   │   └── users.js
│   │   └── utils.js
│   │
│   ├── prisma/
│   │   ├── helpers
│   │   ├── midleware
│   │   ├── prismaClient.js
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── .env.example
│   └── index.js
│   └── package-lock.json
│   └── package.json
│
├── screenshots/
│   ├── dashboard.png
│   ├── peserta-didik.png
│   ├── penilaian.png
│   └── raport.png
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database & Prisma

Project ini menggunakan **MySQL** sebagai database dan **Prisma ORM** untuk mengelola komunikasi antara aplikasi backend dengan database.

Prisma digunakan untuk:

* Mendefinisikan struktur database melalui `schema.prisma`
* Mengelola database relationships
* Menjalankan database migration
* Mengakses database melalui Prisma Client
* Membantu menjaga konsistensi struktur database

### Prisma Migration

Seluruh perubahan struktur database dikelola menggunakan **Prisma Migrations**.

Migration disimpan di dalam repository:

```text
backend/
└── prisma/
    ├── schema.prisma
    └── migrations/
```

Dengan demikian, developer lain dapat membuat database baru dan menjalankan migration untuk mendapatkan struktur database yang sesuai dengan aplikasi tanpa membutuhkan database production.

---

## 🔑 Environment Variables

Buat file `.env` di dalam folder `backend`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/e_raport"

PORT_BACKEND = 8000
ACCESS_TOKEN_SECRET = 
REFRESH_TOKEN_SECRET = 
```

Buat file `.env` di dalam folder `frontend`:
```env
VITE_BASE_API = http://localhost:8000
```

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/e-raport-tk.git

cd e-raport-tk
```

### 2. Install Dependency Frontend

```bash
cd frontend

npm install
```

### 3. Install Dependency Backend

Buka terminal baru:

```bash
cd backend

npm install
```

### 4. Buat Database MySQL

Buat database baru:

```sql
CREATE DATABASE e_raport;
```

### 5. Konfigurasi Environment

Buat file `.env` di dalam folder `backend`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/e_raport"

PORT_BACKEND=3000
```

Sesuaikan `username` dan `password` dengan konfigurasi MySQL lokal.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Jalankan Migration

Untuk development dan membuat migration baru:

```bash
npx prisma migrate dev
```

### 8. Jalankan Backend

```bash
npm run dev
```

Backend akan berjalan pada:

```text
http://localhost:8000
```

### 9. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend

npm run dev
```

Frontend dapat diakses melalui:

```text
http://localhost:5173
```

---

## 📸 Screenshot

### Login

![Login](./screenshot/login-image.png)

### dashboard

![dashboard](./screenshot/dashboard-image.png)

### users account

![users](./screenshot/users-image.png)

### guru

![guru](./screenshot/guru-image.png)

### tahun ajaran

![tahun](./screenshot/tahun-image.png)

### peserta didik

![peserta_didik](./screenshot/pesertadidik-image.png)

### penilaian

![penilaian](./screenshot/penilaian-image.png)

### cetak raport

![cetak_raport](./screenshot/cetak-raport.png)

---

## 🧪 Hasil Pengujian

Pengujian dilakukan untuk mengetahui efektivitas sistem dibandingkan dengan proses pengolahan rapor menggunakan spreadsheet.

| Aspek                  | Sebelum Sistem          | Setelah Sistem            |
| ---------------------- | ----------------------- | ------------------------- |
| Proses input nilai     | Menggunakan spreadsheet | Menggunakan aplikasi web  |
| Kesalahan input        | ± 6 kesalahan per kelas | ± 2,5 kesalahan per kelas |
| Waktu pencetakan rapor | ± 6 menit/peserta didik | ± 1 menit/peserta didik   |

Hasil pengujian menunjukkan:

* **Penurunan kesalahan input sebesar 58,33%**
* **Waktu pencetakan rapor berkurang dari sekitar 6 menit menjadi 1 menit per peserta didik**
* Proses input menggunakan aplikasi web membutuhkan waktu sekitar **10–19% lebih lama dibandingkan spreadsheet**

Hasil tersebut menjadi bagian dari evaluasi terhadap efektivitas sistem yang dikembangkan.

---

## 🎓 Konteks Skripsi

Project ini dikembangkan sebagai bagian dari **skripsi pada Program Studi Teknik Informatika**.

### Objek Penelitian

**TK Al-Ikhlas Balla**

### Fokus Penelitian

Pengembangan sistem informasi e-raport berbasis web untuk membantu:

* Pengelolaan data peserta didik
* Pengelolaan tahun ajaran dan semester
* Pengelolaan indikator penilaian
* Penginputan nilai
* Penyusunan rapor
* Pencetakan rapor

Project ini tidak hanya berfokus pada pengembangan aplikasi, tetapi juga melakukan pengujian terhadap **efisiensi proses input, tingkat kesalahan input, dan waktu pencetakan rapor**.

---

## 🎯 Pembelajaran yang Diperoleh

Melalui project skripsi ini, saya mendapatkan pengalaman dalam:

* Menganalisis kebutuhan sistem berdasarkan permasalahan nyata
* Merancang relational database
* Menggunakan Prisma ORM
* Mengelola database migration
* Membuat REST API
* Mengembangkan aplikasi Full-Stack
* Mengimplementasikan authentication dan authorization
* Menghubungkan frontend dengan backend
* Mengelola data menggunakan MySQL
* Mengimplementasikan business logic penilaian
* Membuat sistem pencetakan rapor
* Melakukan pengujian sistem
* Mengevaluasi efektivitas aplikasi berdasarkan hasil pengujian

---

## 🔒 Keamanan

Beberapa praktik keamanan yang diterapkan:

* Authentication untuk membatasi akses pengguna
* Authorization berdasarkan role
* Protected API endpoints
* Validasi data
* Environment variables untuk credential
* Pemisahan frontend dan backend
* Credential database tidak disimpan di repository

---

## 👨‍💻 Tentang Saya

### Dzul Fikri Yunus

**Lulusan Teknik Informatika | Full-Stack Developer**

Project ini merupakan salah satu project yang saya kembangkan sebagai bagian dari skripsi sekaligus sebagai penerapan kemampuan Full-Stack Development pada permasalahan nyata di lingkungan pendidikan.

Saya memiliki ketertarikan pada pengembangan aplikasi web, khususnya pada pengembangan backend, REST API, database, authentication, serta integrasi frontend dan backend.

### 💻 Bidang yang Saya Minati

* Full-Stack Development
* Backend Development
* Frontend Development
* REST API
* Database Design
* Prisma ORM
* Authentication & Authorization
* Web Application Development

---

<p align="center">
  ⭐ Jika project ini menarik, jangan lupa berikan star!
</p>
