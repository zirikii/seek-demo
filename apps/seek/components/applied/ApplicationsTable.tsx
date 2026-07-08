"use client";

import * as React from "react";
import Link from "next/link";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ApplicationStatus, JobWithEmployer } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployerLogo } from "@/components/common/EmployerLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ApplicationRow {
  id: string;
  job: JobWithEmployer;
  appliedAt: string;
  status: ApplicationStatus;
}

const statusTone: Record<ApplicationStatus, "info" | "neutral" | "positive" | "critical"> = {
  Submitted: "neutral",
  Viewed: "info",
  Shortlisted: "positive",
  Unsuccessful: "critical",
};

function SortHeader({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-ink-muted hover:text-seek-navy"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function ApplicationsTable({ rows }: { rows: ApplicationRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "appliedAt", desc: true }]);

  const columns = React.useMemo<ColumnDef<ApplicationRow>[]>(
    () => [
      {
        accessorFn: (row) => row.job.title,
        id: "job",
        header: ({ column }) => (
          <SortHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Job
          </SortHeader>
        ),
        cell: ({ row }) => {
          const job = row.original.job;
          return (
            <div className="flex items-center gap-3">
              <EmployerLogo src={job.employer.logo} name={job.employer.name} size={40} />
              <div className="min-w-0">
                <Link
                  href={`/jobs/${job.id}`}
                  className="block truncate font-medium text-seek-navy hover:text-seek-pink"
                >
                  {job.title}
                </Link>
                <span className="block truncate text-xs text-ink-muted">{job.employer.name}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "appliedAt",
        header: ({ column }) => (
          <SortHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date applied
          </SortHeader>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-ink-secondary">
            {formatDate(row.original.appliedAt)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
          </SortHeader>
        ),
        cell: ({ row }) => (
          <Badge tone={statusTone[row.original.status]}>{row.original.status}</Badge>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="rounded-lg border border-line bg-white shadow-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-between border-t border-line px-4 py-3">
          <p className="text-sm text-ink-muted">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
