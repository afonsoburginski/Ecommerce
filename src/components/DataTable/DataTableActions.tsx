import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { OrderDetailsSheet } from "./OrderDetailsSheet";

export const DataTableActions = ({ payment }: { payment: any }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewDetails = () => {
    setIsSheetOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.transactionId)}>
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewDetails}>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isSheetOpen && (
        <OrderDetailsSheet
          order={payment}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </>
  );
};
