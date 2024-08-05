"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados de exemplo simulando uma lista de clientes
const customers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    registeredAt: "2023-07-12",
    status: "online",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    registeredAt: "2023-10-18",
    status: "offline",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    registeredAt: "2023-11-29",
    status: "online",
  },
  {
    name: "Bob Brown",
    email: "bob.brown@example.com",
    registeredAt: "2023-12-25",
    status: "offline",
  },
  {
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    registeredAt: "2024-01-01",
    status: "online",
  },
  {
    name: "Diana Evans",
    email: "diana.evans@example.com",
    registeredAt: "2024-02-14",
    status: "offline",
  },
];

const CustomerTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          Manage your customers and view their account status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.registeredAt}</TableCell>
                <TableCell>
                  <Badge
                    variant={customer.status === "online" ? "success" : "destructive"}
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> customers
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerTable;
