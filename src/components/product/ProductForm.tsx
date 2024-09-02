import ProductForm from "@/components/product";

export default function ProductFormComponent({
  product,
  categories,
  tags,
  statuses,
  colors,
}: ProductFormProps) {
  return (
    <ProductForm
      product={product}
      categories={categories}
      tags={tags}
      statuses={statuses}
      colors={colors}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductForm.Details />
          <ProductForm.Stock />
          <ProductForm.Category />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductForm.Status />
          <ProductForm.Images />
        </div>
      </div>
    </ProductForm>
  );
}
