import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class ReorderProductCategoryItem {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  order: number;
}

export class ReorderProductCategoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @Type(() => ReorderProductCategoryItem)
  items: ReorderProductCategoryItem[];
}
