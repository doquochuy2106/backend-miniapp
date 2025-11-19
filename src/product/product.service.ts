import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Category, CategoryDocument } from '../category/schema/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel
        .find()
        .populate('categoryId', 'name image')
        .skip(skip)
        .limit(limit)
        .exec(),

      this.productModel.countDocuments().exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async bulkCreate(dtos: CreateProductDto[]) {
    const categoryIds = await this.categoryModel.find({}).select('_id').exec();

    const productsToInsert = dtos.map((dto) => ({
      ...dto,
      categoryId:
        categoryIds[Math.floor(Math.random() * categoryIds.length)]._id,
    }));
    return this.productModel.insertMany(productsToInsert);
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoryModel.findById(dto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const product = new this.productModel({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
    });

    return product.save();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId', 'name image');

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
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Product not found');
    return { message: 'Deleted successfully' };
  }
}
