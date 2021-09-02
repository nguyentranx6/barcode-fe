import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailserveSettingFormComponent } from './mailserve-setting-form.component';

describe('MailserveSettingFormComponent', () => {
  let component: MailserveSettingFormComponent;
  let fixture: ComponentFixture<MailserveSettingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailserveSettingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailserveSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
