import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCard } from '../../models/student.model';
import { SignatureService } from '../../services/signature.service';
import { PdfExportService } from '../../services/pdf-export.service';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.scss']
})
export class StudentCardComponent implements AfterViewInit, OnDestroy {
  @Input() studentData: StudentCard | null = null;
  @ViewChild('signatureCanvas', { static: false }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('studentCard', { static: false }) studentCardElement!: ElementRef<HTMLElement>;

  isExporting = false;
  exportError = '';

  constructor(
    private signatureService: SignatureService,
    private pdfExportService: PdfExportService
  ) {}

  ngAfterViewInit(): void {
    if (this.studentData && this.signatureCanvas) {
      // Ajouter un petit délai pour s'assurer que le canvas est complètement rendu
      setTimeout(() => {
        this.generateSignature();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Nettoyage si nécessaire
  }

  private generateSignature(): void {
    if (!this.signatureCanvas?.nativeElement || !this.studentData) {
      console.warn('Canvas ou données étudiant manquants');
      return;
    }

    const canvas = this.signatureCanvas.nativeElement;
    console.log('Génération de signature pour:', this.studentData.prenom, this.studentData.nom);
    console.log('Type de signature:', this.studentData.signatureType);
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    if (this.studentData.signatureType === 'manual' && this.studentData.manualSignature) {
      // Afficher la signature manuelle
      this.signatureService.displayManualSignature(canvas, this.studentData.manualSignature);
    } else {
      // Générer une signature automatique basée sur le nom
      const fullName = `${this.studentData.prenom} ${this.studentData.nom}`;
      this.signatureService.generateRealisticSignature(canvas, fullName);
    }
  }

  async exportToPdf(): Promise<void> {
    if (!this.studentCardElement?.nativeElement || !this.studentData) return;

    this.isExporting = true;
    this.exportError = '';

    try {
      const filename = `carte_etudiant_${this.studentData.prenom}_${this.studentData.nom}.pdf`;
      await this.pdfExportService.exportCardToPdf(
        this.studentCardElement.nativeElement,
        filename
      );
    } catch (error: any) {
      this.exportError = error.message || 'Erreur lors de l\'export PDF';
      console.error('Erreur export PDF:', error);
    } finally {
      this.isExporting = false;
    }
  }

  async exportToPng(): Promise<void> {
    if (!this.studentCardElement?.nativeElement || !this.studentData) return;

    this.isExporting = true;
    this.exportError = '';

    try {
      const filename = `carte_etudiant_${this.studentData.prenom}_${this.studentData.nom}.png`;
      await this.pdfExportService.exportCardToPng(
        this.studentCardElement.nativeElement,
        filename
      );
    } catch (error: any) {
      this.exportError = error.message || 'Erreur lors de l\'export PNG';
      console.error('Erreur export PNG:', error);
    } finally {
      this.isExporting = false;
    }
  }

  regenerateSignature(): void {
    this.generateSignature();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}