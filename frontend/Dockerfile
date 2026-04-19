FROM node:20.19.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20.19.0-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_GATEWAY_URL=
ARG VITE_USER_SERVICE_URL=http://localhost:8081
ARG VITE_FOOD_SERVICE_URL=http://localhost:8082
ARG VITE_ORDER_SERVICE_URL=http://localhost:8083
ARG VITE_PAYMENT_SERVICE_URL=http://localhost:8084

ENV VITE_API_GATEWAY_URL=${VITE_API_GATEWAY_URL} \
		VITE_USER_SERVICE_URL=${VITE_USER_SERVICE_URL} \
		VITE_FOOD_SERVICE_URL=${VITE_FOOD_SERVICE_URL} \
		VITE_ORDER_SERVICE_URL=${VITE_ORDER_SERVICE_URL} \
		VITE_PAYMENT_SERVICE_URL=${VITE_PAYMENT_SERVICE_URL}

RUN npm run build && npm prune --omit=dev

FROM node:20.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
		PORT=3000

RUN useradd --system --create-home --uid 1001 appuser

WORKDIR /app
COPY --chown=appuser:appuser package*.json ./
COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appuser /app/build ./build

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
	CMD node -e "const http=require('http');const r=http.get('http://127.0.0.1:3000/',res=>process.exit(res.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(3000,()=>{r.destroy();process.exit(1);});"

CMD ["npm", "run", "start"]
