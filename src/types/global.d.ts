export {};

declare global {
  type Payment = {
    id: string;
    amount: number;
    status: string;
    email: string;
    customer: string;
    date: string;
  };

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
  }
}
