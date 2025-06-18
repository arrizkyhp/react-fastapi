import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { type VariantProps } from "class-variance-authority";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { MoreHorizontal } from "lucide-react"; // Import MoreHorizontal icon

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import dropdown components

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

interface RowAction<TData> {
    color?: ButtonVariant;
    icon?: React.ReactNode;
    onClick: (row: TData) => void;
    tooltip?: string;
    label: string; // Ensure label is always present for dropdown menu items
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowActions?: RowAction<TData>[];
    pagination?: Pagination;
}

interface Pagination {
    onPageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageSizeChange: (pageSize: number) => void;
    per_page?: string;
}

const DataTable = <TData, TValue>({
                                      columns,
                                      data,
                                      rowActions = [],
                                      pagination,
                                  }: DataTableProps<TData, TValue>) => {
    // Define the "No" column
    const noColumn: ColumnDef<TData, number> = {
        header: "No",
        cell: ({ row }) => {
            const pageSize = Number(pagination?.per_page || 10);
            const currentPage = pagination?.currentPage || 1;
            // Calculate the sequential number
            return (currentPage - 1) * pageSize + row.index + 1;
        },
        // Optional: Set a fixed width for the "No" column
        size: 30, // Reduced size
        maxSize: 30, // Reduced maxSize
        minSize: 30, // Added minSize for consistency
    };

    // Combine the "No" column with the provided columns
    const combinedColumns: ColumnDef<TData, any>[] = [noColumn, ...columns];

    const table = useReactTable({
        data,
        columns: combinedColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    const startIndex = pagination
        ? (pagination.currentPage - 1) * Number(pagination.per_page || 10) + 1
        : 0;
    const endIndex = pagination
        ? Math.min(startIndex + data.length - 1, pagination.totalItems)
        : 0;

    // Calculate the minimum height for the table body
    const minTableBodyHeight = `${
        Number(pagination?.per_page || 10) * 53
    }px`; // Assuming ~45px per row

    return (
        <div className="flex flex-col gap-2">
            <div>
                <Select
                    onValueChange={(value) => {
                        if (pagination && pagination.onPageSizeChange) {
                            pagination.onPageSizeChange(Number(value));
                        }
                    }}
                    defaultValue={pagination?.per_page || "10"}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select page size" />{" "}
                        {/* Changed placeholder */}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem> {/* Corrected value */}
                            <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
                                })}
                                {rowActions.length > 0 && (
                                    <TableHead className="text-center">Actions</TableHead>
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody style={{ minHeight: minTableBodyHeight }}>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                    {rowActions.length > 0 && (
                                        <TableCell className="text-center">
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {rowActions.map((action, index) => (
                                                        <DropdownMenuItem
                                                            key={index}
                                                            onClick={() => action.onClick(row.original)}
                                                            className={
                                                                action.color === "destructive"
                                                                    ? "text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                    : action.color === "secondary"
                                                                        ? "text-gray-600 focus:bg-gray-50 focus:text-gray-600"
                                                                        : ""
                                                            } // Apply color based on variant
                                                        >
                                                            {action.icon && (
                                                                <span className="mr-2 h-4 w-4">
                                  {action.icon}
                                </span>
                                                            )}
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} // Adjust colspan
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between w-full items-center">
                <div>
                    {pagination && pagination.totalItems > 0 ? (
                        <>
                            Showing {startIndex} to {endIndex} of {pagination.totalItems}{" "}
                            results.
                        </>
                    ) : (
                        <>No results.</>
                    )}
                </div>
                {pagination && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1}
                        >
                            Previous
                        </Button>
                        {/* You could add page number indicators here */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages}
                        >
                            Next
                        </Button>
                        {/* Add page size select if onPageSizeChange is provided */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
