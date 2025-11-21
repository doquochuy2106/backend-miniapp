import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseMessage } from 'src/auth/decorators/response-message.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách user thành công')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.service.findAll(+page, +limit, keyword);
  }

  @Get(':id')
  @ResponseMessage('Lấy danh sách user thành công')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Bulk insert
  @Roles('admin')
  @Post('bulk')
  bulkCreate(@Body() dtos: CreateProductDto[]) {
    return this.service.bulkCreate(dtos);
  }
}
