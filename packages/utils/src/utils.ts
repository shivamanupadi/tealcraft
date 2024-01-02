export function getExceptionMsg(e: any): string {
  return e?.response?.data?.message || e?.message;
}
