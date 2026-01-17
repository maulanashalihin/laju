# Product Requirements Document (PRD)

**Nama Produk:** JemputJodoh.id
**Versi Dokumen:** 1.0 (Final Concept)
**Platform:** Web Application
**Tagline:** Menjemput Jodoh dengan Cara yang Mulia

---

## 1. Executive Summary

JemputJodoh.id adalah aplikasi pencarian jodoh Islami yang menggabungkan kemudahan **self-service** (pencarian mandiri) dengan keamanan **pengawasan keluarga**. Aplikasi ini mendigitalkan proses *Taaruf* tanpa campur tangan manual admin dalam pencocokan, namun membatasi interaksi sesuai status hubungan untuk menjaga adab (privasi bertingkat) dan melibatkan Wali sebagai pengawas pasif.

---

## 2. Target Pengguna (User Personas)

1. **Peserta (User):**
   - Laki-laki (Ikhwan) & Perempuan (Akhwat).
   - Status: Lajang, Duda, atau Janda.
   - Motivasi: Serius mencari pasangan hidup, siap menikah, menghindari pacaran.

2. **Wali (Supervisor):**
   - Orang tua atau saudara kandung dari Peserta.
   - Peran: Memantau aktivitas taaruf anak/saudaranya (Passive Monitoring).

---

## 3. Model Bisnis & Pricing

Menggunakan sistem **"Pay-per-Action"** dengan mata uang dalam aplikasi bernama **"Tiket Ikhtiar"**. Tidak ada biaya langganan bulanan (*No Recurring*).

### A. Skema Pembelian Tiket (Top-Up)

- **Paket Ikhlas (Trial):** Rp 20.000 (Dapat 2 Tiket).
- **Paket Ikhtiar (Best Value):** Rp 100.000 (Dapat 12 Tiket).
- **Paket Tawakal (Volume):** Rp 200.000 (Dapat 30 Tiket).

### B. Biaya Penggunaan Tiket (Cost Structure)

| Aksi Pengguna | Biaya | Keterangan |
| --- | --- | --- |
| **Registrasi** | **+1 Tiket (Bonus)** | Bonus awal untuk pengguna baru yang terverifikasi. |
| **Cari & Lihat Profil** | **Gratis** | Melihat foto (blur) dan detail CV. |
| **Ajukan Proposal** | **1 Tiket** | Dibayar Pengirim. Jika ditolak, tiket **hangus** (Risiko Ikhtiar). |
| **Terima Proposal** | **Gratis** | Penerima tidak dikenakan biaya. |
| **Chatting (Taaruf)** | **Gratis** | Fitur chat terbuka gratis setelah *Match*. |
| **Buka Kontak (Khitbah)** | **10 Tiket** | Filter keseriusan. Dibayar oleh inisiator (yang klik tombol). |

---

## 4. Alur Pengguna & Fitur Utama

### A. Fase Onboarding & Verifikasi

1. **Registrasi:** Input Email, Password, No HP User.
2. **KYC (Know Your Customer):**
   - Wajib upload foto **e-KTP** asli & **Selfie dengan KTP**.
   - Akun berstatus *Pending* sampai KTP diverifikasi sistem/admin (Cek kejelasan foto).
3. **Pembuatan CV:** Mengisi biodata, ibadah, visi misi, dan kriteria.

### B. Fase Pencarian (Discovery)

1. **Search Engine:** User mencari mandiri dengan filter (Domisili, Usia, Status, Pendidikan, dll).
2. **Grid View:** Menampilkan kartu kandidat.
   - **Foto:** Wajib Blur (Buram) 100%.
   - **Identitas:** Menggunakan Kode Unik (misal: IKH-001) atau Nama Samaran.
3. **Detail Profil:** User bisa membaca data lengkap (Visi, Ibadah, dll) tapi tidak melihat wajah jelas.

### C. Fase Proposal (Action)

1. User klik **"Ajukan Taaruf"**.
2. *Prompt:* Konfirmasi pemotongan **1 Tiket**.
3. **AI Compatibility Analysis:**
   - Sistem AI menganalisis kecocokan antara pengirim dan target berdasarkan data profil (biodata, ibadah, visi misi, kriteria).
   - Hasil analisis AI mencakup: tingkat kesesuaian, potensi konflik, rekomendasi, dan poin-poin penting untuk dipertimbangkan.
   - Analisis AI ditampilkan sebagai bahan pertimbangan bagi target untuk menerima atau menolak ajakan taaruf.
4. Status hubungan: **Pending**.
5. Penerima mendapat notifikasi. Bisa melihat CV pengirim dan hasil analisis AI (Foto pengirim masih blur bagi penerima sebelum diterima).

### D. Fase Taaruf (Match)

Jika penerima klik **"Terima"**:

1. Status hubungan: **Taaruf (Nadzhor)**.
2. **Unblur Foto:** Foto profil kedua pihak otomatis menjadi **Jelas (HD)**.
3. **Chat Unlocked:** Fitur chat dalam aplikasi terbuka.
4. **Notifikasi Wali:** WA Wali menerima pesan otomatis: *"Ananda [Nama] telah memulai proses taaruf dengan [Nama Kandidat]. Mohon dipantau."*

### E. Fase Khitbah (Goal)

Setelah diskusi via chat dan merasa cocok:

1. User klik tombol **"Lanjut ke Khitbah (Buka Kontak)"**.
2. *Prompt:* Konfirmasi pemotongan **10 Tiket** (Syarat keseriusan).
3. Jika saldo cukup -> Tiket terpotong -> Request dikirim ke lawan bicara.
4. Jika lawan bicara setuju -> Status hubungan: **Khitbah**.
5. **Unlock Contact:** Nomor WhatsApp asli kedua belah pihak muncul di layar.
6. Aplikasi menyarankan pertemuan *offline* didampingi Wali.

---

## 5. Logika Privasi & Status Hubungan (Core Logic)

Sistem ini mengatur visibilitas data berdasarkan status hubungan User A dan User B.

| Data User Target | 1. Stranger (Search) | 2. Pending Proposal | 3. Taaruf (Match) | 4. Khitbah | 5. Married |
| --- | --- | --- | --- | --- | --- |
| **Foto Wajah** | **Blur Total** | **Blur Total** | **Terbuka (Jelas)** | **Terbuka (Jelas)** | **Terbuka (Jelas)** |
| **Nama** | Kode / Samaran | Kode / Samaran | Nama Panggilan | **Nama Asli (KTP)** | **Nama Asli (KTP)** |
| **Fitur Chat** | Terkunci | Terkunci | **Terbuka** | **Terbuka** | **Terbuka** |
| **Nomor WA/HP** | Tersembunyi | Tersembunyi | Tersembunyi | **Terbuka** | **Terbuka** |
| **Data Wali** | Tersembunyi | Tersembunyi | Nama Wali Muncul | **No HP Wali Muncul** | **No HP Wali Muncul** |

### Database Flow

1. **Proposal Dikirim**
   - `proposals` record: `{sender_id, receiver_id, status: 'pending', message, created_at}`
   - Tidak ada `relationships` record (hubungan belum terbentuk)

2. **Proposal Diterima**
   - `proposals.status`: `'accepted'`
   - `relationships` record dibuat: `{user_a_id, user_b_id, proposal_id, status: 'taaruf', taaruf_started_at}`
   - Foto profil kedua pihak otomatis unblur
   - Fitur chat terbuka

3. **Hubungan Berlanjut ke Khitbah**
   - `relationships.status`: `'khitbah'`
   - `relationships.khitbah_started_at`: timestamp
   - Nomor WhatsApp kedua pihak terbuka

4. **Hubungan Berakhir**
   - `relationships.status`: `'ended'`
   - `relationships.ended_at`: timestamp

5. **Menikah (Goal Achieved)**
   - `relationships.status`: `'married'`
   - `relationships.married_at`: timestamp
   - Hubungan ditandai sebagai sukses mencapai tujuan

---

## 6. Fitur Pendukung

### A. Dashboard Wali (Web View / Lite)

Wali tidak harus install aplikasi penuh. Wali dapat memantau melalui Link Web khusus yang dikirim via WA atau login menggunakan No HP di aplikasi.

- **Fitur Wali:**
  - Melihat status anak (Sedang taaruf dengan siapa).
  - **Chat Read-Only:** Wali bisa membaca riwayat chat anaknya untuk memastikan tidak ada pelanggaran syariat (tanpa bisa membalas).

### B. Keamanan & Privasi

1. **Anti-Screenshot:** Aplikasi memblokir tangkapan layar (layar jadi hitam) pada halaman Profil dan Chat untuk melindungi privasi Akhwat.
2. **Watermark:** Saat foto terbuka (fase Taaruf), foto dilapisi watermark ID pengguna yang melihat, untuk melacak kebocoran data.
3. **Report System:** Tombol lapor untuk indikasi penipuan atau perilaku tidak sopan.

### C. Sistem Notifikasi

1. **Notifikasi Real-time:**
   - **Proposal Baru:** User menerima notifikasi saat ada pengguna lain mengajukan proposal taaruf.
   - **Status Proposal:** Notifikasi saat proposal diterima atau ditolak.
   - **Chat Baru:** Notifikasi saat ada pesan baru dalam chat taaruf.
   - **Perubahan Status:** Notifikasi saat status hubungan berubah (Pending → Taaruf → Khitbah).
   - **Notifikasi Wali:** Wali menerima notifikasi saat anaknya memulai taaruf.

2. **UI Notifikasi:**
   - Icon bel di header dashboard dengan badge merah untuk unread notifications.
   - Dropdown list menampilkan notifikasi terbaru.
   - Mark as read saat notifikasi diklik.
   - Auto-refresh untuk update real-time.

---

## 7. Kebutuhan Non-Fungsional

1. **Responsiveness:** UI harus nyaman digunakan di layar HP kecil maupun besar.
2. **Performance:** Loading foto (blur/unblur) harus cepat (< 2 detik).
3. **Notification:** Real-time push notification untuk Chat dan Status Proposal.

---

## 8. Skenario Pengujian (Acceptance Criteria)

1. **User tidak bisa cari jodoh sebelum upload KTP:** Valid.
2. **User tidak bisa chat sebelum proposal diterima:** Valid.
3. **Tiket terpotong saat ajukan proposal:** Valid.
4. **Tiket terpotong 10 saat minta buka kontak:** Valid.
5. **Saldo 0 tidak bisa ajukan proposal:** Valid (Redirect ke halaman Top Up).
6. **Wali menerima notifikasi saat status berubah jadi Taaruf:** Valid.
7. **Foto User B terlihat jelas oleh User A HANYA setelah User B menerima proposal:** Valid.

---

## 9. Design Specifications (JDS v1.0)

### A. Visual Philosophy

**"Modern Islamic Luxury"**
Menggabungkan elemen minimalis modern dengan sentuhan tipografi klasik dan warna alam yang dalam. Menghindari sudut tajam (kotak) untuk menciptakan kesan organik dan ramah.

### B. Color Palette

**Primary Colors (Deep Emerald):**

- **Primary Main:** `#065F46` (Emerald 800) - Digunakan untuk Header, Sidebar, Tombol Utama.
- **Primary Light:** `#34D399` (Emerald 400) - Untuk elemen dekoratif / gradasi.
- **Primary Surface:** `#ECFDF5` (Emerald 50) - Untuk background aktif.

**Accent Colors (Muted Gold):**

- **Gold Main:** `#D97706` (Amber 600) - Untuk elemen Premium, Tiket, dan CTA Sekunder.
- **Gold Light:** `#FBBF24` (Amber 400) - Untuk icon highlight.

**Neutral & Backgrounds:**

- **Cream Background:** `#FDFBF7` (Warm Cream) - **Wajib** digunakan sebagai background utama (bukan putih murni) untuk kenyamanan mata.
- **Dark Navy:** `#0F172A` (Slate 900) - Untuk Section Footer atau Pricing (Mode Gelap).
- **Text Main:** `#1F2937` (Gray 800).
- **Text Muted:** `#6B7280` (Gray 500).

### C. Typography

**Font Pairing Strategy:**

- **Headings (Display):** `Playfair Display` (Serif).
  - Digunakan untuk: Judul Halaman, Kode User (AKH-001), Angka Statistik Besar, Harga.
  - Kesan: Elegan, Dewasa, Klasik.

- **Body (Interface):** `Plus Jakarta Sans` (Sans-Serif).
  - Digunakan untuk: Paragraf, Label Form, Tombol, Menu, Chat.
  - Kesan: Modern, Bersih, Keterbacaan Tinggi.

**Scale:**

- **H1:** 48px - 60px (Playfair, Bold)
- **H2:** 32px - 36px (Playfair, SemiBold)
- **Card Title:** 20px (Playfair, Bold)
- **Body:** 14px - 16px (Jakarta Sans, Regular)

### D. Shape & Spacing (Organic Modernism)

**Border Radius:**

- **Card / Container:** `rounded-[2rem]` atau `32px` (Sangat bulat). Hindari sudut lancip.
- **Input Fields:** `rounded-xl` (12-16px).
- **Buttons:** `rounded-full` (Pill Shape).

**Shadows & Depth:**

- **Glow Effect:** Gunakan colored shadow, bukan black shadow.
  - Contoh: `shadow-lg shadow-primary/20` (Bayangan hijau halus).
- **Glassmorphism:** Gunakan untuk overlay di atas gambar/peta.
  - `bg-white/80 backdrop-blur-md border border-white/50`.

### E. Component Guidelines

1. **Buttons:**
   - **Primary:** Background `#065F46`, Teks Putih, Rounded Full, Shadow Glow.
   - **Secondary:** Background Putih, Border `#E5E7EB`, Teks `#065F46`.

2. **Cards (Profil/Info):**
   - Background Putih di atas Background Cream.
   - Border tipis `#F3F4F6`.
   - Hover Effect: Sedikit naik (`-translate-y-1`) dan shadow membesar.

3. **Imagery:**
   - Foto manusia wajib sopan (menutup aurat).
   - Pada fase "Search", foto wajib diberi filter CSS `blur(8px)`.
   - Gunakan ornamen abstrak "Arch" (lengkungan kubah) secara subtil sebagai dekorasi background.

---

*Dokumen ini sah sebagai acuan pengembangan JemputJodoh.id dengan standar desain JDS v1.0.*
