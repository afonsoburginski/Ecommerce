import { DataTableRoot } from "./DataTableRoot";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTableActions } from "./DataTableActions";
import { DataTablePagination } from "./DataTablePagination";
import { columns } from "./DataTableColumns";

const DataTable = {
  Root: DataTableRoot,
  Header: DataTableHeader,
  Body: DataTableBody,
  Actions: DataTableActions,
  Pagination: DataTablePagination,
  Columns: columns,
};

export default DataTable;
