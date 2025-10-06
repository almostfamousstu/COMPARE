"use client";

import * as React from "react";

import type { ComparisonResult } from "@/lib/comparison";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ComparisonTableProps {
  data: ComparisonResult[];
  loading?: boolean;
  showOnlyDiffs: boolean;
  onToggleShowOnlyDiffs: (value: boolean) => void;
}

export function ComparisonTable({
  data,
  loading,
  showOnlyDiffs,
  onToggleShowOnlyDiffs
}: ComparisonTableProps) {
  const visibleRows = React.useMemo(
    () => (showOnlyDiffs ? data.filter((row) => row.isMismatch) : data),
    [data, showOnlyDiffs]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Comparison results</h2>
          <p className="text-sm text-muted-foreground">
            Highlighted values indicate fields where Gemini disagrees with your specification.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show only differences</span>
          <Switch
            checked={showOnlyDiffs}
            onCheckedChange={(checked) => onToggleShowOnlyDiffs(Boolean(checked))}
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-inner">
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <Table className="min-w-[640px]">
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-muted/40">
                <TableHead className="w-[30%]">Attribute</TableHead>
                <TableHead>Your Value</TableHead>
                <TableHead>LLM Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                    No differences to show.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
                  <TableRow
                    key={row.attribute}
                    className={cn(
                      "transition-colors",
                      row.isMismatch ? "bg-amber-500/5" : undefined
                    )}
                  >
                    <TableCell className="font-medium text-foreground/90">
                      {row.attribute}
                    </TableCell>
                    <TableCell className="text-foreground/80">
                      {row.userValue || <em className="text-muted-foreground">—</em>}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-foreground/80",
                        row.isMismatch
                          ? "bg-amber-500/20 text-amber-50 backdrop-blur-sm"
                          : ""
                      )}
                    >
                      {row.llmValue || <em className="text-muted-foreground">—</em>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3 p-6">
      {[...Array(4).keys()].map((key) => (
        <Skeleton key={key} className="h-12 w-full" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-10 text-center text-sm text-muted-foreground">
      Start a comparison to see Gemini&apos;s take on your SKU specifications.
    </div>
  );
}
