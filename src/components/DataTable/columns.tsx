// components/DataTable/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BadgeProps } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderDetailsSheet } from "./OrderDetailsSheet";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => {
      const customerName = row.original.user?.name;
      return <div>{customerName}</div>;
    },
  },
  {
    accessorKey: "user.email",
    id: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const customerEmail = row.original.user?.email;
      return <div className="lowercase">{customerEmail}</div>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(total);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "transactionStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.transactionStatus;
      console.log(`Transaction status for order ${row.original.id}: ${status}`);
      let variant: BadgeProps["variant"];
      let statusText: string;

      switch (status) {
        case "PAID":
          variant = "success";
          statusText = "Paid";
          break;
        case "PENDING":
        case "unpaid":
          variant = "warning";
          statusText = "Pending";
          break;
        case "SHIPPED":
          variant = "info";
          statusText = "Shipped";
          break;
        case "RECEIVED":
          variant = "success";
          statusText = "Received";
          break;
        case "FAILED":
        case "canceled":
          variant = "destructive";
          statusText = "Failed";
          break;
        case "error":
          variant = "destructive";
          statusText = "Error";
          break;
        default:
          variant = "default";
          statusText = "Unknown";
          break;
      }

      return (
        <Badge variant={variant} className="capitalize">
          {statusText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => (
      <ul>
        {row.original.orderItems.map(item => (
          <li key={item.id}>{item.product.name} - {item.quantity} x {item.price.toFixed(2)}</li>
        ))}
      </ul>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id.toString())}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <OrderDetailsSheet order={order} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
