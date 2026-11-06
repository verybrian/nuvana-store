import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(category?: string): Promise<Product[]> {
    return this.repo.find({
      where: category ? { category } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { slug } });
    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }
}