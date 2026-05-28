import { describe, beforeEach, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.company-name')?.textContent).toContain('CROWN MANUFACTURING');
  });

  it('should expand rows when toggle is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    // Verify initially collapsed
    expect(app.isExpanded('Consultancy')).toBe(false);
    let childRow = fixture.nativeElement.querySelector('.child-row');
    expect(childRow).toBeNull(); // No child rows should be in DOM initially

    // Click parent row to expand
    const parentRow = fixture.nativeElement.querySelector('.parent-row') as HTMLElement;
    expect(parentRow).toBeTruthy();
    parentRow.click();
    fixture.detectChanges();

    // Verify expanded
    expect(app.isExpanded('Consultancy')).toBe(true);
    childRow = fixture.nativeElement.querySelector('.child-row');
    expect(childRow).toBeTruthy(); // Child rows should now be rendered!
  });

  it('should expand rows when expand button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expandButton = fixture.nativeElement.querySelector('.btn-expand') as HTMLButtonElement;
    expect(expandButton).toBeTruthy();

    expandButton.click();
    fixture.detectChanges();

    expect(app.isExpanded('Consultancy')).toBe(true);
    const updatedExpandButton = fixture.nativeElement.querySelector('.btn-expand') as HTMLButtonElement;
    expect(updatedExpandButton.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.child-row')).toBeTruthy();
  });
});
