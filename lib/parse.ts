export type KeyValueRecord = Record<string, string>;

export function parseUserInput(raw: string): KeyValueRecord {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [
          key.trim(),
          typeof value === "string" ? value : JSON.stringify(value)
        ])
      );
    }
  } catch (error) {
    // fall back to manual parsing
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries = lines.map((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) {
      throw new Error(`Unable to parse line: "${line}"`);
    }
    return [key.trim(), rest.join(":").trim()] as const;
  });

  return Object.fromEntries(entries);
}
