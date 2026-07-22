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
  // Campos opcionales para retrocompatibilidad
  marca?: string;
  modelo?: string;
  precio?: number;
  descripcion?: string;
  imagen?: string;
}