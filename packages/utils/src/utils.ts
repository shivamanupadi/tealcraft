import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

export function getExceptionMsg(e: any): string {
  return e?.response?.data?.message || e?.message;
}

export function downloadJson(data: any, fileName: string) {
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

export function copyContent(ev: any, content: string) {
  copy(content, {
    message: "Press #{key} to copy",
  });
  ev.preventDefault();
  ev.stopPropagation();
}

export function isValidClassName(className: string): boolean {
  const regex = /^[a-zA-Z_]\w*$/;
  return regex.test(className);
}

export function getBaseUrl(): string {
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
}
