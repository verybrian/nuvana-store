import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
    findAll(query: QueryProductsDto): Promise<import("./product.entity.js").Product[]>;
    findBySlug(slug: string): Promise<import("./product.entity.js").Product>;
}
