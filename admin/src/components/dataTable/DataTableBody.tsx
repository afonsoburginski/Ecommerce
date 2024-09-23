import React from "react";
import { flexRender, Row, Cell } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FormattedOrder } from "./DataTableColumns";

interface DataTableBodyProps {
  rows: Row<FormattedOrder>[];
  columns: any[];
}

export const DataTableBody = ({ rows, columns }: DataTableBodyProps) => {
  return (
    <TableBody>
      {rows?.length ? (
        rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell: Cell<FormattedOrder, unknown>) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Ainda não há transações.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
