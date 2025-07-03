import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBookings } from './recent-bookings';

describe('RecentBookings', () => {
  let component: RecentBookings;
  let fixture: ComponentFixture<RecentBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
