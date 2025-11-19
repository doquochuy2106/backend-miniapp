import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/zaui-market'),
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
