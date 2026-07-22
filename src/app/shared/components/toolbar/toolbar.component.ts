import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ScannerService } from '../../../core/services/scanner.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class ToolbarComponent {
  private scannerService = inject(ScannerService);

  async onScanClick() {
    const code = await this.scannerService.startScan();
    if (code) {
      console.log('Código escaneado:', code);
    }
  }
}
