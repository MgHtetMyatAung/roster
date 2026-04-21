/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
  Suspense,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaginationUi } from "./pagination";
import { useColumnVisibilityStore } from "@/store/use-column-visibility-store";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Columns3Cog,
  ArrowUpDown,
  ChevronUpIcon,
  ChevronDownIcon,
  LoaderCircle,
} from "lucide-react";

type TableDataItem = Record<string, any>;

interface DataTableProps<TData extends TableDataItem> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  renderRowActions?: (row: TData) => ReactNode;
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  topRightComponent?: ReactNode;
  initialColumnVisibility?: VisibilityState;
  label: string;
  tableId: string;
  dataNotFoundComponent?: ReactNode;
}

function checkAlign(align: string, type: "th" | "td") {
  if (type === "th") {
    return {
      "justify-start": align === "left",
      "justify-end": align === "right",
      "justify-center": align === "center",
    };
  }
  return {
    "text-left": align === "left",
    "text-right": align === "right",
    "text-center": align === "center",
  };
}

function DataListTable<TData extends TableDataItem>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available.",
  enableSorting = true,
  enableGlobalFilter = false,
  enableColumnFilters = false,
  enableColumnVisibility = true,
  enablePagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 10,
  renderRowActions,
  onSortingChange,
  onGlobalFilterChange,
  onPaginationChange,
  topRightComponent,
  dataNotFoundComponent,
  initialColumnVisibility,
  label,
  tableId,
}: DataTableProps<TData>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSize = Number(searchParams.get("size")) || initialPageSize;

  const { tableColumnVisibility } = useColumnVisibilityStore();
  const initialVisibility =
    tableColumnVisibility[tableId] || initialColumnVisibility || {};
  const [columnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>(initialVisibility);

  // --- Memoize Columns & Data ---
  const memoizedColumns = useMemo(() => {
    return columns.concat(
      renderRowActions
        ? {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => renderRowActions(row.original),
            enableSorting: false,
            enableColumnFilter: false,
            enableHiding: false,
            meta: { style: { textAlign: "right" } },
          }
        : [],
    ) as ColumnDef<TData>[];
  }, [columns, renderRowActions]);

  const memoizedData = useMemo(() => data, [data]);

  // --- Stable Callbacks ---
  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting(updater);
      onSortingChange?.(
        updater instanceof Function ? updater(sorting) : updater,
      );
    },
    [sorting, onSortingChange],
  );

  const handleGlobalFilterChange = useCallback(
    (updater: string | ((old: string) => string)) => {
      setGlobalFilter(updater);
      onGlobalFilterChange?.(
        updater instanceof Function ? updater(globalFilter) : updater,
      );
    },
    [globalFilter, onGlobalFilterChange],
  );

  const handlePaginationChange = useCallback(
    (pagination: { pageIndex: number; pageSize: number }) => {
      const params = new URLSearchParams(location.search);
      params.set("page", (pagination.pageIndex + 1).toString());
      params.set("size", pagination.pageSize.toString());
      navigate(
        { pathname: location.pathname, search: `?${params.toString()}` },
        { replace: true },
      );
      onPaginationChange?.(pagination);
    },
    [location.pathname, location.search, navigate, onPaginationChange],
  );

  // --- React Table Instance ---
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: initialPage - 1,
        pageSize: initialSize,
      },
    },
    onSortingChange: enableSorting ? handleSortingChange : undefined,
    onGlobalFilterChange: enableGlobalFilter
      ? handleGlobalFilterChange
      : undefined,
    onColumnFiltersChange: enableColumnFilters ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setInternalColumnVisibility
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      enableGlobalFilter || enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    initialState: { pagination: { pageIndex: 0, pageSize: initialPageSize } },
  });

  // --- Memoize Derived Rows ---
  const rows = table.getRowModel().rows;

  const {
    getHeaderGroups,
    getState,
    getAllColumns,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
  } = table;
  const { pagination } = getState();

  // Sync column visibility from store
  useEffect(() => {
    const storedVisibility = tableColumnVisibility[tableId] || {};
    if (JSON.stringify(storedVisibility) !== JSON.stringify(columnVisibility)) {
      setInternalColumnVisibility(storedVisibility);
    }
  }, [tableColumnVisibility, tableId, columnVisibility]);

  return (
    <div className=" overflow-hidden">
      {(enableGlobalFilter || enableColumnFilters) && (
        <div className=" flex gap-5">
          {enableGlobalFilter && (
            <Input
              type="text"
              placeholder={`Search all ${label.toLowerCase()} ...`}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          )}
          <div className="flex gap-5">
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns3Cog />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                      <div key={col.id} className="flex items-center p-1">
                        <input
                          type="checkbox"
                          checked={col.getIsVisible()}
                          onChange={col.getToggleVisibilityHandler()}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm capitalize">
                          {typeof col.columnDef.header === "string"
                            ? col.columnDef.header
                            : col.id}
                        </label>
                      </div>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {topRightComponent}
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full">
          <thead className="">
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "px-6 py-3 text-xs font-medium  uppercase tracking-wider",
                      {
                        "cursor-pointer select-none":
                          header.column.getCanSort(),
                      },
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={header.column.columnDef.meta?.style}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          "flex items-center gap-1",
                          checkAlign(
                            header.column.columnDef.meta?.style?.textAlign ||
                              "left",
                            "th",
                          ),
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUpIcon className="h-4 w-4 " />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDownIcon className="h-4 w-4 " />
                            )}
                            {!header.column.getIsSorted() && (
                              <ArrowUpDown className="h-4 w-4 " />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={memoizedColumns.length}
                  className="py-8 text-center "
                >
                  <LoaderCircle size={30} className="animate-spin mx-auto " />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={memoizedColumns.length}
                  className="py-8 text-center "
                >
                  {dataNotFoundComponent || emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        "px-6 py-4 whitespace-nowrap text-sm",
                        cell.column.columnDef.meta?.style?.textAlign &&
                          checkAlign(
                            cell.column.columnDef.meta?.style?.textAlign ||
                              "left",
                            "td",
                          ),
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <PaginationUi
          currentPage={pagination.pageIndex + 1}
          totalPages={getPageCount()}
          pageSize={pagination.pageSize}
          totalItems={data?.length}
          pageSizeOptions={pageSizeOptions}
          getCanNextPage={getCanNextPage()}
          getCanPreviousPage={getCanPreviousPage()}
          getPageCount={getPageCount()}
          onPageChange={(page) => {
            setPageIndex(page);
            handlePaginationChange({
              pageIndex: page,
              pageSize: pagination.pageSize,
            });
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            handlePaginationChange({ pageIndex: 0, pageSize: size });
          }}
          nextPage={() => {
            nextPage();
            handlePaginationChange({
              pageIndex: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            });
          }}
          previousPage={() => {
            previousPage();
            handlePaginationChange({
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize,
            });
          }}
        />
      )}
    </div>
  );
}

function DataTable<TData extends TableDataItem>(props: DataTableProps<TData>) {
  return (
    <Suspense>
      <DataListTable {...props} />
    </Suspense>
  );
}

export default DataTable;
