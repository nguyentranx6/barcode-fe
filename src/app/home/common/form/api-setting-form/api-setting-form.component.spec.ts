import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSettingFormComponent } from './api-setting-form.component';

describe('ApiSettingFormComponent', () => {
  let component: ApiSettingFormComponent;
  let fixture: ComponentFixture<ApiSettingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiSettingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
