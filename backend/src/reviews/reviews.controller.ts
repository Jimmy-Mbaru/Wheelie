import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ type: CreateReviewDto })
  create(@Body() dto: CreateReviewDto, @Req() req) {
    return this.reviewsService.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews (optional: filter by vehicle)' })
  @ApiQuery({ name: 'vehicleId', required: false, example: 'vehicle-id-123' })
  findAll(@Query('vehicleId') vehicleId?: string) {
    return this.reviewsService.findAll(vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review (only by the review owner)' })
  @ApiBody({ type: UpdateReviewDto })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto, @Req() req) {
    return this.reviewsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review (only by the review owner)' })
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewsService.remove(id, req.user.sub);
  }
}
