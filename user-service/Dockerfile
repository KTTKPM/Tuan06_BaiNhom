FROM node:20.19.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=8081 \
    JWT_SECRET=local_dev_secret \
  JWT_ACCESS_EXPIRES_IN=15m \
  JWT_REFRESH_SECRET=local_dev_refresh_secret \
  JWT_REFRESH_EXPIRES_IN=7d \
  JWT_REFRESH_TTL_MS=604800000 \
  JWT_REFRESH_COOKIE_NAME=mfos_refresh_token \
  JWT_REFRESH_COOKIE_PATH=/api/users \
  JWT_REFRESH_COOKIE_SAMESITE=lax \
  JWT_REFRESH_COOKIE_SECURE=false \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_USER=user_app \
    DB_PASS=user_pass \
    DB_NAME=food_ordering_db

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mariadb-server mariadb-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql \
    && chown -R node:node /app

RUN cat <<'EOF' > /usr/local/bin/start-user-service.sh
#!/usr/bin/env bash
set -euo pipefail

if [ ! -d /var/lib/mysql/mysql ]; then
  mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null
fi

mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=127.0.0.1 --port=3306 --socket=/run/mysqld/mysqld.sock &

for i in {1..60}; do
  if mysqladmin --protocol=socket --user=root ping --silent; then
    break
  fi
  sleep 1
done

mysql --protocol=socket --user=root -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
mysql --protocol=socket --user=root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';"
mysql --protocol=socket --user=root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql --protocol=socket --user=root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'127.0.0.1';"
mysql --protocol=socket --user=root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql --protocol=socket --user=root -e "FLUSH PRIVILEGES;"
mysql -h 127.0.0.1 -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" -e "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'USER', refresh_token_hash VARCHAR(255) NULL, refresh_token_expires_at DATETIME NULL);"
mysql -h 127.0.0.1 -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" -e "ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token_hash VARCHAR(255) NULL;"
mysql -h 127.0.0.1 -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" -e "ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token_expires_at DATETIME NULL;"

exec su -s /bin/bash node -c "node src/app.js"
EOF

RUN sed -i 's/\r$//' /usr/local/bin/start-user-service.sh && chmod +x /usr/local/bin/start-user-service.sh

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "const net=require('net');const s=net.createConnection(8081,'127.0.0.1');s.on('connect',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));setTimeout(()=>process.exit(1),3000);"

CMD ["/usr/local/bin/start-user-service.sh"]
