"use client";

import React, { useState, useMemo, ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Inbox 
} from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  condition?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T) => string | number;
  title?: string;
  description?: string;
  actions?: DataTableAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  defaultSortKey?: keyof T | string;
  defaultSortOrder?: "asc" | "desc";
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  showCard?: boolean;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  additionalFilters?: ReactNode;
  headerActions?: ReactNode;
}


export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  title,
  description,
  actions,
  searchable = false,
  searchPlaceholder = "Buscar registros...",
  searchKeys,
  pagination = false,
  itemsPerPage = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  defaultSortKey,
  defaultSortOrder = "asc",
  isLoading = false,
  emptyMessage = "No se encontraron registros",
  className = "",
  showCard = true,
  onRowClick,
  selectable = false,
  onSelectionChange,
  additionalFilters,
  headerActions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | string | null>(defaultSortKey || null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!searchable || !searchTerm) return data;

    const keysToSearch = searchKeys || Object.keys(data[0] || {});
    return data.filter((row) =>
      keysToSearch.some((key) => {
        const value = row[key as keyof T];
        return value != null && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchable, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sortKey);
      let aValue = column?.accessor ? column.accessor(a) : a[sortKey as keyof T];
      let bValue = column?.accessor ? column.accessor(b) : b[sortKey as keyof T];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? (aValue as string).localeCompare(bValue as string) 
          : (bValue as string).localeCompare(aValue as string);
      }

      return sortOrder === "asc" ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    });
  }, [filteredData, sortKey, sortOrder, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  const handleSort = (key: keyof T | string) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const toggleRowSelection = (rowKey: string | number) => {
    const newSelected = new Set(selectedRows);
    newSelected.has(rowKey) ? newSelected.delete(rowKey) : newSelected.add(rowKey);
    setSelectedRows(newSelected);
    onSelectionChange?.(data.filter((row) => newSelected.has(keyExtractor(row))));
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = new Set(paginatedData.map(keyExtractor));
      setSelectedRows(allKeys);
      onSelectionChange?.(paginatedData);
    }
  };

  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (column.accessor) return column.accessor(row);
    const value = row[column.key as keyof T];
    return column.render ? column.render(value, row) : value;
  };

  const tableContent = (
    <div className={`space-y-4 ${className}`}>
      {(searchable || additionalFilters || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
          <div className="flex flex-1 items-center gap-3">
            {searchable && (
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 w-full bg-background"
                />
              </div>
            )}
            {additionalFilters}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border bg-background overflow-hidden relative">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b border-border">
              {selectable && (
                <TableHead className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={`h-11 ${column.headerClassName || ''}`}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.key)}
                      className="-ml-3 h-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
                    >
                      {column.header}
                      {sortKey === column.key ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="ml-1 h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {column.header}
                    </span>
                  )}
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead className="text-right h-11 text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-6">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="h-48 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm animate-pulse">Cargando datos...</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="h-48 text-center hover:bg-transparent">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-8">
                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                      <Inbox className="h-6 w-6 opacity-50" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
                      <p className="text-xs text-muted-foreground">Intenta ajustar tu búsqueda o filtros</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rowKey = keyExtractor(row);
                const isSelected = selectedRows.has(rowKey);
                return (
                  <TableRow
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={`${onRowClick ? "cursor-pointer hover:bg-muted/50" : "hover:bg-muted/30"} transition-colors ${isSelected ? "bg-muted/50" : ""}`}
                    data-state={isSelected ? "selected" : undefined}
                  >
                    {selectable && (
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleRowSelection(rowKey);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)} className={`py-3 ${column.className || ''}`}>
                        {getCellValue(row, column)}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell className="text-right py-3 pr-4">
                        <div className="flex justify-end gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                          {actions
                            .filter((action) => !action.condition || action.condition(row))
                            .map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.variant || "ghost"}
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                {action.label}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && !isLoading && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
            <span>
              {startItem}-{endItem} de {sortedData.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Mostrar</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              title="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 px-2 mx-1 rounded-md bg-muted/30 h-8">
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {currentPage} / {totalPages}
              </span>
            </div>

            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              title="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (!showCard) return tableContent;

  return (
    <Card className="shadow-sm border-border/60">
      {(title || description) && (
        <CardHeader className="px-6 py-5 border-b border-border/40 bg-muted/10">
          {title && <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>}
          {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-6">{tableContent}</CardContent>
    </Card>
  );
}

export default DataTable;
