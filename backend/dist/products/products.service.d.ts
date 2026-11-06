import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
export declare class ProductsService {
    private readonly repo;
    constructor(repo: Repository<Product>);
    findAll(category?: string): Promise<Product[]>;
    findBySlug(slug: string): Promise<Product>;
}
