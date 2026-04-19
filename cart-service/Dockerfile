FROM node:20.19.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
		PORT=8083 \
		DB_HOST=127.0.0.1 \
		DB_PORT=3306 \
		DB_USER=order_user \
		DB_PASS=order_pass \
		DB_NAME=order_db

RUN apt-get update \
		&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mariadb-server mariadb-client \
		&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /run/mysqld /var/lib/mysql \
		&& chown -R mysql:mysql /run/mysqld /var/lib/mysql \
		&& chown -R node:node /app

RUN cat <<'EOF' > /usr/local/bin/start-cart-service.sh
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

mysql --protocol=socket --user=root -e "CREATE DATABASE IF NOT EXISTS \\`${DB_NAME}\\`;"
mysql --protocol=socket --user=root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';"
mysql --protocol=socket --user=root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql --protocol=socket --user=root -e "GRANT ALL PRIVILEGES ON \\`${DB_NAME}\\`.* TO '${DB_USER}'@'127.0.0.1';"
mysql --protocol=socket --user=root -e "GRANT ALL PRIVILEGES ON \\`${DB_NAME}\\`.* TO '${DB_USER}'@'localhost';"
mysql --protocol=socket --user=root -e "FLUSH PRIVILEGES;"

exec su -s /bin/bash node -c "node server.js"
EOF

RUN sed -i 's/\r$//' /usr/local/bin/start-cart-service.sh && chmod +x /usr/local/bin/start-cart-service.sh

EXPOSE 8083

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
	CMD node -e "const http=require('http');const r=http.get('http://127.0.0.1:8083/health',res=>process.exit(res.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(3000,()=>{r.destroy();process.exit(1);});"

CMD ["/usr/local/bin/start-cart-service.sh"]
