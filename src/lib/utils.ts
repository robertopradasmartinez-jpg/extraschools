import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Verifica si una empresa tiene una suscripción activa y válida
 */
export function hasActiveSubscription(company: {
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
} | null): boolean {
  if (!company) return false;
  
  // Debe tener un ID de suscripción
  if (!company.stripeSubscriptionId) return false;
  
  // Debe tener una fecha de fin de período
  if (!company.stripeCurrentPeriodEnd) return false;
  
  // La fecha de fin debe ser futura
  return new Date(company.stripeCurrentPeriodEnd) > new Date();
}
