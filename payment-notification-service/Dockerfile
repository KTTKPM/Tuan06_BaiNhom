FROM node:20.19.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=8084 \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_USER=payment_user \
    DB_PASS=payment_pass \
    DB_NAME=food_system \
    ORDER_SERVICE_URL=http://127.0.0.1:8083/order

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mariadb-server mariadb-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

RUN mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql \
    && chown -R node:node /app

RUN cat <<'EOF' > /usr/local/bin/start-payment-service.sh
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

mysql -h 127.0.0.1 -uroot -e "CREATE DATABASE IF NOT EXISTS \\`${DB_NAME}\\`;"
mysql -h 127.0.0.1 -uroot -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';"
mysql -h 127.0.0.1 -uroot -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -h 127.0.0.1 -uroot -e "GRANT ALL PRIVILEGES ON \\`${DB_NAME}\\`.* TO '${DB_USER}'@'127.0.0.1';"
mysql -h 127.0.0.1 -uroot -e "GRANT ALL PRIVILEGES ON \\`${DB_NAME}\\`.* TO '${DB_USER}'@'localhost';"
mysql -h 127.0.0.1 -uroot -e "FLUSH PRIVILEGES;"
mysql -h 127.0.0.1 -u"${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" -e "CREATE TABLE IF NOT EXISTS payments (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT NOT NULL, customer_name VARCHAR(255), payment_method VARCHAR(50), status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"

exec su -s /bin/bash node -c "node src/app.js"
EOF

RUN sed -i 's/\r$//' /usr/local/bin/start-payment-service.sh && chmod +x /usr/local/bin/start-payment-service.sh

EXPOSE 8084

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "const http=require('http');const r=http.get('http://127.0.0.1:8084/',res=>process.exit(res.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(3000,()=>{r.destroy();process.exit(1);});"

CMD ["/usr/local/bin/start-payment-service.sh"]
