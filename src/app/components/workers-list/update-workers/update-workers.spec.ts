import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkers } from './update-workers';

describe('UpdateWorkers', () => {
  let component: UpdateWorkers;
  let fixture: ComponentFixture<UpdateWorkers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateWorkers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateWorkers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
