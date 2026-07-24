import { FieldValue, Timestamp } from '@angular/fire/firestore';

export interface SneakerI {
  id: string;
  brand: string;
  model: string;
  size: number;
  marketValue: number;
  ownerId: string;
  createdAt: Date | Timestamp | FieldValue | number;
  description?: string;
  imageUrl?: string;
  // Nuevos campos para Dashboard/Inventario
  condition?: string;              // ej. 'DS', 'VNDS'
  priceChangePercentage?: number;  // ej. +10, -4
  isFavorite?: boolean;            // Indicador de favorito
  // Campos opcionales para retrocompatibilidad
  marca?: string;
  modelo?: string;
  precio?: number;
  descripcion?: string;
  imagen?: string;
}

export interface ReleaseI {
  id: string;
  sneakerName: string;
  brand: string;
  releaseDate: string; // ISO o similar
  price: number;
  imageUrl: string;
}


export interface ReleaseItemI {
  id: string;
  title: string;
  brand: string;
  priceCLP: number;
  countdownDays: number;
  bgColor: string;
}

export interface ReleaseGroupI {
  day: string;
  month: string;
  releases: ReleaseItemI[];
}

export interface HistoricalSneakerI {
  id: string;
  title: string;
  description: string;
  priceCLP: number;
  trend: 'up' | 'down';
  bgColor: string;
  brand: string;
}

export interface NewsI {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  articleUrl: string;
}