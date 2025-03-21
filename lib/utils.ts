import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateEmissions(distance: number, mode: string): number {
  const emissionRates: Record<string, number> = {
    car: 0.2,
    train: 0.05,
    bike: 0,
    plane: 0.25,
  };
  return distance * (emissionRates[mode] || 0.1);
}

