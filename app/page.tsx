"use client";

import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComparisonTable } from "@/components/comparison-table";
import type { ComparisonResult } from "@/lib/comparison";
import { buildComparisonResults } from "@/lib/comparison";
import { parseUserInput, type KeyValueRecord } from "@/lib/parse";

interface CompareResponse {
  llmKVPairs: KeyValueRecord;
}

export default function Home() {
  const [sku, setSku] = useState("SKU-90210");
  const [rawInput, setRawInput] = useState(
    '{\n  "Color": "Crimson",\n  "Material": "Aluminum",\n  "Battery Life": "18 hours"\n}'
  );
  const [comparison, setComparison] = useState<ComparisonResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasResults = comparison.length > 0;

  const mismatchCount = useMemo(
    () => comparison.filter((item) => item.isMismatch).length,
    [comparison]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    let parsed: KeyValueRecord;
    try {
      parsed = parseUserInput(rawInput);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Unable to parse input");
      return;
    }

    if (!sku.trim()) {
      setError("Please provide a SKU before comparing.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku.trim(), userKVPairs: parsed })
      });

      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(message ?? "Unable to fetch comparison");
      }

      const data = (await response.json()) as CompareResponse;
      const results = buildComparisonResults(parsed, data.llmKVPairs);
      setComparison(results);
      setShowOnlyDiffs(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while contacting Gemini"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10 text-foreground">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Gemini-powered analysis</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Compare your SKU specifications with confidence
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-sm text-muted-foreground">
            Provide a SKU and the attributes you care about. We&apos;ll query Google Gemini for its take on the same fields and surface any discrepancies instantly.
          </p>
        </header>

        <Card className="border border-white/5 bg-black/40 shadow-2xl">
          <CardHeader>
            <CardTitle>Specification input</CardTitle>
            <CardDescription>
              Enter the SKU and the attributes to compare. Paste JSON (Record&lt;string, string&gt;) or colon-separated lines. We&apos;ll handle the parsing for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80" htmlFor="sku">
                  SKU
                </label>
                <Input
                  id="sku"
                  placeholder="SKU-90210"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground/80" htmlFor="user-input">
                  Your key-value pairs
                </label>
                <Textarea
                  id="user-input"
                  value={rawInput}
                  onChange={(event) => setRawInput(event.target.value)}
                  className="scrollbar-thin min-h-[220px] font-mono text-xs"
                  placeholder="{\n  \"Color\": \"Red\",\n  \"Material\": \"Steel\"\n}"
                />
                <p className="text-xs text-muted-foreground">
                  Accepts JSON (Record&lt;string, string&gt;) or simple <code>Attribute: Value</code> lines.
                </p>
              </div>

              {error ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {hasResults ? (
                  <p className="text-sm text-muted-foreground">
                    {mismatchCount === 0 ? (
                      <>All {comparison.length} attributes match Gemini&apos;s response.</>
                    ) : (
                      <>
                        {mismatchCount} mismatch{mismatchCount === 1 ? "" : "es"} detected across {comparison.length} attributes.
                      </>
                    )}
                  </p>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Gemini will only receive the keys you provide, thanks to structured output.
                  </span>
                )}

                <Button type="submit" disabled={isLoading} className="group w-full sm:w-auto">
                  <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                    {isLoading ? "Comparing…" : "Compare SKU"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <ComparisonTable
          data={comparison}
          loading={isLoading}
          showOnlyDiffs={showOnlyDiffs}
          onToggleShowOnlyDiffs={setShowOnlyDiffs}
        />
      </div>
    </main>
  );
}
