import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export function ShopCart() {
  const { cart, cartItemCount, isNewProductAdded, resetNewProductFlag, checkStock, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isNewProductAdded) {
      setIsCartOpen(true);
      resetNewProductFlag();
    }
  }, [isNewProductAdded, resetNewProductFlag]);

  useEffect(() => {
    if (isCartOpen) {
      checkStock();
    }
  }, [isCartOpen, checkStock]);

  useEffect(() => {
    const outOfStock = cart.filter((item) => item.inStock === false);
    setOutOfStockItems(outOfStock);
  }, [cart]);

  const handleCheckout = async () => {
    if (outOfStockItems.length > 0) {
      alert('Há itens no seu carrinho que estão fora de estoque.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          userId: 2, // Substitua pelo ID real do usuário
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Falha ao iniciar o checkout', data);
      }
    } catch (error) {
      console.error('Erro durante o checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2 relative">
          <ShoppingCart className="h-4 w-4" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-600 text-white rounded-full">
              {cartItemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Meu carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full p-4">
          <div className="flex-1 overflow-auto">
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-start mb-4">
                    <div className="w-16 h-16 relative mr-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold flex-1 truncate">
                          {item.name}
                        </h3>
                        <span className="text-sm font-semibold text-gray-800 ml-2">
                          R$ {item.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex space-x-2">
                          <span className="text-xs text-gray-600">{item.color}</span>
                          <span className="text-xs text-gray-600">{item.size}</span>
                        </div>
                        <span className="text-xs text-gray-600">Qtd: {item.quantity}</span>
                      </div>
                      {item.inStock === false && (
                        <p className="text-xs text-red-600">Produto fora de estoque</p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <Button
            variant="default"
            onClick={handleCheckout}
            className="w-full mt-4"
            disabled={isLoading || outOfStockItems.length > 0}
          >
            {isLoading ? 'Processando...' : 'Comprar'}
          </Button>
          {outOfStockItems.length > 0 && (
            <p className="text-red-600 text-xs mt-2">
              Alguns produtos estão fora de estoque e não podem ser comprados.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
