import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('numeric', { precision: 10, scale: 2, transformer: {
    to: (v: number) => v,
    from: (v: string) => Number(v),
  }})
  price: number;

  @Column({ default: 'KES' })
  currency: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column()
  category: string;

  @Column('jsonb', { default: {} })
  specs: Record<string, string>;

  @Column({ name: 'in_stock', default: true })
  inStock: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}