// src/components/Product.tsx
import ProductRoot from './ProductRoot';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import ProductRelated from './ProductRelated';
import { ProductStateProvider } from '@/contexts/ProductStateContext';

export default function Product({ product, relatedProducts }) {
  return (
    <ProductStateProvider product={product}>
      <ProductRoot>
        <ProductImage product={product} />
        <ProductInfo product={product} />
        <ProductReviews product={product} />
        <ProductRelated relatedProducts={relatedProducts} />
      </ProductRoot>
    </ProductStateProvider>
  );
}
