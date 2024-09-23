import { useState, useEffect, useCallback } from "react";
import { useProductData } from "./useProductData";
import { useToast } from "@/components/ui/use-toast";

export const useProductForm = () => {
  const { toast } = useToast(); 
  const { categories, tags, isLoading, error } = useProductData();
  const [details, setDetails] = useState(initialProductDetails());
  const [mainImage, setMainImage] = useState(null);
  const [thumbImages, setThumbImages] = useState([null, null]);
  const [productStatus, setProductStatus] = useState("");
  const [variants, setVariants] = useState([]);
  const [isError, setIsError] = useState(false);

  // Memorize o valor inicial de detalhes com useMemo
  useEffect(() => {
    if (!isLoading && !error) {
      setDetails((prevDetails) => ({
        ...prevDetails,
        categories: categories || [],
        tags: tags || [],
      }));
    }
  }, [categories, tags, isLoading, error]);

  // Função para limpar o formulário - memorizada com useCallback
  const resetForm = useCallback(() => {
    setDetails(initialProductDetails());
    setMainImage(null);
    setThumbImages([null, null]);
    setProductStatus("");
    setVariants([]);
  }, []);

  const handleImageSelect = useCallback((file, index) => {
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

  const handleDetailsChange = useCallback((field, value) => {
    setDetails((prev) => ({
      ...prev,
      [field]: shouldConvertToNumber(field) ? (isNaN(Number(value)) ? "" : value) : value,
    }));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[index][field] = value;
      return updatedVariants;
    });
  }, []);

  const handleAddVariant = useCallback(() => {
    setVariants((prev) => [...prev, initialVariant()]);
  }, []);

  const handleRemoveVariant = useCallback((index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = async () => {
    const { price, stock } = parsePriceAndStock(details.price, details.stock);

    if (!validateForm(details, price, stock, mainImage, productStatus)) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios corretamente.",
        variant: "destructive",
      });
      return;
    }

    const formData = createFormData(details, price, stock, mainImage, thumbImages, variants, productStatus);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar o produto.");
      }

      toast({
        title: "Produto salvo com sucesso",
        description: "Seu produto foi salvo no sistema.",
        variant: "success",
      });

      resetForm(); // Limpa o formulário após salvar com sucesso

    } catch (error) {
      console.error(`Erro ao salvar o produto: ${error.message}`);
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    details,
    mainImage,
    thumbImages,
    productStatus,
    variants,
    isError,
    handleImageSelect,
    handleDetailsChange,
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
    setProductStatus,
    handleSave,
  };
};

// Funções auxiliares
const initialProductDetails = () => ({
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

const shouldConvertToNumber = (field) => field === "price" || field === "stock";

const parsePriceAndStock = (price, stock) => {
  const parsedPrice = typeof price === "string"
    ? parseFloat(price.replace("R$", "").replace(",", ".").trim())
    : parseFloat(price);

  return {
    price: !isNaN(parsedPrice) ? parsedPrice : NaN,
    stock: !isNaN(stock) ? Number(stock) : NaN,
  };
};

const validateForm = (details, price, stock, mainImage, productStatus) => {
  if (!details.name || isNaN(price) || isNaN(stock)) {
    console.error("Erro: Preencha todos os campos obrigatórios e verifique o preço e estoque.");
    return false;
  }

  if (!details.description) {
    console.error("Erro: A descrição do produto é obrigatória.");
    return false;
  }

  if (!details.categoryId) {
    console.error("Erro: Selecione uma categoria.");
    return false;
  }

  if (!details.tagId) {
    console.error("Erro: Selecione uma tag.");
    return false;
  }

  if (!productStatus) {
    console.error("Erro: Selecione o status do produto.");
    return false;
  }

  if (!mainImage) {
    console.error("Erro: Selecione a imagem principal do produto.");
    return false;
  }

  return true;
};

const createFormData = (details, price, stock, mainImage, thumbImages, variants, productStatus) => {
  const formData = new FormData();
  formData.append("name", details.name);
  formData.append("description", details.description);
  formData.append("price", String(price));
  formData.append("stock", String(stock));
  formData.append("status", productStatus);
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
