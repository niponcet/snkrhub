import { Component, signal, inject, Output, EventEmitter, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController, IonModal } from '@ionic/angular';
import { ScannerService } from '../../../core/services/scanner.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SneakerService } from '../../../core/services/sneaker.service';
import { SneakerI } from '../../../core/models/sneakers.models';

@Component({
  selector: 'app-add-pair-modal',
  templateUrl: './add-pair-modal.component.html',
  styleUrls: ['./add-pair-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AddPairModalComponent {
  @ViewChild(IonModal) ionModal?: IonModal;

  private scannerService = inject(ScannerService);
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private sneakerService = inject(SneakerService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController, { optional: true });

  @Output() pairAdded = new EventEmitter<SneakerI>();

  isOpen = signal<boolean>(false);
  mode = signal<'scan' | 'manual'>('scan');

  // Scan state
  scannedCode = signal<string | null>(null);
  isScanning = signal<boolean>(false);

  // Manual form state
  brand = signal<string>('Nike');
  model = signal<string>('');
  size = signal<number | string>('9.5');
  price = signal<number | string>('');
  condition = signal<string>('DS');
  isFavorite = signal<boolean>(false);
  imageUrl = signal<string | null>(null);

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    if (this.modalCtrl) {
      this.modalCtrl.dismiss().catch(() => {});
    }
  }

  setMode(selectedMode: 'scan' | 'manual') {
    this.mode.set(selectedMode);
  }

  onSegmentChange(event: any) {
    const val = event.detail.value;
    if (val === 'scan' || val === 'manual') {
      this.setMode(val);
    }
  }

  setCondition(cond: string) {
    this.condition.set(cond);
  }

  toggleFavorite() {
    this.isFavorite.update(v => !v);
  }

  async triggerHardwareScan() {
    this.isScanning.set(true);
    try {
      const code = await this.scannerService.startScan();
      if (code) {
        this.scannedCode.set(code);
        const toast = await this.toastController.create({
          message: `Código detectado: ${code}`,
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'Escaneo cancelado o código no detectado.',
          duration: 2000,
          color: 'warning',
          position: 'top'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error al escanear:', error);
    } finally {
      this.isScanning.set(false);
    }
  }

  addFromScan() {
    const code = this.scannedCode();
    if (!code) return;
    this.model.set(`Modelo SKU (${code})`);
    this.setMode('manual');
  }

  async savePair() {
    if (!this.model().trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa el modelo de la zapatilla.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const uid = this.authService.currentUser?.uid || 'collector-user';
    const docId = this.firestoreService.createIdDoc();

    const newPair: SneakerI = {
      id: docId,
      brand: this.brand(),
      model: this.model().trim(),
      size: Number(this.size()) || 9.5,
      marketValue: Number(this.price()) || 0,
      ownerId: uid,
      condition: this.condition(),
      isFavorite: this.isFavorite(),
      createdAt: new Date(),
      imageUrl: this.imageUrl() || undefined
    };

    try {
      // 1. Guardar en inventory/{uid}/pairs según requerimiento de arquitectura
      await this.firestoreService.createDocumentID(newPair, `inventory/${uid}/pairs`, docId);

      // 2. Sincronizar también con SneakerService general para actualizar inmediatamente el Dashboard
      await this.sneakerService.addSneaker(newPair);

      const toast = await this.toastController.create({
        message: 'Par agregado exitosamente a tu colección.',
        duration: 2500,
        color: 'success'
      });
      await toast.present();

      this.pairAdded.emit(newPair);
      this.resetForm();
      this.close();
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      const toast = await this.toastController.create({
        message: 'Hubo un error al guardar el par en Firestore.',
        duration: 2500,
        color: 'danger'
      });
      await toast.present();
    }
  }

  private resetForm() {
    this.brand.set('Nike');
    this.model.set('');
    this.size.set('9.5');
    this.price.set('');
    this.condition.set('DS');
    this.isFavorite.set(false);
    this.scannedCode.set(null);
    this.imageUrl.set(null);
  }
}
