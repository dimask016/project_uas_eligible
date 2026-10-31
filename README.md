https://dimask016.github.io/project_uas_eligible/Presentation/Presentasi_DimasK_Project_UAS_WAD.html

2R STORE - E-Commerce Platform (Laravel 12 & Inertia React)Aplikasi e-commerce 2R STORE dibangun menggunakan framework Laravel 12 dan Inertia.js (React), terintegrasi dengan Duitku Payment Gateway dan RajaOngkir API. Dokumen ini berisi rincian infrastruktur server AWS EC2, struktur direktori project, fitur aplikasi, serta alur deployment.📌 Informasi Repository & ServerRepository GitHub: https://github.com/dimask016/project_uas_eligibleAkses Web Public & Admin: http://ec2-32-236-168-110.ap-southeast-2.compute.amazonaws.com:8000Database Server: ec2-13-210-247-47.ap-southeast-2.compute.amazonaws.com🛠️ Manajemen Environment & Deployment AWS EC2Penggunaan AWS EC2 mengubah beberapa tahapan infrastruktur dan pengelolaan server:1. Provisioning Instans EC2Membuat instans EC2 baru (misal: Amazon Linux 2023 / Ubuntu) melalui AWS Management Console / CLI.Mengonfigurasi Security Group (Firewall EC2) untuk membuka port akses:Port 22 (SSH): Terbatas hanya untuk IP pengembang.Port 8000 (HTTP) & 443 (HTTPS): Terbuka untuk umum (0.0.0.0/0).Port 5177 & 3306: Akses port internal/database.Menyiapkan Kunci Privat SSH (.pem / .ppk) untuk akses masuk ke server EC2.2. Koneksi & Instalasi RuntimeMasuk ke instans EC2 via SSH:ssh -i "your-key.pem" ec2-user@ec2-32-236-168-110.ap-southeast-2.compute.amazonaws.com
Membuat Service Systemd untuk Laravel ServerBuat file service agar Laravel Artisan serve berjalan secara otomatis di background:sudo nano /etc/systemd/system/laravel.service
Masukkan konfigurasi berikut:[Unit]
Description=Laravel Artisan Development Server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/geek-store
ExecStart=/usr/bin/php artisan serve --host=0.0.0.0 --port=8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
Simpan di Nano: Ctrl + O -> Enter -> Ctrl + X.Aktifkan dan Jalankan Service Otomatissudo systemctl daemon-reload
sudo systemctl enable --now laravel
Cek Status Servicesudo systemctl status laravel
Jika berhasil, status akan menunjukkan: Active: active (running).Perintah Pengelolaan Service & LogKebutuhanPerintahMelihat log langsungsudo journalctl -u laravel -fRestart Laravelsudo systemctl restart laravelStop Laravelsudo systemctl stop laravelStart Laravelsudo systemctl start laravelCek Port 8000sudo ss -lntp | grep :8000Nonaktifkan Auto-Startsudo systemctl disable laravel3. Konfigurasi Akses Browser & Network SecurityPastikan Security Group EC2 mengizinkan inbound TCP port 8000 dari IP publik.Akses aplikasi melalui browser:http://32.236.168.110:8000/
Catatan: php artisan serve merupakan development server Laravel. Untuk lingkungan produksi skala penuh, direkomendasikan menggunakan Nginx/Apache dengan PHP-FPM.4. Cloning & Konfigurasi AplikasiKloning repository dari Git ke direktori server EC2.Install pustaka backend & frontend:composer install --no-dev
npm install && npm run build
Konfigurasi file .env produksi di server.Buat symbolic link storage:php artisan storage:link
5. Koneksi Elastic IP & Domain / SSLMengasosiasikan Elastic IP (IP Publik Statis AWS) ke instans EC2 agar alamat IP tidak berubah saat instans di-restart.Mengarahkan DNS Domain ke Elastic IP dan mengonfigurasi SSL (Certbot / AWS Certificate Manager).📁 Struktur Folder Projectgeek-store/
├── app/                                          # [BACKEND & LOGIK APLIKASI]
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Account/                          # Controllers khusus Admin Dashboard
│   │   │   │   ├── CategoryController.php        # Resource management kategori
│   │   │   │   ├── ColorController.php           # Resource management warna produk
│   │   │   │   ├── DashboardController.php       # Dashboard statistik & transaksi admin
│   │   │   │   ├── PermissionController.php     # Management permission (Spatie)
│   │   │   │   ├── ProductController.php         # Resource management produk & galeri gambar
│   │   │   │   ├── RoleController.php            # Management role (Admin & Customer)
│   │   │   │   ├── SliderController.php          # Resource management slider banner
│   │   │   │   ├── TransactionController.php     # Kelola & filter seluruh transaksi aplikasi
│   │   │   │   ├── UserController.php            # Management akun pengguna / admin
│   │   │   │   └── Backup & Temp Files:
│   │   │   │       ├── DashboardController_31okt.php
│   │   │   │       ├── TransactionController_error.php
│   │   │   │       └── TransactionController_ori_31okt.php
│   │   │   │
│   │   │   ├── Auth/                             # Controllers Autentikasi
│   │   │   │   ├── LoginController.php           # Autentikasi masukan & session login
│   │   │   │   ├── LogoutController.php          # Terminal session user
│   │   │   │   ├── RegisterController.php        # Pendaftaran akun customer baru
│   │   │   │   └── Backup Files:
│   │   │   │       ├── LoginController_bak.php
│   │   │   │       ├── LoginController_new_2.php
│   │   │   │       ├── LoginController_v2.php
│   │   │   │       ├── RegisterController_bak.php
│   │   │   │       └── RegisterController_v2.php
│   │   │   │
│   │   │   ├── Web/                              # Controllers Public Storefront & Customer
│   │   │   │   ├── CallbackController.php        # Webhook / Callback Handler Duitku Gateway
│   │   │   │   ├── CartController.php            # Manajemen keranjang belanja
│   │   │   │   ├── CategoryController.php        # Katalog produk berdasarkan kategori
│   │   │   │   ├── CheckoutController.php        # Kalkulasi RajaOngkir & Payment Duitku
│   │   │   │   ├── HomeController.php            # Landing page toko utama
│   │   │   │   ├── MyOrderController.php         # Riwayat pesanan & detail invoice customer
│   │   │   │   ├── ProductController.php         # Listing & detail spesifikasi produk
│   │   │   │   ├── SearchController.php          # Fitur pencarian produk
│   │   │   │   └── Backup Files:
│   │   │   │       ├── CartController_new.php
│   │   │   │       ├── CartController_new_jam11.php
│   │   │   │       ├── CartController_new_jam12.php
│   │   │   │       ├── CartController_new_jam15.php
│   │   │   │       ├── CheckoutController_new_jam12.php
│   │   │   │       └── CheckoutController_ori.php
│   │   │   │
│   │   │   └── Controller.php                    # Base Controller utama Laravel
│   │   │
│   │   └── Middleware/                           # Layer Proteksi & Keamanan
│   │       ├── HandleInertiaRequests.php         # Passing global props ke React (Auth, Cart, Flash)
│   │       ├── HandleInertiaRequests_ori.php     # Backup middleware
│   │       └── IsAdmin.php                       # Custom middleware verifikasi role admin
│   │
│   ├── Models/                                   # Database Models (Eloquent ORM)
│   │   ├── Cart.php
│   │   ├── Category.php
│   │   ├── City.php
│   │   ├── Color.php
│   │   ├── District.php
│   │   ├── Product.php
│   │   ├── ProductImage.php
│   │   ├── ProductSize.php
│   │   ├── Province.php
│   │   ├── Slider.php
│   │   ├── Transaction.php                       # Model utama Invoice / Transaksi
│   │   ├── TransactionDetail.php                 # Model Rincian Item Transaksi
│   │   ├── User.php                              # Model User dengan Spatie HasRoles
│   │   └── Backup Files:
│   │       ├── Product_new_jam12.php
│   │       ├── Product_old.php
│   │       └── Transaction_31okt.php
│   │
│   └── Providers/
│       └── AppServiceProvider.php                # Application Bootstrap & Service Providers
│
├── bootstrap/                                    # [BOOTSTRAP & CONFIG LOADERS]
│   └── app.php                                   # Registrasi Middleware, CSRF exceptions & Routing
│
├── config/                                       # [KONFIGURASI LINGKUNGAN]
│   ├── app.php                                   # Nama Aplikasi, Timezone, Locale
│   ├── auth.php                                  # Authentication Guards
│   ├── cache.php                                 # Caching Drivers (Redis/File)
│   ├── database.php                              # Konfigurasi Koneksi MySQL
│   ├── duitku.php                                # API Key & Merchant Code Duitku
│   ├── filesystems.php                           # Driver Storage Disks (Public/Local/S3)
│   ├── logging.php                               # Logging System Channels
│   ├── mail.php                                  # Mailer Config (SMTP/Notification)
│   ├── permission.php                            # Konfigurasi Spatie Laravel-Permission
│   ├── queue.php                                 # Background Queue Workers Configuration
│   ├── rajaongkir.php                            # API Key & Tipe Akun RajaOngkir
│   ├── services.php                              # Third-Party Credentials Configuration
│   └── session.php                               # Pengaturan Driver & Durasi Session
│
├── database/                                     # [DATABASE & MIGRATIONS]
│   ├── migrations/                               # Skema tabel database MySQL
│   └── seeders/                                  # Data awal (Admin User, Roles, Permissions)
│
├── resources/                                    # [FRONTEND REACT & INERTIA VIEWS]
│   ├── css/
│   │   └── app.css                               # Styling global CSS
│   │
│   ├── js/
│   │   ├── app.jsx                               # Entry point React & Inertia Client App
│   │   ├── bootstrap.js                          # Setup Axios & HTTP client
│   │   │
│   │   ├── Components/                           # Reusable UI Components
│   │   │   ├── Header.jsx                        # Header storefront dinamis (Role-based links)
│   │   │   ├── Menu.jsx                          # Navigasi utama
│   │   │   ├── Sidebar.jsx                       # Sidebar menu dashboard admin
│   │   │   ├── Slider.jsx                        # Carousel banner utama
│   │   │   ├── Sliders.jsx                       # Sub-komponen slider
│   │   │   └── Backup Files:
│   │   │       ├── Header_31Okt.jsx
│   │   │       ├── Header_baru.jsx
│   │   │       ├── Header_ori.jsx
│   │   │       ├── Menu_new.jsx
│   │   │       ├── Menu_ori.jsx
│   │   │       └── Menu_v1.jsx
│   │   │
│   │   ├── Layouts/                              # Layout Dasar Halaman
│   │   │   ├── Account.jsx                       # Layout khusus Admin Dashboard
│   │   │   ├── Web.jsx                           # Layout publik Storefront
│   │   │   └── Backup File:
│   │   │       └── Web_rev10.jsx
│   │   │
│   │   ├── Pages/                                # Halaman UI Inertia Page
│   │   │   ├── Account/                          # Area Admin Dashboard
│   │   │   │   ├── Categories/                   # View CRUD Kategori (Create, Edit, Index, Index_categories_update.jsx)
│   │   │   │   ├── Colors/                       # View CRUD Warna (Create, Edit, Index, Index_update_color.jsx)
│   │   │   │   ├── Dashboard/                    # Dashboard statistik transaksi (Index.jsx + backup Index_*.jsx)
│   │   │   │   ├── Permissions/                  # View Permissions (Index.jsx)
│   │   │   │   ├── Products/                     # View CRUD Produk (Create, Edit, Index, Show, Index_update.jsx)
│   │   │   │   ├── Roles/                        # View Roles (Create, Edit, Index, Index_update.jsx)
│   │   │   │   ├── Sliders/                      # View Sliders (Create, Index, Index_old.jsx, Index_ori.jsx)
│   │   │   │   ├── Transactions/                 # View Monitoring Transaksi Admin (Index.jsx, Show.jsx + backup *_31okt.jsx)
│   │   │   │   └── Users/                        # View Management Pengguna (Create, Edit, Index, Index_old.jsx)
│   │   │   │
│   │   │   ├── Auth/                             # Area Autentikasi
│   │   │   │   ├── Login.jsx                     # Form Login
│   │   │   │   └── Register.jsx                  # Form Register Customer
│   │   │   │
│   │   │   ├── User/                             # [Deprecated / Legacy Path]
│   │   │   │   └── Transactions/Index.jsx        # Transaksi legacy
│   │   │   │
│   │   │   └── Web/                              # Area Public & Customer Storefront
│   │   │       ├── Carts/                        # Keranjang Belanja (Index.jsx + backup Index_*.jsx)
│   │   │       ├── Categories/                   # Katalog Filter Kategori (Index.jsx, Show.jsx)
│   │   │       ├── Checkouts/                    # Checkout (Index.jsx, StoreCheckout.jsx + backup Index_*.jsx)
│   │   │       ├── Home/Index.jsx                # Landing Page Toko Utama
│   │   │       ├── MyOrders/                     # Halaman Riwayat Transaksi Customer
│   │   │       │   ├── Index.jsx                 # List Pesanan (Filter Status & Search)
│   │   │       │   ├── Show.jsx                  # Detail Invoice & Rincian Produk
│   │   │       │   └── Backup Files: Index_31okt.jsx, Show_31okt.jsx
│   │   │       └── Products/                     # Katalog & Detail Produk (AddToCart.jsx, Index.jsx, Show.jsx + backup files)
│   │   │
│   │   ├── Shared/                               # Shared UI Helper Components
│   │   │   ├── CardCategory.jsx                  # UI Kartu Kategori
│   │   │   ├── CardProduct.jsx                   # UI Kartu Produk
│   │   │   ├── Delete.jsx                        # Modal konfirmasi hapus data
│   │   │   ├── Pagination.jsx                    # Komponen pagination data
│   │   │   └── Search.jsx                        # Input pencarian global
│   │   │
│   │   └── Utils/                                # Utility Functions
│   │       ├── FormatPrice.jsx                   # Format angka ke Rupiah (Rp)
│   │       └── Permissions.jsx                   # Helper otorisasi role & permission React
│   │
│   └── views/                                    # Root HTML Entry
│       ├── app.blade.php                         # Template HTML tempat Inertia dirender
│       └── welcome.blade.php
│
└── routes/                                       # [ROUTING DEFINITIONS]
    ├── console.php                               # Scheduled commands / Artisan CLI routes
    └── web.php                                   # Routing utama (Public, Auth, Customer & Admin)
✨ List Fitur AplikasiAplikasi 2R STORE terbagi menjadi dua sisi utama: Customer (Web Public) dan Dashboard Admin.1. Fitur Sisi Customer (Web Public Storefront)E-Katalog & Pencarian Produk:Menampilkan katalog produk terbaru, rekomendasi, dan slider banner di halaman utama.Filter produk berdasarkan Kategori (Categories) dan pencarian kata kunci (Search).Detail produk lengkap beserta harga, varian (warna), deskripsi, dan stok.Keranjang Belanja (Cart Management):Tambah produk ke keranjang belanja.Update kuantitas item dan hapus item dari keranjang.Proses Checkout & Hitung Ongkir Otomatis:Integrasi API RajaOngkir untuk memilih Kota, Kecamatan, dan kalkulasi biaya pengiriman secara real-time.Multi-Payment Gateway Integration:Integrasi Duitku Sandbox untuk pembayaran instan (Virtual Account/VA, Credit Card, dll.).Generasi otomatis invoice dan kode bayar (payment_url).Manajemen Akun & Transaksi Customer:Autentikasi (Registrasi Akun Baru, Login, & Logout).Halaman "Pesanan Saya" (/my-orders) untuk memantau status pesanan (UNPAID, PAID, EXPIRED, CANCELLED).Detail invoice dan rincian produk yang dibeli beserta tombol bayar langsung via Duitku.2. Fitur Sisi Dashboard AdminAkses Login Admin:URL: http://ec2-32-236-168-110.ap-southeast-2.compute.amazonaws.com:8000/loginUsername: admin@gmail.comPassword: passwordAutentikasi & Proteksi Akses (RBAC):Restriksi rute dashboard (/account/dashboard) khusus role Administrator menggunakan Spatie Laravel-Permission & Middleware.Pengalihan (redirect) otomatis untuk user non-admin / customer yang mencoba mengakses area sensitif.Analitik & Dashboard Ringkasan:Ringkasan statistik jumlah transaksi (UNPAID, PAID, EXPIRED, CANCELLED).Grafik/Chart laporan pendapatan bulanan transaksi berstatus PAID.Manajemen Transaksi Customer (Order Management):Transparansi melihat seluruh transaksi dari semua customer.Tab filter status transaksi cepat (Semua Status, UNPAID, PAID, EXPIRED, CANCELLED).Fitur pencarian transaksi berdasarkan Nomor Invoice.Halaman detail transaksi customer (item yang dibeli, alamat pengiriman, dan status pembayaran).Manajemen Produk & Katalog (CRUD):Categories Management: Tambah, ubah, hapus, dan atur kategori produk.Products Management: Kelola data produk (nama, deskripsi, harga, stok, varian warna, dan gambar produk).Colors Management: Tambah dan atur varian warna produk.Sliders Management: Kelola gambar banner promosi di halaman utama toko.Manajemen Pengguna & Hak Akses (User & Security Management):Users Management: Kelola data pengguna/pelanggan dan penetapan role.Roles & Permissions Management: Atur peran user dan hak akses fitur secara dinamis menggunakan Spatie Permission.🚀 Alur Deployment ke GitHubPerintah Git yang digunakan saat melakukan pembaruan file dan pengunggahan kode ke repository GitHub origin/main:# 1. Cek status perubahan file di terminal EC2
git status

# 2. Stage seluruh perubahan file
git add .

# 3. Buat commit pesan update
git commit -m "Fix: transaction details relationship, null safety, and image rendering URL"

# 4. Verifikasi remote repository
git remote -v

# 5. Pastikan berada di branch main & Push ke GitHub
git branch -M main
git push -u origin main
