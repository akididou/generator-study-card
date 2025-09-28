import { TestBed } from '@angular/core/testing';
import { SignatureService } from './signature.service';

describe('SignatureService', () => {
  let service: SignatureService;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignatureService);

    // Create a mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 60;

    // Get the context
    ctx = canvas.getContext('2d')!;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate signature on canvas', () => {
    const testName = 'Martin Derouet';

    // Spy on canvas context methods
    spyOn(ctx, 'clearRect');
    spyOn(ctx, 'beginPath');
    spyOn(ctx, 'stroke');

    service.generateRealisticSignature(canvas, testName);

    // Verify that canvas methods were called
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 200, 60);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('should extract initials correctly', () => {
    // Access private method for testing
    const extractInitials = (service as any).extractInitials.bind(service);

    expect(extractInitials('Martin Derouet')).toBe('MD');
    expect(extractInitials('Jean-Pierre Dupont')).toBe('JD');
    expect(extractInitials('Marie')).toBe('M');
    expect(extractInitials('Jean Claude Van Damme')).toBe('JCVD');
  });

  it('should use different colors for signature', () => {
    const testName = 'Test User';

    spyOn(ctx, 'stroke');
    spyOn(Math, 'random').and.returnValues(0.1, 0.5, 0.9); // Control randomness

    service.generateRealisticSignature(canvas, testName);

    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('should handle empty name gracefully', () => {
    expect(() => {
      service.generateRealisticSignature(canvas, '');
    }).not.toThrow();
  });

  it('should handle single character name', () => {
    expect(() => {
      service.generateRealisticSignature(canvas, 'A');
    }).not.toThrow();
  });

  it('should create different signatures for different names', () => {
    const name1 = 'Alice Wonderland';
    const name2 = 'Bob Builder';

    // Generate first signature
    service.generateRealisticSignature(canvas, name1);
    const imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear and generate second signature
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    service.generateRealisticSignature(canvas, name2);
    const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Signatures should be different
    expect(imageData1.data).not.toEqual(imageData2.data);
  });
});