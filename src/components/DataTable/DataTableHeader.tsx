import React from "react";
import { flexRender, HeaderGroup, Header } from "@tanstack/react-table";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { FormattedOrder } from "./DataTableColumns";

interface DataTableHeaderProps {
  headerGroups: HeaderGroup<FormattedOrder>[];
}

export const DataTableHeader = ({ headerGroups }: DataTableHeaderProps) => {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: Header<FormattedOrder, unknown>) => (
            <TableHead key={header.id} className="text-left">
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};
