# Tabakh dziri - Traiteur Professionnel

## 🎉 Aperçu
**Tabakh dziri** est un site web de traiteur professionnel spécialisé dans la préparation de plats pour les mariages et événements spéciaux en Algérie.

## ✨ Fonctionnalités

### Interface Utilisateur
- **Hero Section** : Bannière principale avec recherche de plats
- **Recherche de Plats** : Recherchez par nom de plat (ex: Couscous, Tajine, Méchoui)
- **Filtres par Catégorie** : Filtrez les plats par catégorie (Traditionnelle, Grillades, Desserts, etc.)
- **Plats en Vedette** : Section dédiée aux plats les plus populaires
- **Grille de Plats** : Affichage de tous les plats disponibles avec détails

### Catégories de Plats
1. **Plats Principaux** - Couscous, Tajine, Rechta, etc.
2. **Grillades** - Méchoui, Brochettes mixtes
3. **Entrées** - Bourek, Mezze
4. **Salades** - Salade Méchouia
5. **Desserts** - Pâtisserie orientale, Fruits frais
6. **Soupes** - Chorba Frik
7. **Traditionnelle** - Plats algériens authentiques
8. **Moderne** - Plats contemporains

### Informations sur les Plats
Chaque plat affiche :
- **Nom du plat**
- **Type de cuisine**
- **Description détaillée**
- **Prix** (en DA)
- **Nombre de portions** (ex: 10-15 personnes)
- **Délai de préparation** (ex: 24h à l'avance)
- **Note/Badge** (Vedette pour les plats populaires)
- **Image du plat**

## 🎨 Design
- **Palette de couleurs** : Orange (#ff8c42) et Vert (#4caf50)
- **Style** : Moderne et professionnel
- **Responsive** : Compatible mobile, tablette et desktop
- **Animations** : Effets de survol et transitions fluides

## 🔧 Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React
- **TailwindCSS** - Styling
- **React Hooks** - Gestion d'état

### Backend
- **Node.js** - Runtime
- **Express.js** - API REST
- **JSON Files** - Base de données simple

## 📁 Structure du Projet

```
food-delivery-app/
├── app/
│   ├── page.tsx          # Page principale
│   └── globals.css       # Styles globaux
├── components/
│   ├── Header.jsx        # En-tête avec navigation
│   ├── Hero.jsx          # Section hero avec recherche
│   ├── FeaturedSection.jsx  # Plats en vedette
│   ├── CategoryFilter.jsx   # Filtres de catégories
│   ├── RestaurantGrid.jsx   # Grille de plats
│   ├── RestaurantCard.jsx   # Carte de plat (DishCard)
│   └── Footer.jsx        # Pied de page
├── lib/
│   └── api.js           # Fonctions API
└── context/
    └── CartContext.jsx  # Contexte du panier

food-delivery-backend/
├── server.js            # Serveur Express
└── data/
    ├── dishes.json      # Données des plats
    ├── categories.json  # Catégories
    └── orders.json      # Commandes
```

## 🚀 Démarrage

### Backend
```bash
cd food-delivery-backend
npm install
node server.js
```
Le serveur démarre sur `http://localhost:5000`

### Frontend
```bash
cd food-delivery-app
npm install
npm run dev
```
L'application démarre sur `http://localhost:3000`

## 📝 API Endpoints

### Plats
- `GET /api/dishes` - Récupérer tous les plats
  - Query params: `category`, `search`, `featured`
- `GET /api/dishes/:id` - Récupérer un plat par ID

### Catégories
- `GET /api/categories` - Récupérer toutes les catégories

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/:id` - Récupérer une commande par ID

## 🎯 Changements Effectués

### Branding
- ✅ Changement de "restosdz" à "Tabakh dziri"
- ✅ Nouveau slogan : "Traiteur pour vos événements"
- ✅ Email : contact@tabakhdziri.com

### Navigation
- ✅ "Blog" → "Nos Services"
- ✅ "Tarifs" → "Demander un Devis"

### Contenu
- ✅ Hero : "TRAITEUR PROFESSIONNEL POUR VOS ÉVÉNEMENTS"
- ✅ Recherche : "Rechercher un plat (ex: Couscous, Tajine, Méchoui...)"
- ✅ Footer : Description axée sur le traiteur pour mariages et événements

### Composants
- ✅ RestaurantCard renommé en DishCard (fonctionnellement)
- ✅ Liens mis à jour : `/restaurant/:id` → `/plat/:id`
- ✅ Suppression du champ adresse dans la recherche
- ✅ Image de fond Hero mise à jour pour refléter le service traiteur

## 💡 Utilisation

1. **Rechercher un plat** : Utilisez la barre de recherche dans le Hero
2. **Filtrer par catégorie** : Cliquez sur une catégorie pour filtrer
3. **Voir les détails** : Cliquez sur une carte de plat
4. **Demander un devis** : Utilisez le bouton dans l'en-tête

## 📞 Contact
- **Email** : contact@tabakhdziri.com
- **Téléphone** : +213 555 123 456

## 📄 License
© 2025 Tabakh dziri. Tous droits réservés.
