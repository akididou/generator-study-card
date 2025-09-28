import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  async exportCardToPdf(cardElement: HTMLElement, filename: string): Promise<void> {
    try {
      // Configuration pour html2canvas
      const canvas = await html2canvas(cardElement, {
        scale: 3, // Haute résolution
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight
      });

      // Créer le PDF au format carte (85.60 × 53.98 mm - format CR80)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.60, 53.98]
      });

      // Convertir le canvas en image
      const imgData = canvas.toDataURL('image/png');

      // Ajouter l'image au PDF en conservant les proportions
      const pdfWidth = 85.60;
      const pdfHeight = 53.98;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Télécharger le PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error('Impossible d\'exporter la carte en PDF');
    }
  }

  async exportCardToPng(cardElement: HTMLElement, filename: string): Promise<void> {
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false
      });

      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('Erreur lors de l\'export PNG:', error);
      throw new Error('Impossible d\'exporter la carte en PNG');
    }
  }
}