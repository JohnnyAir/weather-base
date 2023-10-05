export function cn(
  ...args: Array<undefined | null | string | boolean>
): string {
  return args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ");
}

export const getUrlSafeHash = (str: string) => {
  const base64 = btoa(str);
  const urlSafeBase64 = base64.replace(/\+/g, "-").replace(/\//g, "_");
  return urlSafeBase64;
};

export const decodeUrlSafeHash = (str: string) => {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
