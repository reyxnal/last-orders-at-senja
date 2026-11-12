# PRE-SUBMIT CHECK — Last Orders at Senja

Verifikasi menyeluruh SATU KALI sebelum submit, sesuai perintah Zul (12 Nov 2026): cek ulang sebelum submit agar kelihatan kurangnya di mana dan butuh apa. Dokumen ini ditulis 12 November 2026, sesudah build v1 selesai dan sesudah semua perbaikan yang bisa dilakukan agen sendiri diterapkan + diuji ulang.

**Perhatian:** TIDAK ADA submit yang dilakukan. Dokumen ini adalah laporan kesiapan untuk Zul, sebelum keputusan submit apa pun diambil.

## 1. Playthrough penuh ke-5 ending — BUKTI

Setiap ending dimainkan penuh DUA kali dengan bukti independen:

**(a) Simulasi logika** (`node test-story.js`): pencarian exhaustive 260.600 state + 5 jalur kanonis rancangan tangan. Semua berakhir di ending yang dituju. Urutan 16 pilihan tiap ending tercatat lengkap di `TEST-REPORT.md §3` dan `canonical-paths.json`.

**(b) Browser sungguhan** (Chromium headless, Playwright): ke-5 jalur kanonis diklik penuh dari layar judul sampai epilog; banner ending + unlock di localStorage diverifikasi per ending; **0 console error**. Screenshot tiap ending: `test-evidence/ending-dawn.png`, `ending-open.png`, `ending-letter.png`, `ending-cup.png`, `ending-chair.png` (+ `title.png`, `scene-chapter1-ardi.png`, `gallery.png`, `mobile-*.png`, `browser-test-results.json`).

| Ending | Meter akhir (simulasi) | Objek | Browser |
|---|---|---|---|
| Dawn Shift | M9 / W9 / T8 | 5/5 | Lulus |
| Open Again | M5 / W21 / T2 | 1/5 | Lulus |
| The Unsent Letter | M0 / W0 / T31 | 0/5 | Lulus |
| The Last Cup | M18 / W0 / T0 | 5/5 | Lulus |
| The Empty Chair | M0 / W18 / T2 | 0/5 | Lulus |

## 2. Checklist kepatuhan Official Rules (yang sudah diverifikasi)

Dasar: Terms resmi `chromaawards.com/terms` (dibaca parent 12 Nov 2026) + verifikasi portal resmi. Tenggat: 7 Jan 2027 23:45 PT = 8 Jan 2027 14:45 WIB. Kategori: Game — Interactive Narrative.

| # | Persyaratan | Status | Bukti / catatan |
|---|---|---|---|
| 1 | Gratis, tanpa pembelian | ✅ Terpenuhi | Game gratis; tanpa pembelian di dalam game. |
| 2 | Wajib memakai minimal 1 AI Tool | ✅ Terpenuhi | Muse (penulisan/desain/kode) + image generation (art). |
| 3 | Disclosure pemakaian AI akurat & lengkap | ✅ Siap | Credits di dalam game + draf `AI-DISCLOSURE.md` (versi pendek + panjang, siap tempel). |
| 4 | Tautan web publik yang bisa di-embed di Project Gallery (bukan privat/password/unlisted) | ⏳ **BELUM** — butuh hosting | Game siap di-host apa adanya (statis, tanpa frame-busting). Belum ada URL publik. Lihat Gap G1. |
| 5 | Download link | ⏳ **BELUM** — butuh paket + hosting | Set file submission terdefinisi (README). Belum ada zip + tautan unduh publik. Lihat Gap G1. |
| 6 | Thumbnail | ✅ Siap | `assets/hero-thumbnail.jpg` (1920×1280, 16:9 efektif 3:2 — lihat catatan). |
| 7 | Video gameplay (rekaman layar, bukan video generatif) | ⏳ **BELUM** — butuh rekam | Belum direkam. Lihat Gap G2. |
| 8 | Berbahasa Inggris (voiced ATAU subtitle Inggris) | ✅ Terpenuhi | Seluruh teks game berbahasa Inggris; tanpa voice. |
| 9 | Karya orisinal, hak penuh, tanpa IP/franchise pihak ketiga | ✅ Terpenuhi | Grep: tanpa brand/IP. Semua karakter/latar fiktif, dibuat untuk game ini. |
| 10 | Tanpa deepfake/likeness tanpa izin | ✅ Terpenuhi | Semua potret adalah karakter fiktif hasil AI; bukan likeness siapa pun. |
| 11 | Musik hanya orisinal / berlisensi / generated AI sepenuhnya | ✅ Terpenuhi | 100% orisinal, disintesis live via kode WebAudio. Tanpa file musik. |
| 12 | Tanpa data pribadi dalam karya | ✅ Terpenuhi | Grep: tanpa email/telepon/alamat. Nama Zul hanya di credits (wajib). |
| 13 | 18+; Indonesia eligible | ✅ (untuk Zul) | Keputusan/konfirmasi akhir milik Zul saat mengisi formulir. |
| 14 | Human creativity komponen inti; credit jelas | ✅ Terpenuhi | Credits menyebut arahan kreatif Zul + peran tiap alat AI secara jujur. |
| 15 | Tidak meniru contoh ide blog SpriteCook | ✅ Terpenuhi | Tanpa lighthouse keeper / pixel phone mystery / mail delivery. |

Catatan thumbnail: file hero berdimensi 1920×1280 (rasio 3:2), bukan 16:9 persis. Ia tetap berfungsi sebagai thumbnail; bila formulir menuntut 16:9 persis, potong menjadi 1920×1080 (crop tengah) sebelum unggah — perbaikan 1 menit, dicatat sebagai Gap G5 (agen bisa, tapi tunggu spesifikasi formulir).

## 3. Kelengkapan aset + cek teknis

**Aset — lengkap:**
- Art AI orisinal: 9/9 (hero, latar warung, 4 potret, 3 vignette) — semua diperiksa visual; gaya konsisten; tanpa teks/logo/likeness. Prompt tercatat di `DESIGN.md`; receipt di `provenance/`.
- Audio: musik ambient prosedural per chapter + 4 SFX (pour, clink, chime, tick), semua dari kode. Jalur kode dieksekusi tanpa error dengan suara ON. Kualitas auditori belum dinilai telinga manusia (Gap G3).
- Thumbnail: siap (lihat catatan rasio di atas).

**Teknis — lulus:**
- 0 error JS di console pada 2 run browser penuh (17 cek) + uji tambahan (6 cek) + `node --check` semua file JS.
- Desktop (1280×800) + mobile (390×844, tanpa overflow horizontal).
- Save/Continue (reload + resume di node sama), mute, 4 kecepatan teks (termasuk click-to-complete + Enter), keyboard penuh, chapter select, galeri ending, shelf/journal, restart.
- Jalan dari `file://` maupun hosting statis; nol dependency eksternal; nol panggilan jaringan.
- Aksesibilitas: kontras, label teks pada meter, fokus keyboard, `prefers-reduced-motion`, tanpa flashing/strobe.

**Yang sudah diperbaiki dalam run ini** (bukan lagi kekurangan): bug `this` di `clink()`; toast menutupi tombol; HUD melipat tak rapi + pilihan terpotong; label emoji yang gagal render. Semua diuji ulang sesudah perbaikan — lihat `TEST-REPORT.md §5`.

## 4. DAFTAR KEKURANGAN (gap list) — hanya yang tersisa

Sesuai prinsip "teliti tapi SUKSES": semua kekurangan yang bisa diperbaiki agen sendiri SUDAH diperbaiki dalam run ini. Yang tersisa di bawah ini hanya yang benar-benar butuh Zul/manusia atau keputusan.

| ID | Kekurangan | Yang dibutuhkan tepatnya | Butuh Zul/manusia? |
|---|---|---|---|
| G1 | **Belum ada URL publik + download link.** Game hanya ada lokal. | Deploy folder game (6 item: `index.html`, 3 JS, CSS, `assets/`) ke hosting statis publik yang mengizinkan embed (mis. GitHub Pages / Netlify / itch.io) + buat zip yang sama untuk download link. | **YA — keputusan + (kemungkinan) akun.** Agen dilarang membuat repo/push dalam run ini; deploy butuh persetujuan Zul atas layanan + akun yang dipakai. |
| G2 | **Belum ada video gameplay.** | Rekam layar 60–90 detik permainan nyata (judul → 1 adegan pilihan → 1 adegan chapter akhir/ending), dengan suara game ON, tanpa teks generatif. | **SEBAGIAN.** Rekam bisa dilakukan agen (Playwright + perekam layar) sesudah G1 atau dari lokal; Zul cukup meninjau hasilnya. Bukan blocker hari ini — tenggat 8 Jan 2027. |
| G3 | **Kualitas suara belum dinilai telinga manusia.** | Sekali dengar di perangkat nyata (5 menit main + dengar hujan/melodi/SFX); bila terlalu pelan/keras, agen ubah angka gain di `audio.js` + uji ulang. | **YA — telinga Zul** (atau siapa pun dengan perangkat bersuara). Agen tidak bisa menilai kualitas auditori dari headless. |
| G4 | **Belum ada akun Chroma + formulir submit belum dibaca.** | Buka formulir Sign Up platform submit, baca kolomnya, buat akun (kata sandi dari Zul via Secure Vault), isi + tempel disclosure dari `AI-DISCLOSURE.md`. | **YA — kata sandi dari Zul** + keputusan kapan submit. Agen tidak boleh membuat akun/kata sandi sendiri. |
| G5 | **Rasio thumbnail 3:2, bukan 16:9 persis.** | Bila formulir menuntut 16:9: crop `hero-thumbnail.jpg` ke 1920×1080. | **TIDAK — agen bisa**, sesudah spesifikasi formulir diketahui (G4). |
| G6 | **Belum diuji di Firefox/Safari.** | Sekali buka di Firefox + Safari (desktop/HP), main 2 menit, pastikan tanpa error visual/fungsi. | **YA — perangkat/browser Zul**, atau agen bila tersedia. Risiko rendah (API standar). |
| G7 | **Review cerita oleh manusia belum dilakukan.** | Zul (atau pembaca tepercaya) main 1 run penuh (±25 menit) dan tandai kalimat/nada yang terasa janggal; agen revisi teks di `story.js` + uji ulang. | **YA — penilaian Zul.** Ini soal selera/kualitas akhir, bukan fungsi. |
| G8 | **Angka hadiah per kategori belum terverifikasi pasti.** | Jangan klaim angka per kategori Interactive Narrative sampai halaman prizes resmi berhasil dibaca (fetch parent runtuh; sumber sekunder menyebut $2.000/$1.000/$500 + extra grand prize — belum pasti). | **TIDAK memengaruhi game.** Hanya memengaruhi apa yang dikatakan ke publik/formulir. |

Tidak ada kekurangan lain yang diketahui. Secara khusus TIDAK ada: bug yang diketahui, teks placeholder, aset hilang, error console, atau pelanggaran Terms yang diketahui pada karya itu sendiri.

## 5. Vonis

### BELUM SIAP SUBMIT — gamenya siap, prasyarat pengajuannya belum.

Alasan, dipisah jujur:

- **Karya (game): SIAP.** Cerita lengkap 5 chapter + 5 ending yang semuanya terbukti tercapai, art lengkap, audio orisinal, tanpa bug yang diketahui, lulus 23 cek browser + 12 cek logika dengan 0 error.
- **Pengajuan: BELUM.** Belum ada URL publik embeddable (G1), video gameplay (G2), akun + pembacaan formulir (G4), dan review manusia atas cerita/suara/browser lain (G3, G6, G7).

**Langkah berikutnya yang disarankan, berurutan:** (1) Zul main/dengar sekali (G7+G3, ±30 menit) → (2) putuskan layanan hosting + izinkan deploy (G1) → (3) agen rekam video gameplay (G2) + crop thumbnail bila perlu (G5) → (4) Zul berikan kata sandi akun via Secure Vault; agen/parent baca formulir + isi (G4) → (5) verifikasi pra-submit kedua yang singkat (URL publik dibuka + video ditonton) → submit. Tenggat masih 8 Jan 2027 14:45 WIB — tidak ada urgensi waktu, dan tidak ada alasan untuk terburu-buru.

---

*Lampiran bukti: `TEST-REPORT.md`, `DESIGN.md`, `AI-DISCLOSURE.md`, `test-evidence/`, `canonical-paths.json`, `ending-paths.json`, `test-story.js`.*
