import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Copy, CreditCard, Truck } from "lucide-react";

interface OrderDetailsSheetProps {
  order: {
    id: number;
    customer: string;
    email: string;
    phone: string;
    address: string;
    total?: number;
    transaction: {
      status: string;
    };
    paymentDetails?: {
      brand: string;
      last4: string;
    };
    createdAt: string;
    orderItems?: Array<{
      id: number;
      quantity: number;
      price: number;
      product: {
        name: string;
      };
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  order,
  isOpen,
  onClose,
}) => {

  // Calculando o subtotal
  const subtotal = order.orderItems?.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0) ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[60vh]">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>Details for order #{order.id}</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order #{order.id}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      navigator.clipboard.writeText(order.id.toString())
                    }
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Track Order
                  </span>
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <span className="sr-only">More</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {item.product.name} x <span>{item.quantity}</span>
                        </span>
                        <span>
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No items in order.</li>
                  )}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {subtotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>R$ 5,00</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      {(subtotal + 5).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>{order.customer || "N/A"}</span>
                    <span>{order.address || "N/A"}</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">
                    Paid with Credit Card
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>{order.customer || "N/A"}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href={`mailto:${order.email || ""}`}>
                        {order.email || "N/A"}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href={`tel:${order.phone || ""}`}>
                        {order.phone || "N/A"}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                {order.paymentDetails ? (
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {`Cartão de crédito ${order.paymentDetails.brand}`}
                      </dt>
                      <dd>{`•••• ${order.paymentDetails.last4}`}</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="text-muted-foreground">No payment details available.</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated{" "}
                <time dateTime={order.createdAt}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </time>
              </div>
              <div className="ml-auto">
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        <SheetFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
