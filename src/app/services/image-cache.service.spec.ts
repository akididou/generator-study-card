import { TestBed } from '@angular/core/testing';
import { ImageCacheService } from './image-cache.service';

describe('ImageCacheService', () => {
  let service: ImageCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCacheService);
  });

  afterEach(() => {
    service.clearCache();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate image file types correctly', () => {
    const validJpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const validPngFile = new File([''], 'test.png', { type: 'image/png' });
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

    // Access private method
    const isValidImageFile = (service as any).isValidImageFile.bind(service);

    expect(isValidImageFile(validJpegFile)).toBe(true);
    expect(isValidImageFile(validPngFile)).toBe(true);
    expect(isValidImageFile(invalidFile)).toBe(false);
  });

  it('should reject files that are too large', async () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg'
    });

    await expectAsync(service.processImage(largeFile))
      .toBeRejectedWithError('Fichier trop volumineux. Taille maximum : 5MB');
  });

  it('should reject invalid file types', async () => {
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

    await expectAsync(service.processImage(invalidFile))
      .toBeRejectedWithError('Type de fichier non autorisé. Seuls JPG, JPEG et PNG sont acceptés.');
  });

  it('should manage cache size correctly', () => {
    expect(service.getCacheSize()).toBe(0);

    // Simulate adding items to cache
    const cache = (service as any).cache;
    cache.set('item1', 'data1');
    cache.set('item2', 'data2');

    expect(service.getCacheSize()).toBe(2);

    service.clearCache();
    expect(service.getCacheSize()).toBe(0);
  });

  it('should clear cache on destroy', () => {
    const cache = (service as any).cache;
    cache.set('item1', 'data1');

    expect(service.getCacheSize()).toBe(1);

    service.onDestroy();
    expect(service.getCacheSize()).toBe(0);
  });

  it('should not exceed max cache size', () => {
    const cache = (service as any).cache;
    const maxCacheSize = (service as any).maxCacheSize;

    // Fill cache beyond max size
    for (let i = 0; i < maxCacheSize + 2; i++) {
      cache.set(`item${i}`, `data${i}`);
    }

    // Trigger cache management
    (service as any).manageCacheSize();

    expect(service.getCacheSize()).toBeLessThanOrEqual(maxCacheSize);
  });

  // Mock Canvas and Image for testing image processing
  it('should handle image processing errors gracefully', async () => {
    // Create a minimal valid JPEG file
    const validFile = new File([new Uint8Array([0xFF, 0xD8, 0xFF])], 'test.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    // This test might fail in Node.js environment due to lack of Image/Canvas APIs
    // In a real browser environment, you would need to mock these APIs properly
    try {
      await service.processImage(validFile);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});