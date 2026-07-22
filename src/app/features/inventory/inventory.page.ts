import { Component, OnInit, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { SneakerService } from '../../core/services/sneaker.service';
import { ScannerService } from '../../core/services/scanner.service';
import { SneakerI } from '../../core/models/sneakers.models';
import { ItemModalComponent } from '../../shared/components/item-modal/item-modal.component';
import { AddPairModalComponent } from '../../shared/components/add-pair-modal/add-pair-modal.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, ItemModalComponent, AddPairModalComponent]
})
export class InventoryPage implements OnInit {
  @ViewChild('addPairModal') addPairModal!: AddPairModalComponent;

  readonly sneakerService = inject(SneakerService);
  private scannerService = inject(ScannerService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  /**
   * Signals reactivos y de filtrado para el Dashboard / Inventario
   */
  readonly sneakers = this.sneakerService.sneakers;
  readonly totalCollectionValue = this.sneakerService.totalCollectionValue;
  readonly totalSneakers = this.sneakerService.totalSneakers;
  readonly searchTerm = this.sneakerService.searchTerm;
  readonly brandFilter = this.sneakerService.brandFilter;

  // Filtro segmentado estilo pill ('Todos' vs 'Favoritos')
  readonly activeTab = signal<'all' | 'favorites'>('all');

  readonly favoritesCount = computed(() => {
    return this.sneakers().filter(s => s.isFavorite).length;
  });

  readonly filteredInventory = computed(() => {
    const list = this.sneakers();
    if (this.activeTab() === 'favorites') {
      return list.filter(item => item.isFavorite);
    }
    return list;
  });

  ngOnInit() {
    this.sneakerService.loadSneakers();
  }

  setTab(tab: 'all' | 'favorites') {
    this.activeTab.set(tab);
  }

  async toggleFavorite(sneaker: SneakerI, event: Event) {
    event.stopPropagation();
    const updated = !sneaker.isFavorite;
    await this.sneakerService.updateSneaker(sneaker.id, { isFavorite: updated });
    
    const toast = await this.toastController.create({
      message: updated ? `"${sneaker.model || sneaker.modelo}" añadido a favoritos.` : `"${sneaker.model || sneaker.modelo}" removido de favoritos.`,
      duration: 1500,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      cssClass: 'small-modal'
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.sneakerService.loadSneakers();
      }
    });
  
    return await modal.present();
  }

  openAddPairModal() {
    if (this.addPairModal) {
      this.addPairModal.open();
    }
  }

  onPairAdded() {
    this.sneakerService.loadSneakers();
  }

  async presentEditAlert(sneaker: SneakerI) {
    const alert = await this.alertController.create({
      header: 'Editar Sneaker',
      inputs: [
        {
          name: 'modelo',
          type: 'text',
          placeholder: 'Modelo',
          value: sneaker.modelo || sneaker.model
        },
        {
          name: 'marca',
          type: 'text',
          placeholder: 'Marca',
          value: sneaker.marca || sneaker.brand
        },
        {
          name: 'size',
          type: 'number',
          placeholder: 'Talle US (Ej: 9.5)',
          value: sneaker.size
        },
        {
          name: 'condition',
          type: 'text',
          placeholder: 'Condición (Ej: DS, VNDS)',
          value: sneaker.condition || 'DS'
        },
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Valor CLP / USD',
          value: sneaker.precio || sneaker.marketValue
        },
        {
          name: 'priceChangePercentage',
          type: 'number',
          placeholder: 'Variación % (Ej: +10 o -4)',
          value: sneaker.priceChangePercentage || 0
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (sneaker.id) {
              await this.sneakerService.updateSneaker(sneaker.id, {
                model: data.modelo,
                modelo: data.modelo,
                brand: data.marca,
                marca: data.marca,
                size: Number(data.size) || sneaker.size || 9.5,
                condition: data.condition || 'DS',
                marketValue: Number(data.precio) || sneaker.marketValue || 0,
                precio: Number(data.precio) || sneaker.precio || 0,
                priceChangePercentage: Number(data.priceChangePercentage) || 0
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async scanSneaker() {
    try {
      let barcode = await this.scannerService.startScan();

      if (!barcode) {
        barcode = await this.promptManualCode();
        if (!barcode) return;
      }

      const loading = await this.loadingController.create({
        message: 'Guardando zapatilla escaneada...',
        spinner: 'crescent'
      });
      await loading.present();

      const docId = uuidv4();
      const newSneaker: SneakerI = {
        id: docId,
        brand: 'Nike',
        model: `Air Jordan 3 "Fire Red"`,
        size: 9.5,
        marketValue: 189990,
        condition: 'DS',
        priceChangePercentage: 10,
        isFavorite: true,
        ownerId: 'user_default',
        createdAt: new Date(),
        marca: 'Jordan',
        modelo: `Air Jordan 3 "Fire Red"`,
        precio: 189990,
        descripcion: `Código escaneado: ${barcode}`
      };

      await this.sneakerService.addSneaker(newSneaker);
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `¡Zapatilla agregada al inventario!`,
        duration: 2500,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      console.error('Error al procesar el escaneo:', error);
    }
  }

  private async promptManualCode(): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Escáner en Modo Web',
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
          { text: 'Cancelar', role: 'cancel', handler: () => resolve(null) },
          { text: 'Simular', handler: (data) => resolve(data.barcode?.trim() || null) }
        ]
      });
      await alert.present();
    });
  }

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
          }
        }
      ]
    });
    await alert.present();
  }
}
