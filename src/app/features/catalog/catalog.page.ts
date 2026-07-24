import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExternalApiService } from '../../core/services/external-api.service';
import { addIcons } from 'ionicons';
import { calendarOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CatalogPage implements OnInit {
  public apiService = inject(ExternalApiService);

  constructor() {
    addIcons({ calendarOutline, closeCircleOutline });
  }

  
  readonly upcomingDrops = computed(() => this.apiService.releases());
  readonly selectedDate = signal<string | null>(null);

  readonly filteredDrops = computed(() => {
    const date = this.selectedDate();
    const drops = this.upcomingDrops();
    if (!date) return drops;
    const filterDateStr = date.split('T')[0];
    return drops.filter(drop => drop.releaseDate.startsWith(filterDateStr));
  });

  clearDateFilter() {
    this.selectedDate.set(null);
  }

  onDateChange(event: any) {
    this.selectedDate.set(event.detail.value || null);
  }

  readonly groupedUpcomingDrops = computed(() => {
    const drops = this.filteredDrops();
    const grouped: { dateStr: string; day: string; month: string; releases: any[] }[] = [];
    
    drops.forEach(drop => {
      const d = new Date(drop.releaseDate);
      const day = d.getDate().toString().padStart(2, '0');
      const monthStr = d.toLocaleString('es-ES', { month: 'short' }).substring(0, 3);
      const dateStr = `${day}-${monthStr}`;
      
      let group = grouped.find(g => g.dateStr === dateStr);
      if (!group) {
        group = { dateStr, day, month: monthStr, releases: [] };
        grouped.push(group);
      }

      const diffTime = d.getTime() - new Date().getTime();
      const countdownDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      group.releases.push({
        ...drop,
        countdownDays: countdownDays > 0 ? countdownDays : 0
      });
    });
    
    return grouped;
  });

  ngOnInit() {
    this.apiService.fetchUpcomingReleases();
  }
}

