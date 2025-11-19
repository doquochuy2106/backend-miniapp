/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:21062004@cluster0.22cvu.mongodb.net/?appName=Cluster0/test123456',
    ),
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
