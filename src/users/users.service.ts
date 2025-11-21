import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: 'user',
    });
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel
      .findById(id)
      .select('-password -currentHashedRefreshToken')
      .exec();
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userModel
      .findByIdAndUpdate(userId, { currentHashedRefreshToken: hashed })
      .exec();
  }

  async removeRefreshToken(userId: string) {
    await this.userModel
      .findByIdAndUpdate(userId, { currentHashedRefreshToken: null })
      .exec();
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.currentHashedRefreshToken) return null;
    const match = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (match) return user;
    return null;
  }
}
