import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgCptcodesComponent } from './ecg-cptcodes.component';

describe('EcgCptcodesComponent', () => {
  let component: EcgCptcodesComponent;
  let fixture: ComponentFixture<EcgCptcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcgCptcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgCptcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
