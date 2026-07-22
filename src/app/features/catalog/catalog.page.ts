import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { SneakerI } from '../../core/models/sneakers.models';
import { ItemModalComponent } from '../../shared/components/item-modal/item-modal.component';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ItemModalComponent]
})
export class CatalogPage implements OnInit {
  items: any[] = []; 
  sneakers: SneakerI[] = []; 
  newSneaker?: SneakerI;
  cargando: boolean = false;
  loading: boolean = true;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private FirestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.loadItems();
    this.loadSneakers();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ItemModalComponent,
      cssClass: 'small-modal'
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.newSneaker = result.data;
        if (this.newSneaker && this.newSneaker.id) {
          this.updateSneaker(this.newSneaker.id, this.newSneaker);
        }
      }
    });
  
    return await modal.present();
  }

  loadSneakers() {
    this.loading = true;
    this.FirestoreService.getCollectionChanges<SneakerI>('Sneakers').subscribe(data => {
      if (data) {
        this.sneakers = data;
        console.log('Sneakers loaded:', this.sneakers);
      }
      this.loading = false;
    });
  }

  getSneaker() {
    const uid = '';
    this.FirestoreService.getDocumentChanges('Sneakers/' + uid).subscribe(data => {
      console.log('getsneaker ->', data);
    });
    this.FirestoreService.getDocument('Sneakers/' + uid).then(data => {});
  }
  
  editSneaker(sneaker: SneakerI) {
    console.log('edit->', sneaker);
    if (sneaker.id) {
      this.newSneaker = { ...sneaker };
      this.presentEditAlert(this.newSneaker);
    } else {
      console.error('Sneaker ID is undefined');
    }
  }

  async presentEditAlert(sneaker: SneakerI) {
    const alert = await this.alertController.create({
      header: 'Edit Sneaker',
      inputs: [
        {
          name: 'modelo',
          type: 'text',
          placeholder: 'Model',
          value: sneaker.modelo || sneaker.model
        },
        {
          name: 'marca',
          type: 'text',
          placeholder: 'Brand',
          value: sneaker.marca || sneaker.brand
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Description',
          value: sneaker.descripcion || sneaker.description
        },
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Price',
          value: sneaker.precio || sneaker.marketValue
        },
        {
          name: 'imagen',
          type: 'text',
          placeholder: 'Image URL',
          value: sneaker.imagen || sneaker.imageUrl
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (sneaker.id) {
              this.updateSneaker(sneaker.id, {
                ...sneaker,
                ...data 
              });
            } else {
              console.error('Sneaker ID is undefined');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async updateSneaker(id: string, updatedData: SneakerI) {
    try {
      if (!id) {
        throw new Error('ID is not defined');
      }
      this.cargando = true;
      await this.FirestoreService.updateDocumentID(updatedData, 'Sneakers', id);
      this.cargando = false;
    } catch (error) {
      console.error('Error updating sneaker:', error);
      this.cargando = false;
    }
  }

  async deleteSneaker(sneaker: SneakerI) {
    this.cargando = true;
    await this.FirestoreService.deleteDocumentID('Sneakers', sneaker.id);
    this.cargando = false;
  }

  async confirmDeleteSneaker(sneaker: SneakerI) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar este sneaker?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteSneaker(sneaker);
          }
        }
      ]
    });

    await alert.present();
  }

  loadItems() {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      this.items = JSON.parse(savedItems);
    }
  }
  
  addItem(item: { name: string; description: string; image: string }) {
    if (item.name.trim()) {
      this.items.push(item);
      this.saveItems();
    }
  }
  
  saveItems() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }
  
  updateItem(index: number, name: string, description: string, image: string) {
    if (this.items[index]) {
      this.items[index] = { ...this.items[index], name, description, image };
      this.saveItems();
    }
  }

  eliminarItem(index: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este ítem?')) {
      this.items.splice(index, 1);
      this.saveItems();
    }
  }
}
