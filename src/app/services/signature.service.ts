import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor() { }

  generateRealisticSignature(canvas: HTMLCanvasElement, name: string): void {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuration pour un rendu plus naturel
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';

    // Variation de l'épaisseur du trait pour simuler la pression
    const baseLineWidth = 1.5;
    const maxLineWidth = 3;

    // Couleur légèrement variable (encre bleue/noire)
    const colors = ['#1a237e', '#0d47a1', '#1565c0', '#283593'];
    const mainColor = colors[Math.floor(Math.random() * colors.length)];

    // Génération basée sur les initiales du nom
    const initials = this.extractInitials(name);
    this.drawRealisticSignature(ctx, initials, canvas.width, canvas.height, baseLineWidth, maxLineWidth, mainColor);
  }

  displayManualSignature(canvas: HTMLCanvasElement, signatureData: string): void {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      // Calculer les dimensions pour centrer et ajuster la signature
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (aspectRatio > canvas.width / canvas.height) {
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawWidth = drawHeight * aspectRatio;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };
    img.src = signatureData;
  }

  private extractInitials(name: string): string {
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  private drawRealisticSignature(
    ctx: CanvasRenderingContext2D,
    initials: string,
    width: number,
    height: number,
    baseLineWidth: number,
    maxLineWidth: number,
    color: string
  ): void {
    const centerY = height / 2;
    const startX = 10;
    const availableWidth = width - 20;

    let currentX = startX;
    const letterSpacing = availableWidth / (initials.length + 1);

    for (let i = 0; i < initials.length; i++) {
      const letter = initials[i];
      currentX += this.drawLetter(ctx, letter, currentX, centerY, letterSpacing * 0.8, baseLineWidth, maxLineWidth, color);
      currentX += letterSpacing * 0.3; // Espacement entre lettres
    }

    // Ajouter un paraphe décoratif
    this.addFlourish(ctx, currentX + 10, centerY, baseLineWidth, maxLineWidth, color);
  }

  private drawLetter(
    ctx: CanvasRenderingContext2D,
    letter: string,
    startX: number,
    centerY: number,
    maxWidth: number,
    baseLineWidth: number,
    maxLineWidth: number,
    color: string
  ): number {
    ctx.strokeStyle = color;

    // Variations pour chaque lettre
    const variation = (Math.random() - 0.5) * 0.3;
    const heightVariation = (Math.random() - 0.5) * 8;
    const actualCenterY = centerY + heightVariation;

    switch (letter.toUpperCase()) {
      case 'A':
        return this.drawA(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'B':
        return this.drawB(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'C':
        return this.drawC(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'D':
        return this.drawD(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'E':
        return this.drawE(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'F':
        return this.drawF(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'G':
        return this.drawG(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'H':
        return this.drawH(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'I':
        return this.drawI(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'J':
        return this.drawJ(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'K':
        return this.drawK(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'L':
        return this.drawL(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'M':
        return this.drawM(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'N':
        return this.drawN(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'O':
        return this.drawO(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'P':
        return this.drawP(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'Q':
        return this.drawQ(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'R':
        return this.drawR(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'S':
        return this.drawS(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'T':
        return this.drawT(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'U':
        return this.drawU(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'V':
        return this.drawV(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'W':
        return this.drawW(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'X':
        return this.drawX(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'Y':
        return this.drawY(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      case 'Z':
        return this.drawZ(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
      default:
        return this.drawGeneric(ctx, startX, actualCenterY, maxWidth, baseLineWidth, maxLineWidth, variation);
    }
  }

  private drawWithPressureVariation(
    ctx: CanvasRenderingContext2D,
    points: {x: number, y: number, pressure?: number}[],
    baseLineWidth: number,
    maxLineWidth: number
  ): void {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const pressure = point.pressure || (0.3 + Math.random() * 0.7);
      const lineWidth = baseLineWidth + (maxLineWidth - baseLineWidth) * pressure;

      ctx.lineWidth = lineWidth + (Math.random() - 0.5) * 0.5; // Micro-variations

      // Ajouter du tremblement naturel
      const trembleX = (Math.random() - 0.5) * 0.8;
      const trembleY = (Math.random() - 0.5) * 0.8;

      ctx.lineTo(point.x + trembleX, point.y + trembleY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(point.x + trembleX, point.y + trembleY);
    }
  }

  // Méthodes pour dessiner chaque lettre (exemples pour quelques lettres)
  private drawA(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    const points = [
      {x: x, y: y + 10 + variation * 5},
      {x: x + width/2, y: y - 15 + variation * 3, pressure: 0.8},
      {x: x + width, y: y + 10 + variation * 5},
      {x: x + width * 0.2, y: y + 2},
      {x: x + width * 0.8, y: y + 2}
    ];

    this.drawWithPressureVariation(ctx, points.slice(0, 3), baseLineWidth, maxLineWidth);
    this.drawWithPressureVariation(ctx, points.slice(3), baseLineWidth, maxLineWidth);

    return width;
  }

  private drawM(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    const points = [
      {x: x, y: y + 15 + variation * 3},
      {x: x, y: y - 15 + variation * 2, pressure: 0.9},
      {x: x + width/4, y: y + 5, pressure: 0.6},
      {x: x + width/2, y: y - 10 + variation, pressure: 0.8},
      {x: x + width*3/4, y: y + 5, pressure: 0.6},
      {x: x + width, y: y - 15 + variation * 2, pressure: 0.9},
      {x: x + width, y: y + 15 + variation * 3}
    ];

    this.drawWithPressureVariation(ctx, points, baseLineWidth, maxLineWidth);
    return width;
  }

  private drawS(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    ctx.beginPath();
    ctx.lineWidth = baseLineWidth + Math.random() * (maxLineWidth - baseLineWidth);

    // Courbe S stylisée
    ctx.moveTo(x + width * 0.8, y - 10 + variation);
    ctx.quadraticCurveTo(x + width * 0.2, y - 15 + variation, x + width * 0.3, y + variation);
    ctx.quadraticCurveTo(x + width * 0.7, y + 5 + variation, x + width * 0.2, y + 15 + variation);

    ctx.stroke();
    return width;
  }

  // Méthodes génériques pour les autres lettres
  private drawB(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawC(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawD(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawE(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawF(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawG(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawH(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawI(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawJ(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawK(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawL(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawN(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawO(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawP(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawQ(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawR(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawT(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawU(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawV(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawW(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawX(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawY(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawZ(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    return this.drawGeneric(ctx, x, y, width, baseLineWidth, maxLineWidth, variation);
  }

  private drawGeneric(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, baseLineWidth: number, maxLineWidth: number, variation: number): number {
    // Signature générique en forme de gribouillis cursif
    const points = [
      {x: x, y: y + variation * 5},
      {x: x + width * 0.3, y: y - 10 + variation * 2, pressure: 0.7},
      {x: x + width * 0.7, y: y + 5 + variation * 3, pressure: 0.5},
      {x: x + width, y: y - 5 + variation, pressure: 0.8}
    ];

    this.drawWithPressureVariation(ctx, points, baseLineWidth, maxLineWidth);
    return width;
  }

  private addFlourish(ctx: CanvasRenderingContext2D, x: number, y: number, baseLineWidth: number, maxLineWidth: number, color: string): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = baseLineWidth;

    // Paraphe décoratif
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 15, y - 8, x + 25, y + 2);
    ctx.quadraticCurveTo(x + 35, y + 12, x + 20, y + 8);
    ctx.stroke();

    // Petit point décoratif
    ctx.beginPath();
    ctx.arc(x + 30, y - 5, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}