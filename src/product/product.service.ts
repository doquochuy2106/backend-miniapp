import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './Schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) throw new NotFoundException('Product not found');

    return {
      message: 'Product deleted successfully',
      id,
    };
  }
}
