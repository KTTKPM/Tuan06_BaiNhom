# Food Service - Bai Nhom

## 1. Muc tieu
Xay dung REST API quan ly mon an cho he thong Food Service, dap ung cac yeu cau:
- Kien truc ro rang, tach lop.
- Co mo hinh trien khai de demo/van hanh.
- Co kich ban test va test tu dong.
- Co muc tieu chi cham diem de doi chieu nhanh.

## 2. Kien truc he thong
Kien truc ap dung: Layered Architecture

- Controller Layer: tiep nhan HTTP request, validate input, tra JSON response.
- Service Layer: chua business logic, xu ly use-case CRUD/search.
- Repository Layer: truy cap du lieu voi Spring Data JPA.
- Entity + DTO Layer: tach model luu tru va model trao doi API.
- Exception Layer: xu ly loi tap trung (validation, not found, server error).

Luong xu ly:
Client -> FoodController -> FoodService -> FoodRepository -> MariaDB

## 3. Chuc nang da thuc hien
Base URL: `http://localhost:8080/api/foods`

- `POST /api/foods`: tao mon an.
- `GET /api/foods/{id}`: lay chi tiet mon an.
- `GET /api/foods`: lay danh sach tat ca.
- `GET /api/foods?keyword=...`: tim theo ten.
- `GET /api/foods?available=true|false`: loc theo trang thai con ban.
- `PUT /api/foods/{id}`: cap nhat mon an.
- `DELETE /api/foods/{id}`: xoa mon an.

Du lieu mon an:
- `id`: Long
- `name`: String
- `category`: String
- `price`: BigDecimal (> 0)
- `available`: Boolean
- `createdAt`: LocalDateTime

## 4. Mo hinh trien khai
Da bo sung 2 cach trien khai:

1. Chay local bang Maven
- Yeu cau Java 21, MariaDB.
- Cai dat bien moi truong theo mau trong `foodService/.env.example`.
- Chay:
```bash
cd foodService
./mvnw spring-boot:run
```

2. Chay bang Docker Compose
- Da co `foodService/Dockerfile` va `foodService/docker-compose.yml`.
- Build jar truoc:
```bash
cd foodService
./mvnw clean package
docker compose up --build
```

Mo hinh container:
- `mariadb` (database)
- `food-service` (spring boot api)

## 5. Kich ban test
Da bo sung cac test scenario quan trong:

1. Service unit test (`FoodServiceImplTest`)
- Tao mon an thanh cong.
- Lay theo id khong ton tai -> throw `ResourceNotFoundException`.
- Cap nhat mon an thanh cong.

2. Controller web test (`FoodControllerTest`)
- `POST /api/foods` tra `201 Created` va payload dung.
- `GET /api/foods/{id}` khi khong co du lieu tra `404 Not Found`.

3. Spring context test (`FoodServiceApplicationTests`)
- Kiem tra app context khoi dong thanh cong voi profile `test` (H2 in-memory).

Lenh chay test:
```bash
cd foodService
./mvnw test
```

## 6. Tieu chi cham diem (xem so qua)
De xep loai nhanh, co the dung khung sau:

- Kien truc (30%)
	- Tach lop ro rang, dung responsibility.
	- Co DTO + exception handler.
- Chuc nang API (30%)
	- CRUD day du.
	- Co tim kiem/loc.
	- Validate input dung.
- Test (25%)
	- Co unit test service.
	- Co web/controller test.
	- Test context chay on dinh.
- Trien khai va tai lieu (15%)
	- Co huong dan chay local.
	- Co mo hinh Docker Compose.
	- README ro rang, de doi chieu.

## 7. Cau truc thu muc chinh
```text
foodService/
	src/main/java/iuh/fit/foodService/
		controller/
		service/
		service/impl/
		repository/
		entity/
		dto/
		exception/
	src/test/java/iuh/fit/foodService/
		controller/
		service/
	src/test/resources/
	Dockerfile
	docker-compose.yml
```