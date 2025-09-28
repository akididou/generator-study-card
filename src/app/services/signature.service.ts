import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor() { }

  generateRealisticSignature(canvas: HTMLCanvasElement, name: string): void {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      try {
        // Calculer les dimensions pour centrer et ajuster la signature
        const aspectRatio = img.width / img.height;
        let drawWidth = canvas.width * 0.8; // Réduire un peu la taille
        let drawHeight = canvas.height * 0.8;

        if (aspectRatio > drawWidth / drawHeight) {
          drawHeight = drawWidth / aspectRatio;
        } else {
          drawWidth = drawHeight * aspectRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      } catch (error) {
        console.error('Erreur lors du dessin de la signature:', error);
        // Fallback: dessiner un texte simple
        this.drawFallbackSignature(ctx, name, canvas.width, canvas.height);
      }
    };

    img.onerror = () => {
      console.error('Erreur lors du chargement de l\'image de signature');
      // Fallback: dessiner un texte simple
      this.drawFallbackSignature(ctx, name, canvas.width, canvas.height);
    };

    img.src = 'assets/img/sign.png';
  }

  private drawFallbackSignature(ctx: CanvasRenderingContext2D, name: string, width: number, height: number): void {
    ctx.font = '14px cursive';
    ctx.fillStyle = '#1a237e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, width / 2, height / 2);
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

}