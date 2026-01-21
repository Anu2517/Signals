import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeachers } from './add-teachers';

describe('AddTeachers', () => {
  let component: AddTeachers;
  let fixture: ComponentFixture<AddTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeachers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
