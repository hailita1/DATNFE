import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChagepasswordComponent } from './chagepassword.component';

describe('ChagepasswordComponent', () => {
  let component: ChagepasswordComponent;
  let fixture: ComponentFixture<ChagepasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChagepasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChagepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
