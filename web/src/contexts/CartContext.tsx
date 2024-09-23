import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStockStatus } from '@/lib/products'; // Função de verificação do estoque

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  sku: string;
  image: string;
  inStock?: boolean;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: number) => void;
  checkStock: () => Promise<void>;
  cartItemCount: number;
  isNewProductAdded: boolean;
  resetNewProductFlag: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isNewProductAdded, setIsNewProductAdded] = useState(false);

  const CART_STORAGE_KEY = 'user_cart';
  const EXPIRATION_DAYS = 7;

  const isCartExpired = (timestamp: number) => {
    const now = new Date().getTime();
    const expirationTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
    return now - timestamp > expirationTime;
  };

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const { items, timestamp } = parsedCart;
      if (!isCartExpired(timestamp)) {
        setCart(items);
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const cartData = {
        items: cart,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    }
  }, [cart]);

  const addToCart = async (item: CartItem) => {
    const inStock = await getStockStatus(item.productId);
    setCart((prevCart) => [...prevCart, { ...item, inStock }]);
    setIsNewProductAdded(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const checkStock = async () => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        const inStock = await getStockStatus(item.productId);
        return { ...item, inStock };
      })
    );
    setCart(updatedCart);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const resetNewProductFlag = () => setIsNewProductAdded(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        checkStock,
        cartItemCount,
        isNewProductAdded,
        resetNewProductFlag,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
