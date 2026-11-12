# TEST-REPORT — Last Orders at Senja (v1)

Tanggal pengujian: 12 November 2026. Penguji: agen builder (pengujian otomatis + inspeksi visual). Semua hasil di bawah ini berasal dari eksekusi nyata — tidak ada hasil yang diasumsikan.

## 1. Ringkasan

| Uji | Hasil |
|---|---|
| Uji logika graph cerita (`node test-story.js`) | **LULUS semua** (12 cek, exit 0) |
| Pencarian state exhaustive (reachability ending) | **260.600 state dijelajahi; ke-5 ending tercapai** |
| Jalur kanonis (simulasi 5 playthrough) | **5/5 berakhir di ending yang dituju** |
| Uji browser Chromium headless (17 cek) | **LULUS semua, 0 error console** |
| Uji tambahan (audio ON, file://, kecepatan teks) | **LULUS semua, 0 error console** |
| Inspeksi visual screenshot | Dilakukan; 4 masalah polish ditemukan dan **diperbaiki + diuji ulang** |

## 2. Uji logika graph (`test-story.js`)

Perintah: `node test-story.js` (exit code 0). Yang diperiksa:

1. **Target valid** — semua `next`/`choices`/`branch` dari 90 node menunjuk node yang ada. LULUS.
2. **Reachability** — semua 90 node tercapai dari `prologue1` (mengabaikan syarat `requires`, ditambah gerbang ending). LULUS.
3. **Jalan buntu** — satu-satunya node tanpa kelanjutan adalah tepat 5 epilog ending. LULUS.
4. **Kualitas teks** — semua node tampil (di luar node routing) punya teks final ≥ 40 karakter; tidak ada `lorem`, `TODO`, `FIXME`, `placeholder`, `XXX`. LULUS.
5. **Titik pilihan** — 16 node pilihan (syarat ≥ 15). LULUS.
6. **Struktur ending** — 5 ending, masing-masing adegan + epilog dengan teks berbeda; tidak ada dua ending berbagi teks. LULUS.
7. **Pencarian exhaustive** — DFS atas ruang state (node × meter tercap 12 × bitmask 5 item) menjelajahi 260.600 state dan menemukan jalur ke ke-5 ending. LULUS.
8. **Jalur kanonis** — 5 urutan pilihan rancangan tangan disimulasikan dengan logika engine yang sama dan semuanya berakhir di ending yang dituju (lihat §3). LULUS.
9. **Kolektibilitas item** — ke-5 objek memory shelf dapat dikumpulkan. LULUS.

File bukti: `canonical-paths.json` (hasil simulasi), `ending-paths.json` (jalur pertama yang ditemukan pencarian exhaustive).

## 3. Urutan pilihan terverifikasi untuk tiap ending

Setiap jalur = 16 pilihan (prologue + 3 per chapter 1–4 + 3 di chapter 5). Meter akhir dicatat apa adanya dari simulasi. Jalur-jalur ini juga dimainkan ulang secara penuh di browser sungguhan (§4).

### 3.1 Dawn Shift (terbaik) — meter akhir Memory 9 / Warmth 9 / Truth 8, 5/5 objek

1. Prologue: "Put the kettle on first. The night will want something warm."
2. Ch.1 dialog: "You came because it's the last night. Say it plainly."
3. Ch.1 drink: "Kopi tubruk — strong, black, no hiding in it."
4. Ch.1 shelf: "Show him Ibu's recipe card, kept behind the jars."
5. Ch.2 dialog: "Tell me about her — the her from before I was born."
6. Ch.2 drink: "Cokelat panas — sweet, like the first day of school."
7. Ch.2 shelf: "Open the envelope — a photograph, kept for a year."
8. Ch.3 dialog: "Stay a while. Goodbyes can wait for one more cup."
9. Ch.3 drink: "Teh jahe — something warm to carry with him."
10. Ch.3 shelf: "Open the drawer — the two bus tickets are still there."
11. Ch.4 dialog: "Come in out of the rain first. The story can wait."
12. Ch.4 drink: "Teh jahe — warm, gentle, for someone who had been out in the rain."
13. Ch.4 shelf: "Accept the thermos, and set it on the shelf with the others."
14. Ch.5 shelf: "Take down the chipped cup, and hold it in the dawn light."
15. Ch.5 brew: "Kopi tubruk — to face the morning clearly."
16. Ch.5 decision: "Close the shutters gently, and carry the night with you."

### 3.2 Open Again — meter akhir Memory 5 / Warmth 21 / Truth 2, 1/5 objek

1. Prologue: "Put the kettle on first. The night will want something warm."
2. Ch.1 dialog: "You're soaked. Sit. The rain can wait outside."
3. Ch.1 drink: "Teh jahe — ginger tea, warm all the way down."
4. Ch.1 shelf: "Ask him about his life — really ask."
5. Ch.2 dialog: "I'm glad you came. The night needed you in it."
6. Ch.2 drink: "Teh jahe — for her joints, and the long walk home."
7. Ch.2 shelf: "Ask what Ibu was like as her student."
8. Ch.3 dialog: "Stay a while. Goodbyes can wait for one more cup."
9. Ch.3 drink: "Teh jahe — something warm to carry with him."
10. Ch.3 shelf: "Promise to visit him, and mean it this time."
11. Ch.4 dialog: "Come in out of the rain first. The story can wait."
12. Ch.4 drink: "Teh jahe — warm, gentle, for someone who had been out in the rain."
13. Ch.4 shelf: "Ask her who she really is — and why tonight."
14. Ch.5 shelf: "Take down the chipped cup, and hold it in the dawn light."
15. Ch.5 brew: "Cokelat panas — to remember, properly, before moving on."
16. Ch.5 decision: "Close the shutters gently, and carry the night with you."

### 3.3 The Unsent Letter — meter akhir Memory 0 / Warmth 0 / Truth 31, 0/5 objek

1. Prologue: "Stand in the doorway and look at the street a moment."
2. Ch.1 dialog: "You came because it's the last night. Say it plainly."
3. Ch.1 drink: "Kopi tubruk — strong, black, no hiding in it."
4. Ch.1 shelf: "Tell him the stall closes for good at dawn."
5. Ch.2 dialog: "Tell me about her — the her from before I was born."
6. Ch.2 drink: "Kopi tubruk — the way she takes it when marking papers."
7. Ch.2 shelf: "Admit you never read the letters Ibu left behind."
8. Ch.3 dialog: "Then say it wrong. Wrong is still honest."
9. Ch.3 drink: "Kopi tubruk — strong enough for a long journey."
10. Ch.3 shelf: "Tell him the truth about why you stayed all these years."
11. Ch.4 dialog: "How do you know this place? Tell me everything."
12. Ch.4 drink: "Kopi tubruk — she believed in facing the night head-on."
13. Ch.4 shelf: "Ask her who she really is — and why tonight."
14. Ch.5 shelf: "Open the box, and read the first letter at last."
15. Ch.5 brew: "Kopi tubruk — to face the morning clearly."
16. Ch.5 decision: "Write the letter — the honest one, the one that has waited a year."

### 3.4 The Last Cup — meter akhir Memory 18 / Warmth 0 / Truth 0, 5/5 objek

1. Prologue: "Light the lamps one by one, slowly."
2. Ch.1 dialog: "Say nothing. Let the kettle fill the silence."
3. Ch.1 drink: "Cokelat panas — the way Ibu made it when you were small."
4. Ch.1 shelf: "Show him Ibu's recipe card, kept behind the jars."
5. Ch.2 dialog: "Nod, and busy yourself with the cups."
6. Ch.2 drink: "Cokelat panas — sweet, like the first day of school."
7. Ch.2 shelf: "Open the envelope — a photograph, kept for a year."
8. Ch.3 dialog: "Joke it away: “The universe also gave you that jacket.”"
9. Ch.3 drink: "Cokelat panas — the thunderstorm drink, for old times."
10. Ch.3 shelf: "Open the drawer — the two bus tickets are still there."
11. Ch.4 dialog: "Keep your distance. Strangers at 3 a.m. are rarely simple."
12. Ch.4 drink: "Cokelat panas — the drink for storms, and for the frightened."
13. Ch.4 shelf: "Accept the thermos, and set it on the shelf with the others."
14. Ch.5 shelf: "Take down the chipped cup, and hold it in the dawn light."
15. Ch.5 brew: "Cokelat panas — to remember, properly, before moving on."
16. Ch.5 decision: "Close the shutters gently, and carry the night with you."

### 3.5 The Empty Chair — meter akhir Memory 0 / Warmth 18 / Truth 2, 0/5 objek

1. Prologue: "Put the kettle on first. The night will want something warm."
2. Ch.1 dialog: "Say nothing. Let the kettle fill the silence."
3. Ch.1 drink: "Teh jahe — ginger tea, warm all the way down."
4. Ch.1 shelf: "Ask him about his life — really ask."
5. Ch.2 dialog: "Nod, and busy yourself with the cups."
6. Ch.2 drink: "Teh jahe — for her joints, and the long walk home."
7. Ch.2 shelf: "Ask what Ibu was like as her student."
8. Ch.3 dialog: "Joke it away: “The universe also gave you that jacket.”"
9. Ch.3 drink: "Teh jahe — something warm to carry with him."
10. Ch.3 shelf: "Promise to visit him, and mean it this time."
11. Ch.4 dialog: "Keep your distance. Strangers at 3 a.m. are rarely simple."
12. Ch.4 drink: "Teh jahe — warm, gentle, for someone who had been out in the rain."
13. Ch.4 shelf: "Ask her who she really is — and why tonight."
14. Ch.5 shelf: "Sit in the quiet, and let the morning arrive on its own."
15. Ch.5 brew: "Teh jahe — to carry warmth into whatever comes next."
16. Ch.5 decision: "Leave the lamp on. Let the light decide what it is for."

## 4. Uji browser (Chromium headless, Playwright)

Lingkungan: Chromium Headless Shell 158, viewport desktop 1280×800 + mobile 390×844, disajikan via server statis lokal. Skrip uji: `/tmp/senja-pw/play.js` (17 cek) + `/tmp/senja-pw/extra.js` (6 cek). Hasil: **semua lulus, 0 console error, 0 page error** — pada dua run penuh (sebelum dan sesudah perbaikan polish §5).

| # | Cek | Hasil |
|---|---|---|
| 1 | Layar judul tampil (judul + tombol) | Lulus |
| 2 | Adegan pertama chapter 1 (speaker Ardi) | Lulus |
| 3 | Modal shelf: tepat 5 kartu | Lulus |
| 4 | Toggle mute mengubah label | Lulus |
| 5 | Sesudah reload, tombol Continue tampil | Lulus |
| 6 | Continue melanjutkan di node yang sama | Lulus |
| 7–11 | Playthrough penuh ke-5 jalur kanonis (banner ending + localStorage endings terverifikasi) | Lulus 5/5 |
| 12 | Chapter select terbuka sesudah tamat | Lulus |
| 13 | Lompat ke chapter 3 menampilkan label benar | Lulus |
| 14 | Galeri: 1 kartu terbuka sesudah 1 ending | Lulus |
| 15 | Mobile: tidak ada overflow horizontal | Lulus |
| 16 | Keyboard: Enter mulai, Enter lanjut, angka pilih | Lulus |
| 17 | Console errors | 0 |
| 18 | Protokol file:// (buka langsung) | Lulus |
| 19 | Klik teks menyelesaikan ketikan (click-to-complete) | Lulus |
| 20 | Jalur audio dengan suara ON (pour/clink/chime) tanpa error | Lulus |
| 21 | Item terkumpul saat audio ON | Lulus |
| 22 | Kecepatan Slow + Enter menyelesaikan ketikan | Lulus |
| 23 | Console errors (uji tambahan) | 0 |

Bukti visual: `test-evidence/` — `title.png`, `scene-chapter1-ardi.png`, `ending-dawn.png`, `ending-open.png`, `ending-letter.png`, `ending-cup.png`, `ending-chair.png`, `gallery.png`, `shelf-modal.png`, `mobile-title.png`, `mobile-scene.png`, `browser-test-results.json`.

## 5. Bug yang ditemukan dan diperbaiki

| # | Temuan | Perbaikan | Verifikasi |
|---|---|---|---|
| 1 | `audio.js` `clink()`: loop mati mengakses `this.ctx` dalam callback strict-mode → akan throw bila dipanggil | Loop mati dihapus; hanya loop SFX yang benar yang tersisa | Uji browser audio-ON lulus; `node --check` lulus |
| 2 | Uji teks gagal untuk 4 node `c*_close` (tanpa teks) | Bukan bug game: node routing tidak pernah dirender. Uji diperbaiki agar melewatkan node routing | `test-story.js` lulus penuh |
| 3 | Toast di bawah menutupi tombol pilihan/Continue (desktop + mobile) | Toast dipindah ke atas layar | Screenshot ulang: tidak ada overlap |
| 4 | HUD melipat tak rapi di desktop; tombol pilihan ke-3 terpotong di viewport pendek | HUD direstruktur dua baris (info + meter); panel cerita bisa scroll internal; tinggi adegan minimum | Screenshot ulang: HUD rapi, ke-3 pilihan terlihat penuh; uji browser diulang lulus |
| 5 | Emoji 🔊/🔇/🧺 tampil sebagai kotak di lingkungan tanpa font emoji | Label diganti teks polos ("Sound: On/Off", "Shelf & Journal") | Screenshot ulang: label terbaca |
| 6 | Harness uji tambahan melewatkan klik Continue (bukan bug game) | Harness diperbaiki jadi driver generik | Uji tambahan lulus |

## 6. Celah yang tersisa (jujur)

1. **Kualitas suara belum didengar telinga manusia.** Jalur kode audio sudah dieksekusi tanpa error di headless (tanpa perangkat audio), tapi keseimbangan volume melodi/hujan/SFX belum dinilai secara auditif. Butuh: sekali dengar di perangkat nyata (HP/desktop) sebelum submit; penyesuaian gain hanya mengubah angka di `audio.js`.
2. **Chapter select tidak bisa mencapai semua ending.** Dari chapter 5 saja, hanya Letter/Cup/Chair yang terjangkau (Dawn/Open butuh poin dari chapter awal). Ini disengaja dan dijelaskan di dalam game + DESIGN.md — chapter select untuk mengunjungi ulang adegan, bukan jalan pintas ke ending terbaik. Bukan bug.
3. **Uji browser hanya di Chromium.** Firefox/Safari belum diuji (engine memakai API standar: localStorage, WebAudio, CSS flex — risiko rendah, tapi belum dibuktikan). Butuh: sekali buka di Safari/Firefox bila tersedia sebelum submit.
4. **Video gameplay belum dibuat.** Bukan bagian game; dibutuhkan untuk submission (lihat PRE-SUBMIT-CHECK.md).
5. **Hosting publik + akun submit belum ada.** Game siap di-host apa adanya; prasyarat pengajuan dicatat di PRE-SUBMIT-CHECK.md.

## 7. Pemeriksaan kepatuhan isi (grep, 12 Nov 2026)

- Data pribadi Zul (email, telepon, alamat): **tidak ditemukan** di file game. Satu-satunya nama: "Zul Zulfikar" di credits (wajib, sesuai brief).
- Brand/IP pihak ketiga: **tidak ditemukan**.
- URL eksternal / dependency CDN di file game: **nol**.
- Kata sandi/kredensial di file game: **tidak ada**.
