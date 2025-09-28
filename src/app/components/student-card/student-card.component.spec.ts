import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentCardComponent } from './student-card.component';
import { SignatureService } from '../../services/signature.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { StudentCard } from '../../models/student.model';

describe('StudentCardComponent', () => {
  let component: StudentCardComponent;
  let fixture: ComponentFixture<StudentCardComponent>;
  let mockSignatureService: jasmine.SpyObj<SignatureService>;
  let mockPdfExportService: jasmine.SpyObj<PdfExportService>;

  const mockStudentData: StudentCard = {
    nom: 'DEROUET',
    prenom: 'MARTIN',
    dateNaissance: '1995-12-02',
    photo: 'data:image/jpeg;base64,mock-photo',
    validite: '2025-2026',
    signature: ''
  };

  beforeEach(async () => {
    const signatureSpy = jasmine.createSpyObj('SignatureService', ['generateRealisticSignature']);
    const pdfSpy = jasmine.createSpyObj('PdfExportService', ['exportCardToPdf', 'exportCardToPng']);

    await TestBed.configureTestingModule({
      imports: [StudentCardComponent],
      providers: [
        { provide: SignatureService, useValue: signatureSpy },
        { provide: PdfExportService, useValue: pdfSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardComponent);
    component = fixture.componentInstance;
    mockSignatureService = TestBed.inject(SignatureService) as jasmine.SpyObj<SignatureService>;
    mockPdfExportService = TestBed.inject(PdfExportService) as jasmine.SpyObj<PdfExportService>;

    component.studentData = mockStudentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate signature after view init', () => {
    component.ngAfterViewInit();

    expect(mockSignatureService.generateRealisticSignature).toHaveBeenCalled();
  });

  it('should not generate signature if no student data', () => {
    component.studentData = null;
    component.ngAfterViewInit();

    expect(mockSignatureService.generateRealisticSignature).not.toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('1995-12-02');
    expect(formattedDate).toBe('02/12/1995');
  });

  it('should export to PDF successfully', async () => {
    mockPdfExportService.exportCardToPdf.and.returnValue(Promise.resolve());

    await component.exportToPdf();

    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBe('');
    expect(mockPdfExportService.exportCardToPdf).toHaveBeenCalled();
  });

  it('should handle PDF export errors', async () => {
    const errorMessage = 'PDF export failed';
    mockPdfExportService.exportCardToPdf.and.returnValue(Promise.reject(new Error(errorMessage)));

    await component.exportToPdf();

    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBe(errorMessage);
  });

  it('should export to PNG successfully', async () => {
    mockPdfExportService.exportCardToPng.and.returnValue(Promise.resolve());

    await component.exportToPng();

    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBe('');
    expect(mockPdfExportService.exportCardToPng).toHaveBeenCalled();
  });

  it('should handle PNG export errors', async () => {
    const errorMessage = 'PNG export failed';
    mockPdfExportService.exportCardToPng.and.returnValue(Promise.reject(new Error(errorMessage)));

    await component.exportToPng();

    expect(component.isExporting).toBeFalse();
    expect(component.exportError).toBe(errorMessage);
  });

  it('should regenerate signature', () => {
    component.regenerateSignature();

    expect(mockSignatureService.generateRealisticSignature).toHaveBeenCalled();
  });

  it('should display student information correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('DEROUET');
    expect(compiled.textContent).toContain('MARTIN');
    expect(compiled.textContent).toContain('02/12/1995');
    expect(compiled.textContent).toContain('2025-2026');
  });

  it('should show student photo', () => {
    const img = fixture.nativeElement.querySelector('.student-photo');
    expect(img).toBeTruthy();
    expect(img.src).toBe(mockStudentData.photo);
  });

  it('should render export buttons', () => {
    const compiled = fixture.nativeElement;
    const pdfButton = compiled.querySelector('button');
    const buttons = compiled.querySelectorAll('button');

    expect(buttons.length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('Exporter en PDF');
  });

  it('should disable buttons when exporting', () => {
    component.isExporting = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.disabled).toBeTrue();
    });
  });

  it('should show error message when export fails', () => {
    component.exportError = 'Export failed';
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('Export failed');
  });

  it('should not render card when no student data', () => {
    component.studentData = null;
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.student-card');
    expect(cardElement).toBeFalsy();
  });

  it('should call export with correct filename', async () => {
    mockPdfExportService.exportCardToPdf.and.returnValue(Promise.resolve());

    await component.exportToPdf();

    const expectedFilename = 'carte_etudiant_MARTIN_DEROUET.pdf';
    expect(mockPdfExportService.exportCardToPdf).toHaveBeenCalledWith(
      jasmine.any(Object),
      expectedFilename
    );
  });
});