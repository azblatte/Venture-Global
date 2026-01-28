import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatCurrency(value: number, digits = 2) {
  return formatNumber(value, { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

export function formatPrice(value: number, digits = 2) {
  return `${formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
