import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + " minutes ago";
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + " hours ago";
  if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + " days ago";
  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatXp(xp: number): string {
  return xp.toLocaleString();
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}
