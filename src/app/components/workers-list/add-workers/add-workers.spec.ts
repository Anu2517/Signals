import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkers } from './add-workers';

describe('AddWorkers', () => {
  let component: AddWorkers;
  let fixture: ComponentFixture<AddWorkers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
