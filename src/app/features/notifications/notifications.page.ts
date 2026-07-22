import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

export interface NotificationItem {
  id: string;
  category: 'price' | 'drops' | 'system';
  iconType: 'up' | 'down' | 'rel' | 'sys';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  dayGroup: 'Hoy' | 'Ayer' | 'Esta semana';
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class NotificationsPage {
  readonly activeTab = signal<'all' | 'price' | 'drops' | 'system'>('all');

  readonly notifications = signal<NotificationItem[]>([
    {
      id: 'n1',
      category: 'price',
      iconType: 'up',
      title: 'Tu Yeezy 350 "Zebra" subió 18%',
      description: 'Ahora vale CLP 245.000 en el mercado de reventa.',
      time: 'Hace 40 min',
      unread: true,
      dayGroup: 'Hoy'
    },
    {
      id: 'n2',
      category: 'drops',
      iconType: 'rel',
      title: 'Dunk Low "Panda Reverse" lanza en 6 días',
      description: 'Activaste alerta para este lanzamiento el 27 de julio.',
      time: 'Hace 3 h',
      unread: true,
      dayGroup: 'Hoy'
    },
    {
      id: 'n3',
      category: 'price',
      iconType: 'down',
      title: 'Dunk Low "Panda" bajó 4%',
      description: 'Un par de tu colección cambió de valor.',
      time: 'Ayer, 18:20',
      unread: false,
      dayGroup: 'Ayer'
    },
    {
      id: 'n4',
      category: 'system',
      iconType: 'sys',
      title: 'Par verificado correctamente',
      description: 'El Air Jordan 3 "Fire Red" fue autenticado y agregado.',
      time: 'Ayer, 11:05',
      unread: false,
      dayGroup: 'Ayer'
    },
    {
      id: 'n5',
      category: 'drops',
      iconType: 'rel',
      title: 'Nuevo drop agregado al calendario',
      description: 'Air Max Plus "Sunset" — 2 de agosto.',
      time: 'Lunes, 09:12',
      unread: false,
      dayGroup: 'Esta semana'
    },
    {
      id: 'n6',
      category: 'system',
      iconType: 'sys',
      title: 'Respaldo de tu colección completado',
      description: 'Todos tus datos están sincronizados en la nube.',
      time: 'Lunes, 07:00',
      unread: false,
      dayGroup: 'Esta semana'
    }
  ]);

  readonly groupedNotifications = computed(() => {
    const list = this.notifications();
    const tab = this.activeTab();
    const filtered = tab === 'all' ? list : list.filter(item => item.category === tab);

    const groups: { [key: string]: NotificationItem[] } = {
      'Hoy': [],
      'Ayer': [],
      'Esta semana': []
    };

    filtered.forEach(item => {
      if (groups[item.dayGroup]) {
        groups[item.dayGroup].push(item);
      }
    });

    return [
      { label: 'Hoy', items: groups['Hoy'] },
      { label: 'Ayer', items: groups['Ayer'] },
      { label: 'Esta semana', items: groups['Esta semana'] }
    ].filter(g => g.items.length > 0);
  });

  setTab(tab: 'all' | 'price' | 'drops' | 'system') {
    this.activeTab.set(tab);
  }

  markAllRead() {
    this.notifications.update(current =>
      current.map(item => ({ ...item, unread: false }))
    );
  }
}
