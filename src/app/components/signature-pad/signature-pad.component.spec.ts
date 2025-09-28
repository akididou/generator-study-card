import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignaturePadComponent } from './signature-pad.component';

describe('SignaturePadComponent', () => {
  let component: SignaturePadComponent;
  let fixture: ComponentFixture<SignaturePadComponent>;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignaturePadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturePadComponent);
    component = fixture.componentInstance;

    // Mock canvas and context
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 400;
    mockCanvas.height = 120;
    mockContext = mockCanvas.getContext('2d')!;

    // Spy on canvas methods
    spyOn(mockContext, 'beginPath');
    spyOn(mockContext, 'moveTo');
    spyOn(mockContext, 'lineTo');
    spyOn(mockContext, 'stroke');
    spyOn(mockContext, 'clearRect');
    spyOn(mockContext, 'fillRect');
    spyOn(mockCanvas, 'toDataURL').and.returnValue('data:image/png;base64,mock-signature');

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize canvas after view init', () => {
    // Mock the ViewChild canvas
    component.signaturePad = { nativeElement: mockCanvas };
    spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);

    component.ngAfterViewInit();

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should start drawing on mouse down', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    const mouseEvent = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50
    });

    Object.defineProperty(mockCanvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0 })
    });

    (component as any).startDrawing(mouseEvent);

    expect((component as any).isDrawing).toBe(true);
    expect((component as any).lastX).toBe(50);
    expect((component as any).lastY).toBe(50);
  });

  it('should draw line on mouse move when drawing', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    // Start drawing
    (component as any).isDrawing = true;
    (component as any).lastX = 10;
    (component as any).lastY = 10;

    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 20,
      clientY: 20
    });

    Object.defineProperty(mockCanvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0 })
    });

    (component as any).draw(mouseEvent);

    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(10, 10);
    expect(mockContext.lineTo).toHaveBeenCalledWith(20, 20);
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('should not draw when not in drawing mode', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    (component as any).isDrawing = false;

    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 20,
      clientY: 20
    });

    (component as any).draw(mouseEvent);

    expect(mockContext.beginPath).not.toHaveBeenCalled();
  });

  it('should stop drawing on mouse up', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    (component as any).isDrawing = true;
    (component as any).isEmpty = false;

    spyOn(component.signatureChanged, 'emit');

    (component as any).stopDrawing();

    expect((component as any).isDrawing).toBe(false);
    expect(component.signatureChanged.emit).toHaveBeenCalled();
  });

  it('should clear signature and emit empty string', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    spyOn(component.signatureChanged, 'emit');

    component.clear();

    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 400, 120);
    expect(mockContext.fillRect).toHaveBeenCalled();
    expect((component as any).isEmpty).toBe(true);
    expect(component.signatureChanged.emit).toHaveBeenCalledWith('');
  });

  it('should return signature data when not empty', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    (component as any).isEmpty = false;

    const result = component.getSignatureData();

    expect(result).toBe('data:image/png;base64,mock-signature');
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('should return empty string when signature is empty', () => {
    (component as any).isEmpty = true;

    const result = component.getSignatureData();

    expect(result).toBe('');
  });

  it('should correctly report if signature is empty', () => {
    (component as any).isEmpty = true;
    expect(component.isSignatureEmpty()).toBe(true);

    (component as any).isEmpty = false;
    expect(component.isSignatureEmpty()).toBe(false);
  });

  it('should set line width', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    component.setLineWidth(3);

    expect((component as any).lineWidth).toBe(3);
    expect(mockContext.lineWidth).toBe(3);
  });

  it('should set stroke color', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    component.setStrokeColor('#ff0000');

    expect((component as any).strokeStyle).toBe('#ff0000');
    expect(mockContext.strokeStyle).toBe('#ff0000');
  });

  it('should handle touch events', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    const touchEvent = new TouchEvent('touchstart', {
      touches: [new Touch({
        identifier: 1,
        target: mockCanvas,
        clientX: 30,
        clientY: 40
      })]
    });

    Object.defineProperty(mockCanvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0 })
    });

    spyOn(touchEvent, 'preventDefault');

    (component as any).handleTouch(touchEvent);

    expect(touchEvent.preventDefault).toHaveBeenCalled();
    expect((component as any).isDrawing).toBe(true);
    expect((component as any).lastX).toBe(30);
    expect((component as any).lastY).toBe(40);
  });

  it('should emit signature data when drawing ends', () => {
    component.signaturePad = { nativeElement: mockCanvas };
    component.ngAfterViewInit();

    (component as any).isEmpty = false;
    spyOn(component.signatureChanged, 'emit');

    (component as any).emitSignature();

    expect(component.signatureChanged.emit).toHaveBeenCalledWith('data:image/png;base64,mock-signature');
  });

  it('should not emit when signature is empty', () => {
    (component as any).isEmpty = true;
    spyOn(component.signatureChanged, 'emit');

    (component as any).emitSignature();

    expect(component.signatureChanged.emit).not.toHaveBeenCalled();
  });
});