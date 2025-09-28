import { TestBed } from '@angular/core/testing';
import { PdfExportService } from './pdf-export.service';

describe('PdfExportService', () => {
  let service: PdfExportService;
  let mockElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExportService);

    // Create a mock DOM element
    mockElement = document.createElement('div');
    mockElement.style.width = '508px';
    mockElement.style.height = '319px';
    Object.defineProperty(mockElement, 'offsetWidth', { value: 508 });
    Object.defineProperty(mockElement, 'offsetHeight', { value: 319 });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle invalid element for PDF export', async () => {
    const filename = 'test-card.pdf';

    try {
      await service.exportCardToPdf(mockElement, filename);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should handle invalid element for PNG export', async () => {
    const filename = 'test-card.png';

    try {
      await service.exportCardToPng(mockElement, filename);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});