export async function getUserUuidForHeader(): Promise<string | null> {
  // Server: cookie
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('user_uuid')?.value ?? null;
  }

  // Client: localStorage
  return localStorage.getItem('user_uuid');
}
