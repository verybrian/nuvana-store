import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) throw new Error('DATABASE_URL is not set');
        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          synchronize: true,
          ssl: url.includes('render.com') ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ProductsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}