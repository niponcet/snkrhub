import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  constructor() { }

  getDocument<tipo>(enlace: string): Promise<tipo> {
    const document = doc(this.firestore, enlace) as DocumentReference<tipo, any>;
    return getDoc(document).then(docSnapshot => docSnapshot.data() as tipo);
  }
  

  getDocumentChanges<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace);
    return docData(document) as Observable<tipo>;
  }

  getCollectionChanges<tipo>(path: string): Observable<tipo[]> {
    const itemCollection = collection(this.firestore, path);
    return collectionData(itemCollection) as Observable<tipo[]>;
  }
  

  createDocument(data: any, enlace: string) {
    const document = doc(this.firestore, enlace);
    return setDoc(document, data);
  }

  createDocumentID(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  async updateDocumentID(data: any, enlace: string, idDoc: string) {
    try {
      const document = doc(this.firestore, `${enlace}/${idDoc}`);
      return updateDoc(document, data);
    } catch (error) {
      console.error('Error in Firestore update:', error);
      throw error; 
    }
  }
  

  deleteDocumentID(enlace:string, idDoc:string){
    const document = doc(this.firestore,`${enlace}/${idDoc}` );
    return deleteDoc(document);
  }

  deleteDocFromRef(ref:any){
    return deleteDoc(ref)
  }

  createIdDoc() {
    return uuidv4();
  }
}
