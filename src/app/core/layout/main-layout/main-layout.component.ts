import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ToolbarComponent, TabsComponent]
})
export class MainLayoutComponent {}
