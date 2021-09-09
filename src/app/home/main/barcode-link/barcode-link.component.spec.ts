import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeLinkComponent } from './barcode-link.component';

describe('BarcodeLinkComponent', () => {
  let component: BarcodeLinkComponent;
  let fixture: ComponentFixture<BarcodeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
