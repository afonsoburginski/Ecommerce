// hooks/useProductForm.ts
import { useState, useEffect, useCallback } from "react";
import { useProductData } from "./useProductData";
import { useToast } from "@/components/ui/use-toast";

// Definição de tipos para o produto, categorias e tags
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
  stock: string;
  categoryId: number | null;
  tagId: number | null;
}

const initialProductDetails = (): ProductDetails => ({
  id: null,
  name: "",
  price: "",
  description: "",
  stock: "",
  categoryId: null,
  tagId: null,
});

const initialVariant = () => ({
  sku: "",
  stock: 0,
  size: "",
  color: "",
});

// Função para converter os campos de preço, estoque, categoria e tag para número
const shouldConvertToNumber = (field: string) => 
  field === "price" || field === "stock" || field === "categoryId" || field === "tagId";

// Função para parsear preço e estoque
const parsePriceAndStock = (price: any, stock: any) => {
  const parsedPrice = typeof price === "string"
    ? parseFloat(price.replace("R$", "").replace(",", ".").trim())
    : parseFloat(price);

  return {
    price: !isNaN(parsedPrice) ? parsedPrice : NaN,
    stock: !isNaN(stock) ? Number(stock) : NaN,
  };
};

// Função de validação para atualização
const validateFormForUpdate = (details: any) => {
  return details.id !== null;
};

// Função de validação completa do formulário
const validateForm = (
  details: ProductDetails, 
  price: number, 
  stock: number, 
  mainImage: File | null, 
  productStatus: string
) => {
  console.log('Validando o formulário...');
  if (!details.name.trim()) {
    console.error("Erro: O nome do produto é obrigatório.");
    return false;
  }

  if (isNaN(price) || price <= 0) {
    console.error("Erro: O preço do produto é inválido.");
    return false;
  }

  if (isNaN(stock) || stock < 0) {
    console.error("Erro: O estoque do produto é inválido.");
    return false;
  }

  if (!details.description.trim()) {
    console.error("Erro: A descrição do produto é obrigatória.");
    return false;
  }

  if (details.categoryId === null) {
    console.error("Erro: Selecione uma categoria válida.");
    return false;
  }

  if (details.tagId === null) {
    console.error("Erro: Selecione uma tag válida.");
    return false;
  }

  if (!mainImage) {
    console.error("Erro: A imagem principal é obrigatória.");
    return false;
  }

  console.log('Formulário validado com sucesso.');
  return true;
};

// Função para criar o FormData
const createFormData = (
  details: ProductDetails,
  price: number,
  stock: number,
  mainImage: File | null,
  thumbImages: (File | null)[],
  variants: any[]
) => {
  const formData = new FormData();

  if (details.id) {
    formData.append("id", String(details.id));
  }

  formData.append("name", details.name);
  formData.append("description", details.description);
  formData.append("price", String(price));
  formData.append("stock", String(stock));
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

// Hook principal que gerencia o formulário do produto
export const useProductForm = () => {
  const { toast } = useToast();
  const { categories, tags, isLoading, error } = useProductData();
  const [details, setDetails] = useState<ProductDetails>(initialProductDetails());
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbImages, setThumbImages] = useState<(File | null)[]>([null, null]);
  const [productStatus, setProductStatus] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  // Atualiza as categorias e tags quando os dados são carregados
  useEffect(() => {
    if (!isLoading && !error && categories && tags) {
      console.log('Categorias carregadas:', categories);
      console.log('Tags carregadas:', tags);

      setDetails((prevDetails) => ({
        ...prevDetails,
        // Removido: categories e tags não fazem mais parte de ProductDetails
      }));
    }
  }, [categories, tags, isLoading, error]);

  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    console.log('Resetando o formulário para valores iniciais.');
    setDetails(initialProductDetails());
    setMainImage(null);
    setThumbImages([null, null]);
    setProductStatus("");
    setVariants([]);
  }, []);

  // Função para selecionar imagem
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
  }, []);

  // Função para mudar os detalhes do produto
  const handleDetailsChange = useCallback((field: string, value: any) => {
    setDetails((prev) => ({
      ...prev,
      [field]: shouldConvertToNumber(field) ? (isNaN(Number(value)) ? null : Number(value)) : value,
    }));
  }, []);

  // Função para gerenciar as variantes
  const handleVariantChange = useCallback((index: number, field: string, value: any) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[index][field] = field === 'stock' ? Number(value) : value;
      return updatedVariants;
    });
  }, []);

  // Função para adicionar variante
  const handleAddVariant = useCallback(() => {
    setVariants((prev) => [...prev, initialVariant()]);
  }, []);

  // Função para remover variante
  const handleRemoveVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Função para salvar o produto
  const handleSave = async () => {
    const { price, stock } = parsePriceAndStock(details.price, details.stock);

    if (details.id && !validateFormForUpdate(details)) {
      toast({
        title: "Erro na validação",
        description: "Verifique os campos necessários para a atualização.",
        variant: "destructive",
      });
      return;
    }

    const formData = createFormData(details, price, stock, mainImage, thumbImages, variants);

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
    productStatus,
    variants,
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
