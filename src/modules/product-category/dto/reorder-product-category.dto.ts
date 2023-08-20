import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

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
  @ValidateNested({ each: true })
  @Type(() => ReorderProductCategoryItem)
  @IsNotEmpty()
  items: ReorderProductCategoryItem[];
}
