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
import { ResponseMessage } from 'src/auth/decorators/response-message.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Public()
  @Get()
  @ResponseMessage('Lấy banner thành công')
  findAll() {
    return this.bannerService.findAll();
  }

  @Roles('admin')
  @Post()
  @ResponseMessage('Tạo banner thành công')
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Roles('admin')
  @Post('bulk')
  bulkCreate(@Body() dtos: CreateBannerDto[]) {
    return this.bannerService.bulkCreate(dtos);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy banner theo Id thành công')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Roles('admin')
  @Put(':id')
  @ResponseMessage('Sửa banner thành công')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ResponseMessage('Xóa banner thành công')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
