import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationdasboardComponent } from './navigationdasboard.component';

describe('NavigationdasboardComponent', () => {
  let component: NavigationdasboardComponent;
  let fixture: ComponentFixture<NavigationdasboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationdasboardComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationdasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
