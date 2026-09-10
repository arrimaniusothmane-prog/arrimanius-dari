export class ApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && typeof data.error === "string" ? data.error : null) ??
      "Une erreur est survenue.";
    throw new ApiClientError(message, res.status);
  }
  return data as T;
}