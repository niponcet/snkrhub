import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { SneakerService } from '../../core/services/sneaker.service';
import { ScannerService } from '../../core/services/scanner.service';
import { SneakerI } from '../../core/models/sneakers.models';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class InventoryPage implements OnInit {
  private sneakerService = inject(SneakerService);
  private scannerService = inject(ScannerService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  /**
   * Signals expuestos desde SneakerService
   */
  readonly sneakers = this.sneakerService.sneakers;
  readonly filteredSneakers = this.sneakerService.filteredSneakers;
  readonly totalCollectionValue = this.sneakerService.totalCollectionValue;
  readonly totalSneakers = this.sneakerService.totalSneakers;
  readonly searchTerm = this.sneakerService.searchTerm;
  readonly brandFilter = this.sneakerService.brandFilter;
  readonly availableBrands = this.sneakerService.availableBrands;

  ngOnInit() {
    this.sneakerService.loadSneakers();
  }

  /**
   * Evento al escribir en la barra de búsqueda.
   */
  onSearchChange(event: any) {
    const val = event.detail?.value || '';
    this.sneakerService.setSearchTerm(val);
  }

  /**
   * Evento al cambiar la marca seleccionada en el segmento de filtros.
   */
  onBrandChange(event: any) {
    const brand = event.detail?.value || 'All';
    this.sneakerService.setBrandFilter(brand);
  }

  /**
   * Ejecuta el escaneo de código de barras de la caja y guarda la zapatilla.
   */
  async scanSneaker() {
    try {
      let barcode = await this.scannerService.startScan();

      if (!barcode) {
        barcode = await this.promptManualCode();
        if (!barcode) {
          return;
        }
      }

      const loading = await this.loadingController.create({
        message: 'Guardando zapatilla escaneada...',
        spinner: 'crescent'
      });
      await loading.present();

      const newSneaker: SneakerI = {
        id: uuidv4(),
        brand: 'Nike',
        model: `Air Max (Cod: ${barcode})`,
        size: 10,
        marketValue: 180,
        ownerId: 'user_default',
        createdAt: new Date(),
        marca: 'Nike',
        modelo: `Air Max (Cod: ${barcode})`,
        precio: 180,
        descripcion: `Código de barras escaneado: ${barcode}`,
        imagen: 'assets/images/driftblack.jpg'
      };

      await this.sneakerService.addSneaker(newSneaker);
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `¡Zapatilla "${newSneaker.model}" agregada al inventario!`,
        duration: 3000,
        color: 'success',
        position: 'bottom',
        buttons: [{ text: 'OK', role: 'cancel' }]
      });
      await toast.present();
    } catch (error) {
      console.error('Error al procesar el escaneo:', error);
      const toast = await this.toastController.create({
        message: 'Ocurrió un error al guardar la zapatilla.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  /**
   * Diálogo modal para ingresar un código manualmente si se prueba en navegador Web.
   */
  private async promptManualCode(): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Escáner en Modo Web',
        subHeader: 'Prueba en Navegador',
        message: 'Ingresa un código de barras para simular el escaneo:',
        inputs: [
          {
            name: 'barcode',
            type: 'text',
            placeholder: 'Ej: 194493829104',
            value: 'SNKR-' + Math.floor(100000 + Math.random() * 900000)
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(null)
          },
          {
            text: 'Simular Escaneo',
            handler: (data) => resolve(data.barcode?.trim() || null)
          }
        ]
      });
      await alert.present();
    });
  }

  /**
   * Elimina una zapatilla del inventario.
   */
  async deleteSneaker(sneaker: SneakerI) {
    const alert = await this.alertController.create({
      header: 'Eliminar Zapatilla',
      message: `¿Estás seguro de eliminar "${sneaker.model || sneaker.modelo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.sneakerService.removeSneaker(sneaker.id);
            const toast = await this.toastController.create({
              message: 'Zapatilla eliminada del inventario.',
              duration: 2000,
              color: 'warning'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }
}
