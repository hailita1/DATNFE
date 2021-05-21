import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUserOrderComponent } from './item-user-order.component';

describe('ItemUserOrderComponent', () => {
  let component: ItemUserOrderComponent;
  let fixture: ComponentFixture<ItemUserOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUserOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUserOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
