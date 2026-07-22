import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { FirestoreService } from '../../../core/services/firestore.service';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ItemModalComponent {
  newSneaker = {
    modelo: '',
    marca: '',
    descripcion: '',
    precio: '',
    imagen: '',
    id: ''
  };
  cargando: boolean = false;

  constructor(
    private modalController: ModalController,
    private firestoreService: FirestoreService
  ) {
    this.newSneaker.id = this.firestoreService.createIdDoc();
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  async saveSneaker() {
    if (this.newSneaker) {
      this.cargando = true;
      try {
        await this.firestoreService.createDocumentID(this.newSneaker, 'Sneakers', this.newSneaker.id);
        await this.modalController.dismiss(this.newSneaker);
      } catch (error) {
        console.error('Error al guardar el sneaker:', error);
      } finally {
        this.cargando = false;
      }
    }
  }
}
