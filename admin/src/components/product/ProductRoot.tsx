// components/product/ProductRoot.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetFooter, 
  SheetTitle 
} from "@/components/ui/sheet";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import Image from "next/image";
import { useProductForm } from "@/hooks/useProductForm";

export default function ProductRoot({ product, onClose, isOpen }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    details,
    setDetails,
    mainImage,
    setMainImage,
    thumbImages,
    setThumbImages,
    handleImageSelect,
    handleDetailsChange,
    handleSave,
    variants,
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
    resetForm, // Desestruturado resetForm
    categories, // Recebe categorias do hook
    tags,       // Recebe tags do hook
  } = useProductForm();

  const sheetAdditionalClass = isPreviewOpen ? "max-w-6xl" : "max-w-4xl";

  useEffect(() => {
    if (product) {
      setDetails({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        tagId: product.tagId,
        // Removido: categories e tags não fazem mais parte de ProductDetails
        stock: product.stock,
      });

      if (product.images && product.images.length > 0) {
        setMainImage(product.images[0]);
      }

      if (product.images && product.images.length > 1) {
        const thumbnails = product.images.slice(1);
        setThumbImages(thumbnails);
      }
    } else {
      resetForm(); // Usar resetForm em vez de setDetails(initialProductDetails())
    }
  }, [product, setDetails, setMainImage, setThumbImages, resetForm]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        additionalClass={sheetAdditionalClass}
        className="flex flex-col h-full"
      >
        <SheetHeader>
          <div className="flex flex-row items-center justify-between">
            <SheetTitle>{product ? "Editar Produto" : "Adicionar Produto"}</SheetTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            >
              {isPreviewOpen ? "Fechar Visualização" : "Visualização"}
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-row flex-1 mt-4">
          <div 
            className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${isPreviewOpen ? "w-2/3 border-r border-gray-300 pr-4" : "w-full pr-4"}`}
          >
            <div className="flex-1 overflow-y-auto">
              <ProductForm
                details={details}
                handleDetailsChange={handleDetailsChange}
                handleImageSelect={handleImageSelect}
                categories={categories} // Passar categorias
                tags={tags}           // Passar tags
              />
              <ProductTable
                variants={variants}
                handleVariantChange={handleVariantChange}
                handleAddVariant={handleAddVariant}
                handleRemoveVariant={handleRemoveVariant}
              />
            </div>
            <SheetFooter className="mt-4">
              <Button variant="default" size="sm" onClick={handleSave}>
                {product ? "Salvar Alterações" : "Salvar Produto"}
              </Button>
            </SheetFooter>
          </div>

          {isPreviewOpen && (
            <div className="w-1/3 h-full bg-gray-50 transition-all duration-500 ease-in-out overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Visualização do Produto</h2>

                {mainImage ? (
                  <div className="mb-4">
                    <Image
                      src={typeof mainImage === "string" ? mainImage : URL.createObjectURL(mainImage)}
                      alt="Imagem Principal do Produto"
                      width={500}
                      height={500}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-56 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <span className="text-gray-500">Imagem Principal Não Selecionada</span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {details.name || "Nome do Produto Não Definido"}
                </h3>

                <p className="text-lg font-semibold text-green-600 mb-4">
                  {details.price ? `R$ ${details.price}` : "Preço Não Definido"}
                </p>

                <p className="text-gray-700 mb-4">
                  {details.description || "Descrição Não Definida"}
                </p>

                {Array.isArray(thumbImages) && thumbImages.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {thumbImages.map((thumbUrl, index) => (
                      thumbUrl && (
                        <Image
                          key={index}
                          src={typeof thumbUrl === "string" ? thumbUrl : URL.createObjectURL(thumbUrl)}
                          alt={`Miniatura ${index + 1}`}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      )
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-gray-700 font-semibold">Categoria: </span>
                  <span className="text-gray-900">
                    {details.categoryId
                      ? categories.find((cat) => cat.id === details.categoryId)?.name
                      : "Nenhuma Categoria Selecionada"}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-gray-700 font-semibold">Tags: </span>
                  <span className="text-gray-900">
                    {details.tagId
                      ? tags.find((tag) => tag.id === details.tagId)?.name
                      : "Nenhuma Tag Selecionada"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
