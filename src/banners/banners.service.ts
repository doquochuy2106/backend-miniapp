import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Banner, BannerDocument } from './schema/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  private validateObjectId(id: string) {
    if (
      !Types.ObjectId.isValid(id) ||
      new Types.ObjectId(id).toString() !== id
    ) {
      throw new BadRequestException('Invalid banner ID');
    }
  }

  async findAll() {
    return this.bannerModel.find().sort({ order: 1 }).exec();
  }

  async create(dto: CreateBannerDto) {
    const banner = new this.bannerModel(dto);
    return banner.save();
  }

  async bulkCreate(dtos: CreateBannerDto[]) {
    return this.bannerModel.insertMany(dtos);
  }

  async findOne(id: string) {
    this.validateObjectId(id);

    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new NotFoundException('Banner not found');

    return banner;
  }

  async update(id: string, dto: UpdateBannerDto) {
    this.validateObjectId(id);

    const banner = await this.bannerModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!banner) throw new NotFoundException('Banner not found');

    return banner;
  }

  async remove(id: string) {
    this.validateObjectId(id);

    const banner = await this.bannerModel.findByIdAndDelete(id);

    if (!banner) throw new NotFoundException('Banner not found');

    return { message: 'Deleted successfully' };
  }
}
