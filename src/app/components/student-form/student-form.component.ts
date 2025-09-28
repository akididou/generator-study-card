import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { ImageCacheService } from '../../services/image-cache.service';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, SignaturePadComponent],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
  @Output() studentSubmitted = new EventEmitter<Student>();

  student: Partial<Student> = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    photo: '',
    signatureType: 'auto',
    manualSignature: ''
  };

  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  manualSignatureData = '';

  constructor(private imageCacheService: ImageCacheService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Traiter l'image via le service de cache sécurisé
      if (this.selectedFile) {
        this.student.photo = await this.imageCacheService.processImage(this.selectedFile);
      }

      // Ajouter la signature manuelle si sélectionnée
      if (this.student.signatureType === 'manual') {
        this.student.manualSignature = this.manualSignatureData;
      }

      // Émettre les données de l'étudiant
      this.studentSubmitted.emit(this.student as Student);

    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur lors du traitement de l\'image';
    } finally {
      this.isLoading = false;
    }
  }

  private isFormValid(): boolean {
    const basicValid = !!(
      this.student.nom?.trim() &&
      this.student.prenom?.trim() &&
      this.student.dateNaissance &&
      this.selectedFile
    );

    // Si signature manuelle, vérifier qu'elle existe
    if (this.student.signatureType === 'manual') {
      return basicValid && !!this.manualSignatureData;
    }

    return basicValid;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSignatureTypeChange(): void {
    // Reset manual signature when switching types
    if (this.student.signatureType === 'auto') {
      this.manualSignatureData = '';
      this.student.manualSignature = '';
    }
  }

  onManualSignatureChange(signatureData: string): void {
    this.manualSignatureData = signatureData;
    this.errorMessage = ''; // Clear any validation errors
  }

  resetForm(): void {
    this.student = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      photo: '',
      signatureType: 'auto',
      manualSignature: ''
    };
    this.selectedFile = null;
    this.manualSignatureData = '';
    this.errorMessage = '';

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}