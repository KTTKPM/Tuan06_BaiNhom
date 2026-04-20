FROM node:20.19.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20.19.0-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=8080

RUN useradd --system --create-home --uid 1001 appuser

WORKDIR /app
COPY --chown=appuser:appuser package*.json ./
COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appuser /app/dist ./dist

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "const http=require('http');const r=http.get('http://127.0.0.1:8080/health',res=>process.exit(res.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(3000,()=>{r.destroy();process.exit(1);});"

CMD ["node", "dist/main.js"]
