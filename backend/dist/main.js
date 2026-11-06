"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_js_1 = require("./app.module.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    const origins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim());
    app.enableCors({ origin: origins });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log(`API listening on ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map