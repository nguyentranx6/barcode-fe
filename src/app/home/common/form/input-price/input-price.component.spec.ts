import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPriceComponent } from './input-price.component';

describe('InputPriceComponent', () => {
  let component: InputPriceComponent;
  let fixture: ComponentFixture<InputPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
