import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cache = new Map<string, string>();
  private readonly maxCacheSize = 5; // Limiter le nombre d'images en cache
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB max

  constructor() {
    // Nettoyer le cache toutes les 10 minutes
    setInterval(() => this.clearCache(), 10 * 60 * 1000);
  }

  async processImage(file: File): Promise<string> {
    // Validation du fichier
    if (!this.isValidImageFile(file)) {
      throw new Error('Type de fichier non autorisé. Seuls JPG, JPEG et PNG sont acceptés.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('Fichier trop volumineux. Taille maximum : 5MB');
    }

    // Générer une clé unique pour le cache
    const cacheKey = `${file.name}_${file.size}_${file.lastModified}`;

    // Vérifier si l'image est déjà en cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Redimensionner et convertir l'image
      const processedImage = await this.resizeAndProcessImage(file);

      // Gérer la taille du cache
      this.manageCacheSize();

      // Ajouter au cache
      this.cache.set(cacheKey, processedImage);

      return processedImage;
    } catch (error) {
      throw new Error('Erreur lors du traitement de l\'image');
    }
  }

  private isValidImageFile(file: File): boolean {
    return this.allowedTypes.includes(file.type);
  }

  private async resizeAndProcessImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        // Définir les dimensions pour la carte (format portrait)
        const maxWidth = 300;
        const maxHeight = 400;

        let { width, height } = img;

        // Calculer les nouvelles dimensions en conservant le ratio
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Impossible de charger l\'image'));

      // Charger l'image depuis le fichier
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }

  private manageCacheSize(): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Supprimer la plus ancienne entrée (simple FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  // Méthode pour nettoyer le cache lors de la destruction du service
  onDestroy(): void {
    this.clearCache();
  }
}