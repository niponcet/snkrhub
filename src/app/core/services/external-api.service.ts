import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HistoricalSneakerI, NewsI, ReleaseI } from '../models/sneakers.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {
  private http = inject(HttpClient);

  readonly news = signal<NewsI[]>([]);

  readonly releases = signal<ReleaseI[]>([]);

  fetchUpcomingReleases(): void {
    const url = `https://${environment.sneakerApi.host}/releases?limit=15`;
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.sneakerApi.key,
      'X-RapidAPI-Host': environment.sneakerApi.host
    });

    this.http.get<any>(url, { headers }).pipe(
        map(response => {
          const results = response.data ? response.data : [];
          return results.map((item: any) => ({
            id: item.sku || item.id?.toString(),
            sneakerName: item.name,
            brand: item.brand,
            releaseDate: item.release_date || (item.created_at ? item.created_at.split(' ')[0] : 'N/A'),
            price: item.price_usd || 0,
            imageUrl: item.thumbnail_url || 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=No+Image'
          }) as ReleaseI);
        }),
      catchError(err => {
        console.warn('Error fetching upcoming releases from API. Using high-level mock data.', err);
        const today = new Date();
        const d1 = new Date(today); d1.setDate(d1.getDate() + 2);
        const d2 = new Date(today); d2.setDate(d2.getDate() + 5);
        const d3 = new Date(today); d3.setDate(d3.getDate() + 10);
        const d4 = new Date(today); d4.setDate(d4.getDate() + 14);
        
        return of([
          {
            id: 'mock-1',
            sneakerName: 'Air Jordan 4 RM',
            brand: 'Jordan',
            releaseDate: d1.toISOString(),
            price: 150,
            imageUrl: 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=Air+Jordan+4+RM'
          },
          {
            id: 'mock-2',
            sneakerName: 'Travis Scott x Air Jordan 1 Low',
            brand: 'Jordan',
            releaseDate: d2.toISOString(),
            price: 150,
            imageUrl: 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=Travis+Scott+AJ1'
          },
          {
            id: 'mock-3',
            sneakerName: 'Nike SB Dunk Low Pro',
            brand: 'Nike',
            releaseDate: d3.toISOString(),
            price: 115,
            imageUrl: 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=SB+Dunk+Low'
          },
          {
            id: 'mock-4',
            sneakerName: 'Yeezy Slide "Onyx"',
            brand: 'Adidas',
            releaseDate: d4.toISOString(),
            price: 70,
            imageUrl: 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=Yeezy+Slide'
          }
        ] as ReleaseI[]);
      }),
      map(releases => releases.sort((a: ReleaseI, b: ReleaseI) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()))
    ).subscribe(data => {
      this.releases.set(data);
    });
  }

  readonly searchResults = signal<ReleaseI[]>([]);

  searchSneakers(query: string, brand: string = ''): Promise<void> {
    const url = `https://${environment.sneakerApi.host}/releases`;
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.sneakerApi.key,
      'X-RapidAPI-Host': environment.sneakerApi.host
    });
    let params = new HttpParams().set('limit', '20');

    if (query && query.trim() !== '') {
      params = params.set('q', query);
    }

    if (brand && brand.trim() !== '') {
      params = params.set('brands', brand.toLowerCase());
    }

    return new Promise((resolve) => {
      this.http.get<any>(url, { headers, params }).pipe(
        map(response => {
          const results = response.data ? response.data : [];
          return results.map((item: any) => ({
            id: item.sku || item.id?.toString(),
            sneakerName: item.name,
            brand: item.brand,
            releaseDate: item.release_date || (item.created_at ? item.created_at.split(' ')[0] : 'N/A'),
            price: item.price_usd || 0,
            imageUrl: item.thumbnail_url || 'https://placehold.co/600x400/1a1a1a/ff5722.png?text=No+Image'
          }) as ReleaseI);
        }),
        catchError(err => {
          console.warn('Error fetching search results from API.', err);
          return of([] as ReleaseI[]);
        })
      ).subscribe(data => {
        this.searchResults.set(data);
        resolve();
      });
    });
  }

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

  private extractImageUrl(item: any): string {
    // 1. Intentar obtener desde la propiedad directa del feed
    if (item.thumbnail && item.thumbnail.length > 0) return item.thumbnail;
    if (item.enclosure?.link) return item.enclosure.link;
    if (item.enclosure?.url) return item.enclosure.url;

    // 2. Extraer el primer tag <img src="..."> desde la descripción o contenido
    const htmlContent = item.content || item.description || '';
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      let url = imgMatch[1];
      if (url.startsWith('//')) url = 'https:' + url;
      return url;
    }

    // 3. Fallback: Imagen genérica estilo streetwear/sneaker
    return 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop';
  }

  fetchNews(): void {
    const rssUrl = 'https://sneakernews.com/feed/';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    this.http.get<any>(apiUrl).pipe(
      map(response => {
        if (response.status === 'ok') {
          return response.items.map((item: any) => {
            // Limpiar HTML de la descripción
            const doc = new DOMParser().parseFromString(item.description || item.content, 'text/html');
            const summary = doc.body.textContent || '';

            return {
              id: item.guid || item.link,
              title: item.title,
              summary: summary.substring(0, 150) + '...',
              source: 'Sneaker News',
              date: item.pubDate,
              imageUrl: this.extractImageUrl(item),
              articleUrl: item.link
            } as NewsI;
          });
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching news:', error);
        // Fallback en caso de error
        return of([{
          id: 'error-1',
          title: 'No se pudieron cargar las noticias',
          summary: 'Verifica tu conexión a internet e intenta nuevamente.',
          source: 'Sistema',
          date: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
          articleUrl: '#'
        } as NewsI]);
      })
    ).subscribe(newsData => {
      this.news.set(newsData);
    });
  }
}
