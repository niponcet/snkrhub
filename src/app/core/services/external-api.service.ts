import { Injectable, signal } from '@angular/core';
import { ReleaseGroupI, HistoricalSneakerI } from '../models/sneakers.models';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {
  readonly releases = signal<ReleaseGroupI[]>([
    {
      day: '24',
      month: 'Jul',
      releases: [
        { id: 'rel-1', title: 'Air Jordan 3 "Fire Red"', brand: 'Jordan', priceCLP: 189990, countdownDays: 3, bgColor: '#c23a1f' }
      ]
    },
    {
      day: '27',
      month: 'Jul',
      releases: [
        { id: 'rel-2', title: 'Dunk Low "Panda Reverse"', brand: 'Nike', priceCLP: 109990, countdownDays: 6, bgColor: '#2b2b32' },
        { id: 'rel-3', title: 'Yeezy Boost 350 V2 "Onyx"', brand: 'Adidas', priceCLP: 199990, countdownDays: 6, bgColor: '#1c2a24' }
      ]
    },
    {
      day: '02',
      month: 'Ago',
      releases: [
        { id: 'rel-4', title: 'Air Max Plus "Sunset"', brand: 'Nike', priceCLP: 149990, countdownDays: 12, bgColor: '#33241c' }
      ]
    }
  ]);

  readonly historicalSneakers = signal<HistoricalSneakerI[]>([
    {
      id: 'db-1',
      title: 'Air Jordan 1 High "Chicago"',
      description: 'Colorway original de 1985, reeditada múltiples veces. Referencia histórica del mercado de reventa.',
      priceCLP: 420000,
      trend: 'up',
      bgColor: '#2b2b32',
      brand: 'Jordan'
    },
    {
      id: 'db-2',
      title: 'Nike Dunk Low "Panda"',
      description: 'El colorway blanco/negro más buscado de la última generación de Dunks. Alta liquidez de reventa.',
      priceCLP: 98000,
      trend: 'down',
      bgColor: '#c23a1f',
      brand: 'Nike'
    },
    {
      id: 'db-3',
      title: 'Adidas Yeezy 350 V2 "Zebra"',
      description: 'Uno de los colorways insignia de la línea Yeezy. Producción limitada desde 2022.',
      priceCLP: 245000,
      trend: 'up',
      bgColor: '#1c2a24',
      brand: 'Adidas'
    }
  ]);
}
