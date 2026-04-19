"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
function buildAllowedOrigins() {
    const fallbackOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://frontend:3000",
    ].join(",");
    return (process.env.CORS_ALLOWED_ORIGINS || fallbackOrigins)
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = buildAllowedOrigins();
    app.enableCors({
        origin(origin, callback) {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(null, false);
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.enableShutdownHooks();
    const port = Number(process.env.PORT ?? 8080);
    await app.listen(port, "0.0.0.0");
    console.log(`API Gateway running on port ${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map