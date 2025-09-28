import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
  @ViewChild('signaturePad', { static: false }) signaturePad!: ElementRef<HTMLCanvasElement>;
  @Output() signatureChanged = new EventEmitter<string>();

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private isEmpty = true;

  // Paramètres de dessin
  private lineWidth = 2;
  private strokeStyle = '#1a237e';
  private lineCap: CanvasLineCap = 'round';
  private lineJoin: CanvasLineJoin = 'round';

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private initCanvas(): void {
    const canvas = this.signaturePad.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Configuration du canvas
    this.setupCanvas();

    // Ajout des event listeners
    this.addEventListeners();
  }

  private setupCanvas(): void {
    const canvas = this.signaturePad.nativeElement;

    // Configuration des propriétés de dessin
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;

    // Initialiser avec un fond blanc pour l'export
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Remettre la couleur de trait
    this.ctx.strokeStyle = this.strokeStyle;
  }

  private addEventListeners(): void {
    const canvas = this.signaturePad.nativeElement;

    // Events pour souris
    canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    canvas.addEventListener('mousemove', this.draw.bind(this));
    canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

    // Events pour touch (mobile)
    canvas.addEventListener('touchstart', this.handleTouch.bind(this));
    canvas.addEventListener('touchmove', this.handleTouch.bind(this));
    canvas.addEventListener('touchend', this.stopDrawing.bind(this));
  }

  private removeEventListeners(): void {
    const canvas = this.signaturePad.nativeElement;
    if (canvas) {
      canvas.removeEventListener('mousedown', this.startDrawing.bind(this));
      canvas.removeEventListener('mousemove', this.draw.bind(this));
      canvas.removeEventListener('mouseup', this.stopDrawing.bind(this));
      canvas.removeEventListener('mouseout', this.stopDrawing.bind(this));
      canvas.removeEventListener('touchstart', this.handleTouch.bind(this));
      canvas.removeEventListener('touchmove', this.handleTouch.bind(this));
      canvas.removeEventListener('touchend', this.stopDrawing.bind(this));
    }
  }

  private startDrawing(e: MouseEvent): void {
    this.isDrawing = true;
    const rect = this.signaturePad.nativeElement.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  private draw(e: MouseEvent): void {
    if (!this.isDrawing) return;

    const rect = this.signaturePad.nativeElement.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.drawLine(this.lastX, this.lastY, currentX, currentY);

    this.lastX = currentX;
    this.lastY = currentY;
    this.isEmpty = false;
  }

  private handleTouch(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];

    if (e.type === 'touchstart') {
      this.isDrawing = true;
      const rect = this.signaturePad.nativeElement.getBoundingClientRect();
      this.lastX = touch.clientX - rect.left;
      this.lastY = touch.clientY - rect.top;
    } else if (e.type === 'touchmove' && this.isDrawing) {
      const rect = this.signaturePad.nativeElement.getBoundingClientRect();
      const currentX = touch.clientX - rect.left;
      const currentY = touch.clientY - rect.top;

      this.drawLine(this.lastX, this.lastY, currentX, currentY);

      this.lastX = currentX;
      this.lastY = currentY;
      this.isEmpty = false;
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private stopDrawing(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.emitSignature();
    }
  }

  clear(): void {
    const canvas = this.signaturePad.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Remettre le fond blanc
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.strokeStyle = this.strokeStyle;

    this.isEmpty = true;
    this.signatureChanged.emit('');
  }

  private emitSignature(): void {
    if (!this.isEmpty) {
      const dataURL = this.signaturePad.nativeElement.toDataURL('image/png');
      this.signatureChanged.emit(dataURL);
    }
  }

  getSignatureData(): string {
    if (this.isEmpty) {
      return '';
    }
    return this.signaturePad.nativeElement.toDataURL('image/png');
  }

  isSignatureEmpty(): boolean {
    return this.isEmpty;
  }

  // Méthodes pour changer les paramètres de dessin
  setLineWidth(width: number): void {
    this.lineWidth = width;
    this.ctx.lineWidth = width;
  }

  setStrokeColor(color: string): void {
    this.strokeStyle = color;
    this.ctx.strokeStyle = color;
  }
}