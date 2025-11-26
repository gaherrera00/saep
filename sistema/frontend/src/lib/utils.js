import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export function formatarDataBR(data) {
  if (!data) return "-";
  const somenteData = String(data).slice(0, 10);
  const [ano, mes, dia] = somenteData.split("-");
  return `${dia}/${mes}/${ano}`;
}
