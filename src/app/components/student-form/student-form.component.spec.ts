import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StudentFormComponent } from './student-form.component';
import { ImageCacheService } from '../../services/image-cache.service';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let mockImageCacheService: jasmine.SpyObj<ImageCacheService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ImageCacheService', ['processImage']);

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, FormsModule],
      providers: [
        { provide: ImageCacheService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    mockImageCacheService = TestBed.inject(ImageCacheService) as jasmine.SpyObj<ImageCacheService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty student data', () => {
    expect(component.student.nom).toBe('');
    expect(component.student.prenom).toBe('');
    expect(component.student.dateNaissance).toBe('');
    expect(component.student.photo).toBe('');
    expect(component.selectedFile).toBeNull();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should validate form correctly', () => {
    // Form should be invalid initially
    expect((component as any).isFormValid()).toBeFalse();

    // Fill in all required fields
    component.student.nom = 'Derouet';
    component.student.prenom = 'Martin';
    component.student.dateNaissance = '1995-12-02';
    component.selectedFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    expect((component as any).isFormValid()).toBeTrue();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = {
      target: { files: [file] }
    };

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when form is invalid on submit', async () => {
    await component.onSubmit();

    expect(component.errorMessage).toBe('Veuillez remplir tous les champs requis');
    expect(component.isLoading).toBeFalse();
  });

  it('should process valid form submission', async () => {
    // Setup valid form data
    component.student.nom = 'Derouet';
    component.student.prenom = 'Martin';
    component.student.dateNaissance = '1995-12-02';
    component.selectedFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const mockProcessedImage = 'data:image/jpeg;base64,processed-image';
    mockImageCacheService.processImage.and.returnValue(Promise.resolve(mockProcessedImage));

    spyOn(component.studentSubmitted, 'emit');

    await component.onSubmit();

    expect(mockImageCacheService.processImage).toHaveBeenCalledWith(component.selectedFile);
    expect(component.student.photo).toBe(mockProcessedImage);
    expect(component.studentSubmitted.emit).toHaveBeenCalledWith(component.student as any);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle image processing errors', async () => {
    // Setup valid form data
    component.student.nom = 'Derouet';
    component.student.prenom = 'Martin';
    component.student.dateNaissance = '1995-12-02';
    component.selectedFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    const errorMessage = 'Image processing failed';
    mockImageCacheService.processImage.and.returnValue(Promise.reject(new Error(errorMessage)));

    await component.onSubmit();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBeFalse();
  });

  it('should reset form correctly', () => {
    // Set some data
    component.student.nom = 'Test';
    component.student.prenom = 'User';
    component.selectedFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.errorMessage = 'Some error';

    // Mock file input
    const mockFileInput = document.createElement('input');
    mockFileInput.type = 'file';
    mockFileInput.value = 'test.jpg';
    spyOn(document, 'querySelector').and.returnValue(mockFileInput);

    component.resetForm();

    expect(component.student.nom).toBe('');
    expect(component.student.prenom).toBe('');
    expect(component.student.dateNaissance).toBe('');
    expect(component.student.photo).toBe('');
    expect(component.selectedFile).toBeNull();
    expect(component.errorMessage).toBe('');
    expect(mockFileInput.value).toBe('');
  });

  it('should return today\'s date in correct format', () => {
    const today = new Date();
    const expectedDate = today.toISOString().split('T')[0];

    expect(component.getTodayDate()).toBe(expectedDate);
  });

  it('should render form elements correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('input[name="nom"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="prenom"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="dateNaissance"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="photo"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should disable submit button when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should show error message when present', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('Test error message');
  });
});