import type { KeyValueRecord } from "./parse";

export interface ComparisonResult {
  attribute: string;
  userValue: string;
  llmValue: string;
  isMismatch: boolean;
}

export function buildComparisonResults(
  user: KeyValueRecord,
  llm: KeyValueRecord
): ComparisonResult[] {
  const keys = Array.from(new Set([...Object.keys(user), ...Object.keys(llm)])).sort(
    (a, b) => a.localeCompare(b)
  );

  return keys.map((key) => {
    const userValue = user[key] ?? "";
    const llmValue = llm[key] ?? "";
    return {
      attribute: key,
      userValue,
      llmValue,
      isMismatch: normalize(userValue) !== normalize(llmValue)
    } satisfies ComparisonResult;
  });
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
