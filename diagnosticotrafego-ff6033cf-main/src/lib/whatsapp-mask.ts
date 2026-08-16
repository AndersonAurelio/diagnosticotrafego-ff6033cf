export function formatBRPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 3) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (len <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidBRPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function onlyDigits(input: string): string {
  return input.replace(/\D/g, "");
}
