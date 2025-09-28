import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentCardComponent } from './components/student-card/student-card.component';
import { Student, StudentCard } from './models/student.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, StudentFormComponent, StudentCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Générateur de Carte Étudiante');
  studentCard: StudentCard | null = null;

  onStudentSubmitted(student: Student): void {
    // Générer la carte avec les données de l'étudiant
    const currentYear = new Date().getFullYear();

    this.studentCard = {
      ...student,
      validite: `${currentYear}-${currentYear + 1}`,
      signature: '' // Sera généré par le composant de carte
    };
  }

  onNewCard(): void {
    this.studentCard = null;
  }
}
