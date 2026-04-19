FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /build
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

COPY src/ src/
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:21-jre-jammy AS runtime

ENV SERVER_PORT=8082 \
		SPRING_DATASOURCE_URL=jdbc:mariadb://127.0.0.1:3306/food_service \
		SPRING_DATASOURCE_USERNAME=food_user \
		SPRING_DATASOURCE_PASSWORD=food_pass \
		SPRING_JPA_HIBERNATE_DDL_AUTO=update

RUN apt-get update \
		&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mariadb-server mariadb-client curl \
		&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /build/target/foodService-0.0.1-SNAPSHOT.jar /app/app.jar

RUN useradd --system --create-home --uid 1001 appuser \
		&& mkdir -p /run/mysqld /var/lib/mysql \
		&& chown -R mysql:mysql /run/mysqld /var/lib/mysql \
		&& chown -R appuser:appuser /app

RUN cat <<'EOF' > /usr/local/bin/start-food-service.sh
#!/usr/bin/env bash
set -euo pipefail

if [ ! -d /var/lib/mysql/mysql ]; then
	mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null
fi

mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=127.0.0.1 --port=3306 --socket=/run/mysqld/mysqld.sock &

for i in {1..60}; do
	if mysqladmin ping -h 127.0.0.1 --silent; then
		break
	fi
	sleep 1
done

mysql -h 127.0.0.1 -uroot -e "CREATE DATABASE IF NOT EXISTS food_service;"
mysql -h 127.0.0.1 -uroot -e "CREATE USER IF NOT EXISTS '${SPRING_DATASOURCE_USERNAME}'@'127.0.0.1' IDENTIFIED BY '${SPRING_DATASOURCE_PASSWORD}';"
mysql -h 127.0.0.1 -uroot -e "CREATE USER IF NOT EXISTS '${SPRING_DATASOURCE_USERNAME}'@'localhost' IDENTIFIED BY '${SPRING_DATASOURCE_PASSWORD}';"
mysql -h 127.0.0.1 -uroot -e "GRANT ALL PRIVILEGES ON food_service.* TO '${SPRING_DATASOURCE_USERNAME}'@'127.0.0.1';"
mysql -h 127.0.0.1 -uroot -e "GRANT ALL PRIVILEGES ON food_service.* TO '${SPRING_DATASOURCE_USERNAME}'@'localhost';"
mysql -h 127.0.0.1 -uroot -e "FLUSH PRIVILEGES;"

exec su -s /bin/bash appuser -c "java -jar /app/app.jar"
EOF

RUN chmod +x /usr/local/bin/start-food-service.sh

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
	CMD curl -fsS http://127.0.0.1:8082/api/foods || exit 1

CMD ["/usr/local/bin/start-food-service.sh"]

