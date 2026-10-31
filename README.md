# 2R STORE - E-Commerce Platform (Laravel 12 & Inertia React)

Aplikasi e-commerce 2R STORE dibangun menggunakan framework **Laravel 12** dan **Inertia.js (React)**, terintegrasi dengan **Duitku Payment Gateway** dan **RajaOngkir API**. Dokumen ini berisi rincian infrastruktur server AWS EC2, struktur direktori project, fitur aplikasi, serta alur deployment.

---

## 📌 Informasi Repository & Server

- **Repository GitHub**: [https://github.com/dimask016/project_uas_eligible](https://github.com/dimask016/project_uas_eligible)
- **Akses Web Public & Admin**: `http://ec2-32-236-168-110.ap-southeast-2.compute.amazonaws.com:8000`
- **Database Server**: `ec2-13-210-247-47.ap-southeast-2.compute.amazonaws.com`

---

## 🛠️ Manajemen Environment & Deployment AWS EC2

Penggunaan AWS EC2 mengubah beberapa tahapan infrastruktur dan pengelolaan server:

### 1. Provisioning Instans EC2
- Membuat instans EC2 baru (misal: Amazon Linux 2023 / Ubuntu) melalui AWS Management Console / CLI.
- Mengonfigurasi **Security Group (Firewall EC2)** untuk membuka port akses:
  - **Port 22 (SSH)**: Terbatas hanya untuk IP pengembang.
  - **Port 8000 (HTTP) & 443 (HTTPS)**: Terbuka untuk umum (`0.0.0.0/0`).
  - **Port 5177 & 3306**: Akses port internal/database.
- Menyiapkan Kunci Privat SSH (`.pem` / `.ppk`) untuk akses masuk ke server EC2.

---

### 2. Koneksi & Instalasi Runtime

Masuk ke instans EC2 via SSH:
```bash
ssh -i "your-key.pem" ec2-user@ec2-32-236-168-110.ap-southeast-2.compute.amazonaws.com