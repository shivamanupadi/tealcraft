export function getExceptionMsg(e: any): string {
  return e?.response?.data?.message || e?.message;
}

export function downloadJson(data: JSON, fileName: string) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data),
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = fileName;
  link.click();
}
