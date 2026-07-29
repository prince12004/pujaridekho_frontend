export function formatCurrency(amount: number | undefined | null): string {
  return `₹${(amount ?? 0).toLocaleString("en-IN")}`;
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}
