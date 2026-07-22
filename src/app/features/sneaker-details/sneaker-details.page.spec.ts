import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SneakerDetailsPage } from './sneaker-details.page';

describe('SneakerDetailsPage', () => {
  let component: SneakerDetailsPage;
  let fixture: ComponentFixture<SneakerDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SneakerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
