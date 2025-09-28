import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Student, StudentCard } from './models/student.model';

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

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).title()).toBe('Générateur de Carte Étudiante');
  });

  it('should initialize with no student card', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.studentCard).toBeNull();
  });

  it('should create student card when student is submitted', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const mockStudent: Student = {
      nom: 'DEROUET',
      prenom: 'MARTIN',
      dateNaissance: '1995-12-02',
      photo: 'data:image/jpeg;base64,mock-photo'
    };

    app.onStudentSubmitted(mockStudent);

    expect(app.studentCard).toBeTruthy();
    expect(app.studentCard!.nom).toBe('DEROUET');
    expect(app.studentCard!.prenom).toBe('MARTIN');
    expect(app.studentCard!.dateNaissance).toBe('1995-12-02');
    expect(app.studentCard!.photo).toBe('data:image/jpeg;base64,mock-photo');
  });

  it('should generate correct validity period', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const mockStudent: Student = {
      nom: 'DEROUET',
      prenom: 'MARTIN',
      dateNaissance: '1995-12-02',
      photo: 'data:image/jpeg;base64,mock-photo'
    };

    const currentYear = new Date().getFullYear();
    app.onStudentSubmitted(mockStudent);

    expect(app.studentCard!.validite).toBe(`${currentYear}-${currentYear + 1}`);
  });

  it('should reset student card when creating new card', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // First create a student card
    const mockStudent: Student = {
      nom: 'DEROUET',
      prenom: 'MARTIN',
      dateNaissance: '1995-12-02',
      photo: 'data:image/jpeg;base64,mock-photo'
    };

    app.onStudentSubmitted(mockStudent);
    expect(app.studentCard).toBeTruthy();

    // Then reset
    app.onNewCard();
    expect(app.studentCard).toBeNull();
  });

  it('should render title in the template', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Générateur de Carte Étudiante');
  });
});
