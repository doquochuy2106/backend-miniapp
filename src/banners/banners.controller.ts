import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BannerService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ResponseMessage } from 'src/decorator/response-message.decorator';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @ResponseMessage('Lấy banner thành công')
  findAll() {
    return this.bannerService.findAll();
  }

  @Post()
  @ResponseMessage('Tạo banner thành công')
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Post('bulk')
  bulkCreate(@Body() dtos: CreateBannerDto[]) {
    return this.bannerService.bulkCreate(dtos);
  }

  @Get(':id')
  @ResponseMessage('Lấy banner theo Id thành công')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Put(':id')
  @ResponseMessage('Sửa banner thành công')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa banner thành công')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
