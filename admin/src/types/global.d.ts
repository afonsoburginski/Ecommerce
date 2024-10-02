// global.d.ts

export {}; // Necessário para tratar o arquivo como um módulo

declare global {
  export interface FormattedOrder {
    id: number;
    amount: number;
    status: string;
    email: string;
    customer: string;
    date: string;
    transactionId: string;
    paymentMethod?: string; // Opcional
  }

  type Payment = {
    id: string;
    amount: number;
    status: string;
    email: string;
    customer: string;
    date: string;
  };

  interface ProductDetails {
    id: number;
    name: string;
    price: number; // Alterando para number
    stock: number; // Alterando para number
    description: string;
    categoryId: number;
    tagId: number;
  }  

  interface Product {
    [x: string]: any;
    id: number;
    name: string;
    status: string;
    price: number;
    stock: number;
    sku: string;
    description: string;
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    variants: Variant[];
    images: any; // Ajuste conforme necessário
    createdAt: string;
  }

  interface Category {
    id: number;
    name: string;
  }

  interface Tag {
    id: number;
    name: string;
  }

  interface Variant {
    sku: string;
    stock: number;
    size: string;
    color: string;
  }

  interface UseProductDataResult {
    product: Product | null;
    products: Product[];
    topSellingProducts: Product[]; // Adicionando topSellingProducts
    categories: Category[];
    tags: Tag[];
    isLoading: boolean;
    error: Error | null;
    mutateProducts: () => void;
    mutateCategories: () => void;
    mutateTags: () => void;
    mutateTopSellingProducts: () => void; // Adicionando mutateTopSellingProducts
  }

  interface ProductContextType {
    products: Product[];
    categories: Category[];
    tags: Tag[];
    isLoading: boolean;
    isError: boolean;
    mutateProducts: () => void; // Adicionando mutateProducts
    mutateCategories: () => void; // Adicionando mutateCategories
    mutateTags: () => void; // Adicionando mutateTags
    mutateTopSellingProducts: () => void; // Adicionando mutateTopSellingProducts
  }
}
