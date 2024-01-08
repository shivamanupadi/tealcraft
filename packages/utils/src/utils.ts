import { saveAs } from "file-saver";

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

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}
