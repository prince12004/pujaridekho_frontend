export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message ?? fallback;
}
