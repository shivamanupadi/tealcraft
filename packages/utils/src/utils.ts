import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";

export function ellipseString(str: string = "", width: number = 10): string {
  if (width >= str.length) {
    return str;
  }
  return `${str.slice(0, width)}...`;
}

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

export function convertUTCDateToLocalDate(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}

export function debounce(task: any, ms: number) {
  let t = { promise: null, cancel: () => void 0 };
  return async (...args: any) => {
    try {
      // @ts-ignore
      t.cancel();
      t = deferred(ms);
      await t.promise;
      await task(...args);
    } catch (_) {
      /* prevent memory leak */
    }
  };
}

export function deferred(ms: number): any {
  let cancel,
    promise = new Promise((resolve, reject) => {
      cancel = reject;
      setTimeout(resolve, ms);
    });
  return { promise, cancel };
}

export async function sleep(ms: number): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
