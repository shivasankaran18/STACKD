import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { execSync } from 'node:child_process'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}