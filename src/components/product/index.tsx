import ProductRoot from "./ProductRoot";
import ProductDetails from "./ProductDetails";
import ProductCategory from "./ProductCategory";
import ProductStatus from "./ProductStatus";
import ProductImages from "./ProductImages";
import ProductStock from "./ProductStock";

const ProductForm = Object.assign(ProductRoot, {
  Details: ProductDetails,
  Category: ProductCategory,
  Status: ProductStatus,
  Images: ProductImages,
  Stock: ProductStock,
});

export default ProductForm;
