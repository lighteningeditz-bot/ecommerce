/**
 * Sanitizes untrusted user text before embedding into AI prompts.
 * Strips ASCII control characters, limits length, trims whitespace,
 * and escapes tag brackets to prevent delimiter injection.
 */
export function sanitizeUserInput(input: string | undefined | null, maxLength: number): string {
  if (!input) return "";

  // 1. Strip ASCII control characters except standard space
  let sanitized = input.replace(/[\u0000-\u001F\u007F]/g, " ").trim();

  // 2. Prevent delimiter injection: neutralize <user_input> or similar closing/opening tags
  sanitized = sanitized
    .replace(/<\/?user_input>/gi, "")
    .replace(/<\/?catalog>/gi, "")
    .replace(/<\/?product>/gi, "")
    .replace(/<\/?reviews>/gi, "")
    .replace(/<\/?store_facts>/gi, "")
    .replace(/<\/?maker_inputs>/gi, "");

  // 3. Slice to maximum length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength).trim();
  }

  return sanitized;
}

export function wrapInUserInputTag(content: string): string {
  return `<user_input>\n${content}\n</user_input>`;
}
