import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableActions } from "./DataTableActions";
import { Badge } from "@/components/ui/badge";

export interface FormattedOrder {
  id: number;
  amount: number;
  status: string;
  email: string;
  customer: string;
  date: string;
  transactionId: string;
  paymentMethod: string;
}

export const columns: ColumnDef<FormattedOrder>[] = [
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
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => <div>{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Quantia</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: VariantProps<typeof badgeVariants>["variant"] = "default";

      // Determinando a cor do badge com base no status
      switch (status.toLowerCase()) {
        case "paid":
          variant = "success";
          break;
        case "pending":
          variant = "warning";
          break;
        case "failed":
        case "canceled":
          variant = "destructive";
          break;
        default:
          variant = "default";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as string | undefined;
      const lastFourDigits = paymentMethod ? paymentMethod.slice(-4) : "N/A";
      return <div>{paymentMethod ? `**** ${lastFourDigits}` : "N/A"}</div>;
    },
  },  
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableActions payment={row.original} />,
  },
];
