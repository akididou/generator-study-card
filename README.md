# 🎓 Générateur de Carte Étudiante

Une application Angular moderne pour générer des cartes d'étudiants officielles avec signature automatique ou manuelle et export PDF/PNG.

![Angular](https://img.shields.io/badge/Angular-18-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Fonctionnalités

### 🏗️ **Architecture Moderne**
- **Angular 18** avec components standalone
- **TypeScript strict** pour la robustesse
- **Services injectables** pour la logique métier
- **Tests unitaires complets** avec Jasmine/Karma

### 🎨 **Génération de Carte**
- **Design authentique** basé sur les cartes officielles françaises
- **Validation automatique** de la période de validité
- **Export haute qualité** en PDF et PNG
- **Responsive design** pour tous les appareils

### ✍️ **Signature Intelligente**
- **Signature automatique** : générée algorithmiquement à partir du nom avec variations naturelles
- **Signature manuelle** : canvas interactif pour dessiner sa propre signature
- **Rendu réaliste** avec simulation de pression et tremblements naturels
- **Couleurs d'encre variables** pour plus d'authenticité

### 🔒 **Sécurité & Performance**
- **Cache temporaire sécurisé** pour les images (10 min max)
- **Validation stricte** des types de fichiers (JPG/PNG uniquement)
- **Redimensionnement automatique** avec limite de taille (5MB)
- **Aucun stockage permanent** des données sensibles

## 🚀 Installation et Lancement

### Prérequis
- **Node.js** 18+
- **npm** ou **yarn**
- **Angular CLI** 18+

### Installation
```bash
# Cloner le repository
git clone git@github.com:akididou/generator-study-card.git
cd generator-study-card

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 🛠️ Scripts Disponibles

```bash
# Développement
npm start              # Serveur de développement
npm run build          # Build de production
npm run build:dev      # Build de développement

# Tests
npm test               # Tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec couverture

# Qualité de code
npm run lint           # Vérification ESLint
npm run lint:fix       # Correction automatique
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── student-form/          # Formulaire de saisie
│   │   ├── student-card/          # Affichage de la carte
│   │   └── signature-pad/         # Canvas de signature manuelle
│   ├── services/
│   │   ├── signature.service.ts   # Gestion des signatures
│   │   ├── image-cache.service.ts # Cache sécurisé des images
│   │   └── pdf-export.service.ts  # Export PDF/PNG
│   ├── models/
│   │   └── student.model.ts       # Modèles de données
│   └── app.component.ts           # Composant principal
└── assets/                        # Ressources statiques
```

## 🎯 Utilisation

### 1. **Saisie des Informations**
- Nom et prénom de l'étudiant
- Date de naissance
- Photo (JPG/PNG, max 5MB)
- Choix du type de signature

### 2. **Configuration de la Signature**
- **Automatique** : générée à partir du nom avec algorithme avancé
- **Manuelle** : dessiner avec la souris ou le doigt (tactile)

### 3. **Génération et Export**
- Prévisualisation en temps réel
- Export PDF format carte (85.6 × 53.98mm)
- Export PNG haute résolution
- Régénération possible de la signature

## 🧪 Tests

Les tests couvrent :
- **Services** : logique métier et gestion des données
- **Composants** : interactions utilisateur et rendu
- **Intégration** : flux complets de génération

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 🔧 Technologies Utilisées

### Frontend
- **Angular 18** - Framework principal
- **TypeScript 5.0** - Langage de développement
- **SCSS** - Styles avancés
- **RxJS** - Programmation réactive

### Génération de Contenu
- **jsPDF** - Génération de PDF
- **html2canvas** - Capture d'écran HTML
- **Canvas API** - Dessin de signature manuelle

### Tests & Qualité
- **Jasmine** - Framework de tests
- **Karma** - Test runner
- **ESLint** - Analyse statique du code

## 📦 Dépendances Principales

```json
{
  "@angular/core": "^18.0.0",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1",
  "rxjs": "~7.8.0"
}
```

## 🤝 Contribution

1. **Fork** le projet
2. Créer une **branche feature** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une **Pull Request**

## 📋 Roadmap

- [ ] **Export en format SVG**
- [ ] **Templates de cartes multiples**
- [ ] **Signature électronique avancée**
- [ ] **Mode hors-ligne (PWA)**
- [ ] **API REST pour l'intégration**

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Développement

### Architecture
L'application suit les **meilleures pratiques Angular** :
- Components standalone pour la modularité
- Services injectables pour la logique métier
- Reactive Forms pour la validation
- OnPush strategy pour les performances

### Sécurité
- **Validation côté client** stricte
- **Nettoyage automatique** du cache
- **Pas de stockage permanent** des données
- **Sanitisation** des entrées utilisateur

---

🛠️ **Généré avec [Claude Code](https://claude.ai/code)**

👤 **Développé par akididou**