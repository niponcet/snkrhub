import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  /**
   * Solicita permisos de cámara y ejecuta el escáner de código de barras/QR.
   * @returns El valor escaneado (código de barras o QR) o null si fue cancelado/falló.
   */
  async startScan(): Promise<string | null> {
    try {
      // 1. Verificar si el dispositivo soporta el escáner
      const { supported } = await BarcodeScanner.isSupported();
      if (!supported) {
        console.warn('El escáner de código de barras no es soportado en esta plataforma.');
        return null;
      }

      // 2. Verificar y solicitar permisos de cámara
      const permissionStatus = await BarcodeScanner.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        const requestStatus = await BarcodeScanner.requestPermissions();
        if (requestStatus.camera !== 'granted') {
          console.warn('Permiso de cámara denegado por el usuario.');
          return null;
        }
      }

      // 3. Iniciar el escaneo
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes && barcodes.length > 0) {
        const scannedCode = barcodes[0].rawValue || barcodes[0].displayValue || null;
        return scannedCode;
      }

      return null;
    } catch (error) {
      console.error('Error al ejecutar el escáner de código de barras:', error);
      return null;
    }
  }
}
