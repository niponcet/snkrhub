import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../core/services/firestore.service';
import { SneakerI } from '../../core/models/sneakers.models';

@Component({
  selector: 'app-sneaker-details',
  templateUrl: './sneaker-details.page.html',
  styleUrls: ['./sneaker-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SneakerDetailsPage implements OnInit {
  sneaker$?: Observable<SneakerI | null>;
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.sneaker$ = this.firestoreService.getDocumentChanges<SneakerI>(`Sneakers/${this.id}`);
    }
  }
}
