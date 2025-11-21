/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BannerModule } from './banners/banners.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:21062004@cluster0.22cvu.mongodb.net/?appName=Cluster0/test123456',
    ),
    CategoryModule,
    ProductModule,
    BannerModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
  {
    provide: APP_GUARD,
    useClass: GlobalAuthGuard,
  },
  {
      provide: APP_GUARD,
      useClass: RolesGuard,
  },
],
})
export class AppModule {}
