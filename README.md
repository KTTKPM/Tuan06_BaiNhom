# Thông tin nhóm

Trương Công Hải - 22692311
Đặng Trần Tấn Phát - 22649051
Huỳnh Ánh Hưng - 22645171
Lê Huỳnh Công Tiếp - 22692271
Lê Minh Tuấn - 22697621

# Docker Compose Run Guide

Tai lieu nay huong dan chay toan bo he thong bang Docker Compose trong thu muc goc du an.

## 1. Yeu cau truoc khi chay

- Da cai Docker Desktop va Docker dang running
- Docker Compose v2 (lenh docker compose)
- Cac port sau chua bi chiem: 3000, 8081, 8082, 8083, 8084

Kiem tra nhanh:

```powershell
docker --version
docker compose version
```

## 2. Chay toan bo he thong

Tu thu muc goc du an:

```powershell
docker compose up -d --build
```

Lan dau build co the mat vai phut.

## 3. Kiem tra trang thai va log

```powershell
docker compose ps
docker compose logs -f --tail=200
```

Xem log theo tung service:

```powershell
docker compose logs -f user-service
docker compose logs -f food-service
docker compose logs -f cart-service
docker compose logs -f payment-service
docker compose logs -f frontend
```

## 4. URL truy cap sau khi chay

- Frontend: http://localhost:3000
- User service: http://localhost:8081/api/users
- Food service: http://localhost:8082/api/foods
- Cart service: http://localhost:8083/order
- Payment service health: http://localhost:8084/
- Payment API:
  - POST http://localhost:8084/api/payments
  - GET http://localhost:8084/api/history

## 5. Seed data mac dinh

User service se tu dong tao bang users neu chua co, va seed 2 tai khoan khi bang rong:

- username: user, password: user, role: USER
- username: admin, password: admin, role: ADMIN

Food service se seed danh sach mon an khi bang foods rong.

## 6. Volume luu du lieu ben ngoai container

Compose dang dung named volumes de luu data MariaDB cua tung service:

- cart_service_db_data
- user_service_db_data
- food_service_db_data
- payment_service_db_data

Kiem tra volume:

```powershell
docker volume ls
```

Luu y: ten volume thuc te co the duoc Docker them prefix theo ten project (vi du: tuan06_bainhom_user_service_db_data).

## 7. Lenh thuong dung

Restart toan bo:

```powershell
docker compose restart
```

Rebuild va restart 1 service:

```powershell
docker compose up -d --build user-service
```

Mo shell trong container:

```powershell
docker compose exec user-service bash
```

Neu exec bi loi, thu kiem tra service con running khong:

```powershell
docker compose ps
docker compose logs --tail=200 user-service
```

## 8. Dung va xoa he thong

Dung container, giu du lieu volume:

```powershell
docker compose down
```

Dung container va xoa luon volume du lieu:

```powershell
docker compose down -v
```
