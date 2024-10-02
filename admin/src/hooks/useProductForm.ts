import { useState, useEffect, useCallback } from "react";
import { useProductData } from "./useProductData";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ProductDetails {
  id: number | null;
  name: string;
  price: string;
  description: string;
  categoryId: number | null;
  tagId: number | null;
}

interface Variant {
  sku: string;
  stock: number;
  size: string;
  color: string;
}

const initialProductDetails = (): ProductDetails => ({
  id: null,
  name: "",
  price: "",
  description: "",
  categoryId: null,
  tagId: null,
});

const initialVariant = (): Variant => ({
  sku: "",
  stock: 0,
  size: "",
  color: "",
});

const shouldConvertToNumber = (field: string) =>
  field === "price" || field === "categoryId" || field === "tagId";

const parsePrice = (price: any) => {
  const parsedPrice = typeof price === "string" && price.trim() !== ""
    ? parseFloat(price.replace(/[^\d,.]/g, "").replace(",", ".").trim())
    : typeof price === "number"
    ? price
    : NaN;

  return {
    price: !isNaN(parsedPrice) ? parsedPrice : NaN,
  };
};

const validateForm = (
  details: ProductDetails,
  price: number,
  variants: Variant[],
  mainImage: File | null
) => {
  console.log("Validando o formulário...", details);
  console.log("Preço:", price);
  console.log("Imagem Principal:", mainImage);
  console.log("Variantes:", variants);

  if (!details.name.trim()) {
    console.error("Erro: O nome do produto é obrigatório.");
    return false;
  }

  if (isNaN(price) || price <= 0) {
    console.error("Erro: O preço do produto é inválido.");
    return false;
  }

  if (!details.description.trim()) {
    console.error("Erro: A descrição do produto é obrigatória.");
    return false;
  }

  if (details.categoryId === null || isNaN(Number(details.categoryId))) {
    console.error("Erro: Selecione uma categoria válida.");
    return false;
  }

  if (details.tagId === null || isNaN(Number(details.tagId))) {
    console.error("Erro: Selecione uma tag válida.");
    return false;
  }

  if (!mainImage) {
    console.error("Erro: A imagem principal é obrigatória.");
    return false;
  }

  if (!variants.length) {
    console.error("Erro: Pelo menos uma variante deve ser adicionada.");
    return false;
  }

  for (const variant of variants) {
    if (variant.stock === undefined || variant.stock === null || isNaN(variant.stock)) {
      console.error("Erro: Stock inválido ou ausente para uma das variantes.");
      return false;
    }
  }  

  console.log("Formulário validado com sucesso.");
  return true;
};

const createFormData = (
  details: ProductDetails,
  price: number,
  mainImage: File | null,
  thumbImages: (File | null)[],
  variants: Variant[]
) => {
  console.log("Criando FormData com os seguintes dados:");
  console.log("Detalhes do Produto:", details);
  console.log("Preço:", price);
  console.log("Imagem Principal:", mainImage);
  console.log("Imagens em miniatura:", thumbImages);
  console.log("Variantes:", variants);

  const formData = new FormData();

  if (details.id) {
    formData.append("id", String(details.id));
  }

  formData.append("name", details.name);
  formData.append("description", details.description);
  formData.append("price", String(price));
  formData.append("categories", JSON.stringify([details.categoryId]));
  formData.append("tags", JSON.stringify([details.tagId]));
  formData.append("variants", JSON.stringify(variants));

  if (mainImage) {
    formData.append("image", mainImage);
  }

  thumbImages.forEach((file, index) => {
    if (file) formData.append(`thumb_${index}`, file);
  });

  return formData;
};

export const useProductForm = () => {
  const { toast } = useToast();
  const { categories, tags, isLoading, error } = useProductData();
  const [details, setDetails] = useState<ProductDetails>(initialProductDetails());
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbImages, setThumbImages] = useState<(File | null)[]>([null, null]);
  const [variants, setVariants] = useState<Variant[]>([]); // Tipagem de variants ajustada
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !error && categories && tags) {
      console.log("Categorias carregadas:", categories);
      console.log("Tags carregadas:", tags);

      setDetails((prevDetails) => ({
        ...prevDetails,
      }));
    }
  }, [categories, tags, isLoading, error]);

  const resetForm = useCallback(() => {
    console.log("Resetando o formulário para valores iniciais.");
    setDetails(initialProductDetails());
    setMainImage(null);
    setThumbImages([null, null]);
    setVariants([]);
  }, []);

  const handleImageSelect = useCallback((file: File, index: number | "main") => {
    if (index === "main") {
      setMainImage(file);
    } else {
      setThumbImages((prevThumbs) => {
        const updatedThumbs = [...prevThumbs];
        updatedThumbs[index] = file;
        return updatedThumbs;
      });
    }
    console.log(`Imagem ${index === "main" ? "principal" : `miniatura ${index}`}:`, file);
  }, []);

  const handleDetailsChange = useCallback((field: string, value: any) => {
    console.log(`Atualizando o campo ${field} com o valor:`, value);
    setDetails((prev) => ({
      ...prev,
      [field]: shouldConvertToNumber(field) ? (isNaN(Number(value)) ? null : Number(value)) : value,
    }));
  }, []);
  

  const handleVariantChange = useCallback(
    (index: number, field: keyof Variant, value: any) => {
      setVariants((prev) => {
        const updatedVariants: Variant[] = [...prev];
        updatedVariants[index] = {
          ...updatedVariants[index],
          [field]: field === "stock" ? Number(value) : value,
        };
        return updatedVariants;
      });
    },
    []
  );   

  const handleAddVariant = useCallback(() => {
    setVariants((prev) => [...prev, initialVariant()]);
    console.log("Adicionada nova variante.");
  }, []);  

  const handleRemoveVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
    console.log(`Variante ${index} removida.`);
  }, []);

  const handleSave = async () => {
    const { price } = parsePrice(details.price);

    if (!validateForm(details, price, variants, mainImage)) {
      toast({
        title: "Erro na validação",
        description: "Verifique os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const formData = createFormData(details, price, mainImage, thumbImages, variants);

    try {
      const response = await fetch("/api/products", {
        method: details.id ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao salvar o produto.");
      }

      toast({
        title: "Produto salvo com sucesso",
        description: "Seu produto foi salvo no sistema.",
        variant: "success",
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    details,
    setDetails,
    mainImage,
    setMainImage,
    thumbImages,
    setThumbImages,
    variants,
    setVariants,
    handleImageSelect,
    handleDetailsChange,
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
    handleSave,
    resetForm,
    categories,
    tags,
  };
};
