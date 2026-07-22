import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './shared/components/tabs/tabs.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TabsComponent]
})
export class AppComponent {
  constructor(private router: Router) {}

  shouldShowTabs(): boolean {
    const route = this.router.url;
    return !(route.includes('/login') || route.includes('/registro'));
  }
}
