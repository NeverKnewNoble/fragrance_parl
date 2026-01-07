import { SimpleProduct } from '@/types/simpleProduct';
import { FilterConfig } from '@/types/filter';

//!! Generic product filter function
//!! Filters products based on the provided filter configuration
export function filterProducts(
  products: SimpleProduct[],
  config: FilterConfig
): SimpleProduct[] {
  return products.filter((product) => {
    // Exact match filter (e.g., family)
    if (config.exactMatch) {
      const { value, field, allValue = 'all' } = config.exactMatch;
      if (value !== allValue) {
        const fieldValue = product[field];
        if (fieldValue !== value) {
          return false;
        }
      }
    }

    // Range filter (e.g., price)
    if (config.range) {
      const { min, max, field } = config.range;
      const fieldValue = product[field] as number;
      if (fieldValue < min || fieldValue > max) {
        return false;
      }
    }

    // Value match filter (e.g., size)
    if (config.valueMatch) {
      const { value, field, allValue = 'all', valueMap } = config.valueMatch;
      if (value !== allValue) {
        const expectedValue = valueMap ? valueMap[value] : Number(value);
        const fieldValue = product[field] as number;
        if (fieldValue !== expectedValue) {
          return false;
        }
      }
    }

    return true;
  });
}
