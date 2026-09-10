import {
  User,
  UserRole,
  Property,
  PropertyCategory,
  PropertyStatus,
  Lead,
  LeadStatus,
  Visit,
  Offer,
  OfferStatus,
  Transaction,
  TransactionStatus,
  Commission,
  CommissionStatus,
  PropertyFilters,
} from '../types';

export const hiddenUserIds: string[] = ['admin-control'];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin DarEstate',
    email: 'admin@darestimate.ma',
    phone: '+212 5 22 00 00 00',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: UserRole.ADMIN,
    createdAt: '2025-09-01T08:00:00Z',
    isVerified: true,
    status: "ACTIF",
  },
  {
    id: 'admin-control',
    name: 'Othmane Arrimani',
    email: 'arrimaniusothmane@gmail.com',
    phone: '+212 6 00 00 00 00',
    avatar: '',
    role: UserRole.ADMIN,
    createdAt: '2026-09-01T08:00:00Z',
    isVerified: true,
    status: "ACTIF",
  },
  {
    id: 'seller-1',
    name: 'Mohamed Benali',
    email: 'mohamed@example.com',
    phone: '+212 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: UserRole.SELLER,
    createdAt: '2025-10-15T10:30:00Z',
    isVerified: true,
    status: "ACTIF",
    companyName: 'Agence Benali',
  },
  {
    id: 'seller-2',
    name: 'Fatima Zahra El Idrissi',
    email: 'fatima@example.com',
    phone: '+212 6 98 76 54 32',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    role: UserRole.SELLER,
    createdAt: '2025-11-20T14:00:00Z',
    isVerified: true,
    status: "ACTIF",
  },
  {
    id: 'buyer-1',
    name: 'Youssef Amrani',
    email: 'youssef@example.com',
    phone: '+212 6 11 22 33 44',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: UserRole.BUYER,
    createdAt: '2025-12-05T09:15:00Z',
    isVerified: true,
    status: "ACTIF",
  },
];

export const publicUsers: User[] = mockUsers.filter(
  (u) => !hiddenUserIds.includes(u.id)
);

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    slug: 'villa-moderne-bouskoura',
    title: 'Villa Moderne Bouskoura',
    description:
      "Magnifique villa moderne située dans le quartier prestigieux de Bouskoura, à Casablanca. Cette propriété exceptionnelle offre un design contemporain avec des finitions haut de gamme, une luminosité naturelle impressionnante et un aménagement intérieur soigné. La villa dispose d'un vaste salon ouvert sur une terrasse privée donnant sur un jardin paysager luxuriant. La cuisine équipée moderne, les chambres spacieuses avec rangements sur mesure et les salles de bains en marbre font de cette villa un véritable havre de paix. Le quartier de Bouskoura est réputé pour sa tranquillité, ses espaces verts et sa proximité avec les centres commerciaux et les écoles internationales.",
    price: 2850000,
    category: PropertyCategory.VILLA,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Route de Bouskoura, Lot 42',
      city: 'Bouskoura, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20490',
      country: 'Morocco',
    },
    latitude: 33.4567,
    longitude: -7.6389,
    surface: 320,
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    yearBuilt: 2022,
    images: [
      { id: 'img-1a', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop', alt: 'Façade de la villa moderne Bouskoura', isPrimary: true, order: 0 },
      { id: 'img-1b', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', alt: 'Salon principal avec vue sur le jardin', isPrimary: false, order: 1 },
      { id: 'img-1c', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', alt: 'Cuisine moderne équipée', isPrimary: false, order: 2 },
      { id: 'img-1d', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop', alt: 'Chambre principale spacieuse', isPrimary: false, order: 3 },
      { id: 'img-1e', url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&h=800&fit=crop', alt: 'Jardin paysager avec piscine', isPrimary: false, order: 4 },
    ],
    amenities: ['Piscine chauffée', 'Jardin paysager', 'Système de sécurité 24h/24', 'Climatisation centrale', 'Chauffage au sol', 'Domotique', 'Garage double'],
    features: ['Design contemporain', 'Finitions haut de gamme', 'Terrasse panoramique', 'Cuisine équipée', 'Chambres avec rangements'],
    isVerified: true,
    isFurnished: false,
    hasParking: true,
    hasPool: true,
    hasGarden: true,
    hasTerrace: true,
    isNewConstruction: false,
    views: 342,
    favoriteCount: 28,
    sellerId: 'seller-1',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'prop-2',
    slug: 'appartement-premium-maarif',
    title: 'Appartement Premium Maarif',
    description:
      "Superbe appartement meublé dans le quartier résidentiel de Maarif, au cœur de Casablanca. Cet appartement premium bénéficie d'une situation exceptionnelle à proximité des boutiques de luxe, des restaurants gastronomiques et des transports en commun. L'appartement entièrement meublé et décoré avec goût offre un espace de vie lumineux avec un parquet en bois massif, une cuisine ouverte entièrement équipée et une salle de bains moderne en carrelage design. Le quartier de Maarif est le centre névralgique de la vie sociale et économique de Casablanca, avec un accès facile au tramway et aux principaux axes routiers.",
    price: 1450000,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Avenue de l\'Armée Royale, N°18',
      city: 'Maarif, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20100',
      country: 'Morocco',
    },
    latitude: 33.5850,
    longitude: -7.6250,
    surface: 180,
    bedrooms: 3,
    bathrooms: 2,
    floors: 6,
    yearBuilt: 2020,
    images: [
      { id: 'img-2a', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', alt: 'Salon lumineux de l\'appartement Maarif', isPrimary: true, order: 0 },
      { id: 'img-2b', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', alt: 'Chambre principale meublée', isPrimary: false, order: 1 },
      { id: 'img-2c', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', alt: 'Cuisine ouverte moderne', isPrimary: false, order: 2 },
      { id: 'img-2d', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', alt: 'Salle de bains en design contemporain', isPrimary: false, order: 3 },
    ],
    amenities: ['Ascenseur', 'Gardien', 'Climatisation', 'Meublé haut de gamme', 'Internet fibre optique', 'Interphone vidéo'],
    features: ['Meublé complet', 'Parquet en bois massif', 'Cuisine ouverte', 'Proximité tramway', 'Finitions premium'],
    isVerified: true,
    isFurnished: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: false,
    views: 256,
    favoriteCount: 22,
    sellerId: 'seller-1',
    createdAt: '2026-02-05T11:00:00Z',
    updatedAt: '2026-04-01T16:00:00Z',
  },
  {
    id: 'prop-3',
    slug: 'villa-piscine-californie',
    title: 'Villa avec Piscine Californie',
    description:
      "Exceptionnelle villa avec piscine privée dans le quartier résidentiel de Californie, l'un des quartiers les plus prisés de Casablanca. Cette propriété d'exception sur 450 m² offre un cadre de vie somptueux avec un design architectural contemporain, des espaces de vie immenses et une finition impeccable. La villa comprend un salon principal avec hauteur sous plafond impressionnante, une cuisine professionnelle, cinq chambres dont une suite parentale avec dressing et salle de bains en marbre. La piscine chauffée entourée d'une terrasse en bois précieux et le jardin méditerranéen composé d'arbres fruitiers et de plantes ornementales créent un environnement de villégiature permanent.",
    price: 4200000,
    category: PropertyCategory.VILLA,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Villa Californie, Lotissement Les Palmiers',
      city: 'Californie, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20150',
      country: 'Morocco',
    },
    latitude: 33.5650,
    longitude: -7.6450,
    surface: 450,
    bedrooms: 5,
    bathrooms: 4,
    floors: 2,
    yearBuilt: 2023,
    images: [
      { id: 'img-3a', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', alt: 'Vue extérieure de la villa Californie', isPrimary: true, order: 0 },
      { id: 'img-3b', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop', alt: 'Piscine chauffée et terrasse', isPrimary: false, order: 1 },
      { id: 'img-3c', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop', alt: 'Salon principal avec hauteur sous plafond', isPrimary: false, order: 2 },
      { id: 'img-3d', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop', alt: 'Suite parentale avec dressing', isPrimary: false, order: 3 },
      { id: 'img-3e', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop', alt: 'Jardin méditerranéen', isPrimary: false, order: 4 },
    ],
    amenities: ['Piscine chauffée', 'Jardin méditerranéen', 'Garage triple', 'Système de sécurité', 'Domotique complète', 'Climatisation réversible', 'Salle de sport', 'Buanderie'],
    features: ['Architecture contemporaine', 'Suite parentale', 'Cuisine professionnelle', 'Terrasse en bois précieux', 'Arbres fruitiers', 'Hauteur sous plafond 4m'],
    isVerified: true,
    isFurnished: false,
    hasParking: true,
    hasPool: true,
    hasGarden: true,
    hasTerrace: true,
    isNewConstruction: false,
    views: 487,
    favoriteCount: 42,
    sellerId: 'seller-1',
    createdAt: '2025-12-20T08:30:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'prop-4',
    slug: 'terrain-residentiel-dar-bouazza',
    title: 'Terrain Résidentiel Dar Bouazza',
    description:
      "Terrain résidentiel de 800 m² situé dans la zone en plein développement de Dar Bouazza, à proximité de la côte atlantique. Ce terrain bénéficie d'un certificat de constructibilité et est idéal pour la construction d'une villa ou d'un immeuble résidentiel. La zone de Dar Bouazza connaît un essor immobilier considérable avec la création de nouveaux lotissements, centres commerciaux et infrastructures. Accès facile à l'autoroute A5 et à la plage de Dar Bouazza. Les travaux de viabilisation sont en cours dans le quartier, offrant un investissement immobilier prometteur.",
    price: 1900000,
    category: PropertyCategory.LAND,
    status: PropertyStatus.DRAFT,
    address: {
      street: 'Zone Résidentiale Dar Bouazza, Lot 15',
      city: 'Dar Bouazza, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20540',
      country: 'Morocco',
    },
    latitude: 33.5200,
    longitude: -7.8100,
    surface: 800,
    bedrooms: 0,
    bathrooms: 0,
    floors: 0,
    yearBuilt: null,
    images: [
      { id: 'img-4a', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop', alt: 'Vue panoramique du terrain', isPrimary: true, order: 0 },
      { id: 'img-4b', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&h=800&fit=crop', alt: 'Environnement naturel du terrain', isPrimary: false, order: 1 },
      { id: 'img-4c', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800&fit=crop', alt: 'Accès routier au terrain', isPrimary: false, order: 2 },
      { id: 'img-4d', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop', alt: 'Proximité plage de Dar Bouazza', isPrimary: false, order: 3 },
    ],
    amenities: ['Viabilisation en cours', 'Accès route bitumée', 'Zone en développement', 'Proximité plage'],
    features: ['Certificat.constructibilité', '800 m²', 'Zone résidentielle', 'Proximité autoroute A5'],
    isVerified: false,
    isFurnished: false,
    hasParking: false,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: true,
    views: 128,
    favoriteCount: 12,
    sellerId: 'seller-1',
    createdAt: '2026-03-01T13:00:00Z',
    updatedAt: '2026-03-01T13:00:00Z',
  },
  {
    id: 'prop-5',
    slug: 'appartement-vue-mer-ain-diab',
    title: 'Appartement Vue Mer Ain Diab',
    description:
      "Magnifique appartement avec vue panoramique sur l'océan Atlantique, situé dans le prestigieux quartier d'Ain Diab à Casablanca. Cet appartement de standing offre une vue imprenable sur la mer depuis la terrasse spacieuse idéale pour profiter des couchers de soleil. L'espace de vie est lumineux et aéré avec de grandes baies vitrées, un parquet en chêne et une décoration contemporaine élégante. La cuisine est entièrement équipée avec des appareils haut de gamme. Le quartier d'Ain Diab, longeant la corniche, offre un cadre de vie unique avec ses promenades bordées de palmiers, ses restaurants face à la mer et ses plages accessibles à pied.",
    price: 2100000,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Corniche Ain Diab, Immeuble Les Voiles',
      city: 'Ain Diab, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20200',
      country: 'Morocco',
    },
    latitude: 33.5450,
    longitude: -7.6700,
    surface: 150,
    bedrooms: 3,
    bathrooms: 2,
    floors: 8,
    yearBuilt: 2021,
    images: [
      { id: 'img-5a', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop', alt: 'Vue mer depuis la terrasse', isPrimary: true, order: 0 },
      { id: 'img-5b', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', alt: 'Salon avec grandes baies vitrées', isPrimary: false, order: 1 },
      { id: 'img-5c', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', alt: 'Chambre avec vue océan', isPrimary: false, order: 2 },
      { id: 'img-5d', url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop', alt: 'Terrasse panoramique', isPrimary: false, order: 3 },
    ],
    amenities: ['Parking souterrain', 'Ascenseur', 'Gardien 24h/24', 'Climatisation', 'Store électrique', 'Vue mer panoramique'],
    features: ['Vue mer panoramique', 'Terrasse spacieuse', 'Baies vitrées', 'Parquet chêne', 'Proximité plage'],
    isVerified: true,
    isFurnished: false,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasTerrace: true,
    isNewConstruction: false,
    views: 389,
    favoriteCount: 35,
    sellerId: 'seller-1',
    createdAt: '2026-01-25T15:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'prop-6',
    slug: 'villa-traditionnelle-marrakech',
    title: 'Villa Traditionnelle Marrakech',
    description:
      "Superbe villa alliant le charme traditionnel marocain au confort moderne, nichée dans le quartier élégant de Guéliz à Marrakech. Cette propriété unique offre un mélange harmonieux d'architecture traditionnelle avec ses zelliges, ses moucharabiehs et ses fontaines intérieures, et de confort contemporain. La villa dispose d'un riad réaménagé avec patios ombragés, d'une piscine bordée de tadelakt, de chambres richement décorées avec des textiles artisanaux et d'un jardin planté d'agrumes et de roses. Guéliz, le quartier moderne de Marrakech, offre un accès direct à la Médina tout en bénéficiant des commodités de la vie contemporaine avec ses galeries d'art, ses cafés branchés et ses boutiques de design.",
    price: 3500000,
    category: PropertyCategory.VILLA,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Rue Ibn Tachfin, Quartier Guéliz',
      city: 'Guéliz, Marrakech',
      state: 'Marrakech-Safi',
      zip: '40000',
      country: 'Morocco',
    },
    latitude: 31.6295,
    longitude: -7.9811,
    surface: 380,
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    yearBuilt: 2019,
    images: [
      { id: 'img-6a', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop', alt: 'Cour intérieure avec fontaine', isPrimary: true, order: 0 },
      { id: 'img-6b', url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&h=800&fit=crop', alt: 'Piscine bordée de tadelakt', isPrimary: false, order: 1 },
      { id: 'img-6c', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', alt: 'Chambre traditionnelle décorée', isPrimary: false, order: 2 },
      { id: 'img-6d', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop', alt: 'Jardin d\'agrumes et de roses', isPrimary: false, order: 3 },
      { id: 'img-6e', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', alt: 'Salon avec zelliges', isPrimary: false, order: 4 },
    ],
    amenities: ['Piscine', 'Jardin d\'agrumes', 'Riad intérieur', 'Climatisation', 'Cheminée traditionnelle', 'Artisanat local'],
    features: ['Architecture traditionnelle', 'Zelliges et moucharabiehs', 'Tadelakt', 'Textiles artisanaux', 'Patio ombragé'],
    isVerified: true,
    isFurnished: false,
    hasParking: true,
    hasPool: true,
    hasGarden: true,
    hasTerrace: false,
    isNewConstruction: false,
    views: 412,
    favoriteCount: 38,
    sellerId: 'seller-1',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2026-02-14T15:30:00Z',
  },
  {
    id: 'prop-7',
    slug: 'appartement-moderne-racine',
    title: 'Appartement Moderne Racine',
    description:
      "Appartement moderne et entièrement meublé dans le quartier prisé de Racine à Casablanca. Cet appartement offre un design intérieur contemporain avec des meubles sur mesure, un éclairage LED ambiant et une décoration soignée. La pièce de vie principale est ouverte sur un coin bureau idéal pour le télétravail. L'appartement bénéficie d'un emplacement stratégique à proximité du Centre Commercial Anfa Place, des meilleures écoles de la ville et des axes principaux. Racine est un quartier dynamique apprécié pour sa vie nocturne, ses restaurants gastronomiques et sa proximité avec le boulevard de la Corniche.",
    price: 1800000,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Avenue Racine, Immeuble Le Signe',
      city: 'Racine, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20100',
      country: 'Morocco',
    },
    latitude: 33.5750,
    longitude: -7.6300,
    surface: 120,
    bedrooms: 2,
    bathrooms: 1,
    floors: 4,
    yearBuilt: 2021,
    images: [
      { id: 'img-7a', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', alt: 'Salon moderne meublé', isPrimary: true, order: 0 },
      { id: 'img-7b', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', alt: 'Chambre avec rangements', isPrimary: false, order: 1 },
      { id: 'img-7c', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', alt: 'Cuisine équipée moderne', isPrimary: false, order: 2 },
      { id: 'img-7d', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop', alt: 'Coin bureau intégré', isPrimary: false, order: 3 },
    ],
    amenities: ['Parking souterrain', 'Ascenseur', 'Climatisation', 'Meublé design', 'Internet fibre optique', 'Interphone'],
    features: ['Meublé design', 'Coin bureau', 'Proximité Anfa Place', 'Éclairage LED', 'Meubles sur mesure'],
    isVerified: true,
    isFurnished: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: false,
    views: 198,
    favoriteCount: 18,
    sellerId: 'seller-1',
    createdAt: '2026-02-20T09:30:00Z',
    updatedAt: '2026-04-05T12:00:00Z',
  },
  {
    id: 'prop-8',
    slug: 'local-commercial-maarif',
    title: 'Local Commercial Maarif',
    description:
      "Local commercial de premier choix dans le cœur commercial de Maarif à Casablanca. Ce local neuf de 200 m² est idéal pour un concept store, un restaurant, une galerie d'art ou tout autre usage commercial haut de gamme. Le local bénéficie d'une façade vitrée sur rue avec une excellente visibilité, de plafonds hauts de 4 mètres, d'un système de ventilation industrielle et d'un raccordement électrique triphasé. Situé au rez-de-chaussée d'un immeuble moderne, il offre un accès direct depuis la rue et un accès service par l'arrière. Le quartier de Maarif concentre l'activité commerciale de Casablanca avec un flux piéton important.",
    price: 2500000,
    category: PropertyCategory.COMMERCIAL,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Avenue Chakib Arslan, Local Commercial RDC',
      city: 'Maarif, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20100',
      country: 'Morocco',
    },
    latitude: 33.5870,
    longitude: -7.6280,
    surface: 200,
    bedrooms: 0,
    bathrooms: 2,
    floors: 1,
    yearBuilt: 2024,
    images: [
      { id: 'img-8a', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop', alt: 'Espace commercial lumineux', isPrimary: true, order: 0 },
      { id: 'img-8b', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop', alt: 'Façade vitrée sur rue', isPrimary: false, order: 1 },
      { id: 'img-8c', url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop', alt: 'Espace intérieur à aménager', isPrimary: false, order: 2 },
      { id: 'img-8d', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop', alt: 'Immeuble moderne Maarif', isPrimary: false, order: 3 },
    ],
    amenities: ['Façade vitrée', 'Plafonds hauts 4m', 'Ventilation industrielle', 'Raccordement triphasé', 'Accès service', 'Vidéosurveillance'],
    features: ['Neuf 2024', 'Excellente visibilité', 'Rez-de-chaussée', 'Zone commerciale premium', '200 m²'],
    isVerified: true,
    isFurnished: false,
    hasParking: false,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: true,
    views: 156,
    favoriteCount: 9,
    sellerId: 'seller-1',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'prop-9',
    slug: 'villa-familiale-ain-sebaa',
    title: 'Villa Familiale Ain Sebaa',
    description:
      "Charmante villa familiale dans le quartier résidentiel d'Ain Sebaa à Casablanca, offrant un cadre de vie idéal pour une famille. Cette villa de 250 m² sur deux niveaux dispose de quatre chambres spacieuses, d'un double salon, d'une cuisine familiale et d'un jardin arboré parfait pour les jeux des enfants. La villa bénéficie d'une terrasse idéale pour les repas en plein air et d'un jardin entretenu avec des fruitiers. Ain Sebaa est un quartier calme et familial, à proximité des écoles, des marchés et des commerces de proximité, avec un accès facile au tramway et à l'autoroute.",
    price: 1650000,
    category: PropertyCategory.VILLA,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Quartier Résidentiel Ain Sebaa, Lot 28',
      city: 'Ain Sebaa, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20250',
      country: 'Morocco',
    },
    latitude: 33.6100,
    longitude: -7.5300,
    surface: 250,
    bedrooms: 4,
    bathrooms: 2,
    floors: 2,
    yearBuilt: 2018,
    images: [
      { id: 'img-9a', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', alt: 'Façade de la villa familiale', isPrimary: true, order: 0 },
      { id: 'img-9b', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop', alt: 'Salon familial lumineux', isPrimary: false, order: 1 },
      { id: 'img-9c', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', alt: 'Jardin arboré avec fruitiers', isPrimary: false, order: 2 },
      { id: 'img-9d', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop', alt: 'Terrasse avec salle à manger extérieure', isPrimary: false, order: 3 },
    ],
    amenities: ['Jardin arboré', 'Terrasse', 'Double salon', 'Cuisine familiale', 'Buanderie', 'Climatisation'],
    features: ['Cadre familial', 'Quartier calme', 'Fruitiers', 'Proximité écoles', 'Accès tramway'],
    isVerified: true,
    isFurnished: false,
    hasParking: true,
    hasPool: false,
    hasGarden: true,
    hasTerrace: true,
    isNewConstruction: false,
    views: 215,
    favoriteCount: 19,
    sellerId: 'seller-2',
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-04-08T09:00:00Z',
  },
  {
    id: 'prop-10',
    slug: 'terrain-agricole-settat',
    title: 'Terrain Agricole Settat',
    description:
      "Super terrain agricole de 2000 m² situé dans la région de Settat, à environ 80 km au sud de Casablanca. Ce terrain plat et fertile est idéal pour des projets agricoles, maraîchers ou d'élevage. La zone bénéficie de ressources en eau souterraine et d'un climat favorable à l'agriculture. L'accès à la nationale N9 facilite le transport des récoltes vers les marchés de Casablanca. Settat est une région agricole importante du Maroc, reconnue pour ses productions céréalières et maraîchères. Ce terrain représente une excellente opportunité d'investissement dans le secteur agricole marocain.",
    price: 850000,
    category: PropertyCategory.LAND,
    status: PropertyStatus.PENDING_REVIEW,
    address: {
      street: 'Route Nationale N9, Commune Rurale Sidi Lahcen',
      city: 'Settat, Casablanca',
      state: 'Casablanca-Settat',
      zip: '26000',
      country: 'Morocco',
    },
    latitude: 32.9900,
    longitude: -7.6200,
    surface: 2000,
    bedrooms: 0,
    bathrooms: 0,
    floors: 0,
    yearBuilt: null,
    images: [
      { id: 'img-10a', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop', alt: 'Vue du terrain agricole', isPrimary: true, order: 0 },
      { id: 'img-10b', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800&fit=crop', alt: 'Paysage agricole Settat', isPrimary: false, order: 1 },
      { id: 'img-10c', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop', alt: 'Accès route nationale', isPrimary: false, order: 2 },
    ],
    amenities: ['Ressources en eau souterraine', 'Accès route nationale', 'Terrain plat', 'Climat favorable'],
    features: ['2000 m²', 'Fertile', 'Proximité Casablanca', 'Zone agricole', 'Investissement'],
    isVerified: false,
    isFurnished: false,
    hasParking: false,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: false,
    views: 87,
    favoriteCount: 5,
    sellerId: 'seller-2',
    createdAt: '2026-04-12T11:00:00Z',
    updatedAt: '2026-04-12T11:00:00Z',
  },
  {
    id: 'prop-11',
    slug: 'appartement-luxe-anfa',
    title: 'Appartement Luxe Anfa',
    description:
      "Appartement de luxe entièrement meublé dans le quartier prestigieux d'Anfa à Casablanca. Cet appartement exceptionnel offre un standing rare avec des matériaux nobles : marbre de Carrare, parquet en chêne massif, robinetterie designer et mobilier de créateurs. L'espace de vie principal ouvert sur une large baie vitrée offre une vue dégagée. La cuisine équipée haut de gamme comprend des appareils Miele et une île centrale en pierre naturelle. La suite parentale dispose d'un dressing sur mesure et d'une salle de bains en marbre avec baignoire et douche à l'italienne. Anfa est le quartier le plus exclusif de Casablanca, abritant les ambassades, les hôtels 5 étoiles et les restaurants gastronomiques.",
    price: 3200000,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Boulevard d\'Anfa, Résidence Les Jardins d\'Anfa',
      city: 'Anfa, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20250',
      country: 'Morocco',
    },
    latitude: 33.5600,
    longitude: -7.6550,
    surface: 220,
    bedrooms: 4,
    bathrooms: 3,
    floors: 10,
    yearBuilt: 2023,
    images: [
      { id: 'img-11a', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', alt: 'Salon de luxe avec vue', isPrimary: true, order: 0 },
      { id: 'img-11b', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop', alt: 'Cuisine haut de gamme Miele', isPrimary: false, order: 1 },
      { id: 'img-11c', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop', alt: 'Suite parentale en marbre', isPrimary: false, order: 2 },
      { id: 'img-11d', url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop', alt: 'Terrasse panoramique', isPrimary: false, order: 3 },
    ],
    amenities: ['Concierge', 'Piscine résidentielle', 'Salle de sport', 'Spa', 'Parking privatif', 'Climatisation réversible', 'Domotique'],
    features: ['Marbre de Carrare', 'Mobilier de créateurs', 'Cuisine Miele', 'Dressing sur mesure', 'Quartier exclusif'],
    isVerified: true,
    isFurnished: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasTerrace: true,
    isNewConstruction: false,
    views: 456,
    favoriteCount: 41,
    sellerId: 'seller-2',
    createdAt: '2025-12-08T10:00:00Z',
    updatedAt: '2026-03-25T14:00:00Z',
  },
  {
    id: 'prop-12',
    slug: 'studio-moderne-centre-ville',
    title: 'Studio Moderne Centre-Ville',
    description:
      "Studio moderne et fonctionnel situé en plein centre-ville de Casablanca. Ce studio de 55 m² entièrement meublé est parfait pour un jeune professionnel ou un investisseur locatif. L'espace est optimisé avec une cuisine ouverte équipée, un espace nuit séparé par une cloison amovible et une salle de bains moderne. Le studio bénéficie d'une excellente localisation à proximité de la Place Mohammed V, du tramway et de tous les commerces. La région du centre-ville est en pleine renaissance urbaine avec de nombreux projets de réhabilitation et une demande locative forte.",
    price: 750000,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.PUBLISHED,
    address: {
      street: 'Boulevard Mohammed V, Immeuble Centro',
      city: 'Centre-Ville, Casablanca',
      state: 'Casablanca-Settat',
      zip: '20000',
      country: 'Morocco',
    },
    latitude: 33.5950,
    longitude: -7.6200,
    surface: 55,
    bedrooms: 1,
    bathrooms: 1,
    floors: 3,
    yearBuilt: 2022,
    images: [
      { id: 'img-12a', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', alt: 'Espace de vie du studio', isPrimary: true, order: 0 },
      { id: 'img-12b', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', alt: 'Espace nuit séparé', isPrimary: false, order: 1 },
      { id: 'img-12c', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', alt: 'Cuisine ouverte équipée', isPrimary: false, order: 2 },
      { id: 'img-12d', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', alt: 'Salle de bains moderne', isPrimary: false, order: 3 },
    ],
    amenities: ['Meublé', 'Climatisation', 'Internet fibre', 'Proximité tramway', 'Gardien', 'Cuisine équipée'],
    features: ['Fonctionnel', 'Meublé complet', 'Excellente localisation', 'Investissement locatif', 'Centre-ville'],
    isVerified: true,
    isFurnished: true,
    hasParking: false,
    hasPool: false,
    hasGarden: false,
    hasTerrace: false,
    isNewConstruction: false,
    views: 312,
    favoriteCount: 27,
    sellerId: 'seller-2',
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-04-12T16:30:00Z',
  },
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    propertyId: 'prop-1',
    buyerId: 'buyer-1',
    sellerId: 'seller-1',
    status: LeadStatus.VISIT_REQUESTED,
    message: 'Bonjour, je suis très intéressé par cette villa à Bouskoura. Serait-il possible d\'organiser une visite cette semaine ?',
    name: 'Youssef Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@example.com',
    createdAt: '2026-04-05T10:30:00Z',
    updatedAt: '2026-04-08T14:00:00Z',
  },
  {
    id: 'lead-2',
    propertyId: 'prop-3',
    buyerId: 'buyer-1',
    sellerId: 'seller-1',
    status: LeadStatus.OFFER_MADE,
    message: 'Je souhaite faire une offre pour cette villa exceptionnelle. Le prix est-il négociable ?',
    name: 'Youssef Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@example.com',
    createdAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
  },
  {
    id: 'lead-3',
    propertyId: 'prop-5',
    buyerId: 'buyer-1',
    sellerId: 'seller-1',
    status: LeadStatus.CONTACTED,
    message: 'L\'appartement avec vue mer à Ain Diab m\'intéresse beaucoup. Pouvez-vous me donner plus de détails ?',
    name: 'Youssef Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@example.com',
    createdAt: '2026-04-10T15:00:00Z',
    updatedAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 'lead-4',
    propertyId: 'prop-11',
    buyerId: 'buyer-1',
    sellerId: 'seller-2',
    status: LeadStatus.NEGOTIATION,
    message: 'Suite à la visite de l\'appartement luxe Anfa, je souhaite négocier le prix de vente.',
    name: 'Youssef Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@example.com',
    createdAt: '2026-02-15T14:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'lead-5',
    propertyId: 'prop-12',
    buyerId: 'buyer-1',
    sellerId: 'seller-2',
    status: LeadStatus.NEW,
    message: 'Bonjour, je recherche un studio en centre-ville pour un investissement locatif. Ce studio correspond-il à mes critères ?',
    name: 'Youssef Amrani',
    phone: '+212 6 11 22 33 44',
    email: 'youssef@example.com',
    createdAt: '2026-04-13T08:00:00Z',
    updatedAt: '2026-04-13T08:00:00Z',
  },
];

export const mockVisits: Visit[] = [
  {
    id: 'visit-1',
    propertyId: 'prop-1',
    leadId: 'lead-1',
    date: '2026-04-15',
    time: '10:00',
    numberOfVisitors: 2,
    phone: '+212 6 11 22 33 44',
    message: 'Visit with my wife to see the villa',
    status: LeadStatus.VISIT_COMPLETED,
    createdAt: '2026-04-08T14:00:00Z',
  },
  {
    id: 'visit-2',
    propertyId: 'prop-11',
    leadId: 'lead-4',
    date: '2026-03-01',
    time: '14:00',
    numberOfVisitors: 1,
    phone: '+212 6 11 22 33 44',
    message: 'Alone visit before making an offer',
    status: LeadStatus.VISIT_COMPLETED,
    createdAt: '2026-02-25T09:00:00Z',
  },
  {
    id: 'visit-3',
    propertyId: 'prop-5',
    leadId: 'lead-3',
    date: '2026-04-18',
    time: '16:00',
    numberOfVisitors: 2,
    phone: '+212 6 11 22 33 44',
    message: 'Visit scheduled with my brother',
    status: LeadStatus.VISIT_REQUESTED,
    createdAt: '2026-04-11T09:00:00Z',
  },
];

export const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    propertyId: 'prop-3',
    buyerId: 'buyer-1',
    price: 3800000,
    message: 'Je propose 3 800 000 MAD pour cette villa exceptionnelle. Offre valable 30 jours.',
    preferredContact: 'WhatsApp',
    status: OfferStatus.COUNTER_OFFER,
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-03-28T15:00:00Z',
  },
  {
    id: 'offer-2',
    propertyId: 'prop-11',
    buyerId: 'buyer-1',
    price: 2900000,
    message: 'Offre ferme de 2 900 000 MAD pour l\'appartement luxe Anfa. Paiement bancaire sécurisé.',
    preferredContact: 'Email',
    status: OfferStatus.PENDING,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'offer-3',
    propertyId: 'prop-9',
    buyerId: 'buyer-1',
    price: 1500000,
    message: 'Intéressé par la villa familiale Ain Sebaa. Offre de 1 500 000 MAD négociable.',
    preferredContact: 'Téléphone',
    status: OfferStatus.ACCEPTED,
    createdAt: '2026-03-18T13:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    propertyId: 'prop-9',
    sellerId: 'seller-2',
    buyerId: 'buyer-1',
    salePrice: 1550000,
    commissionPercentage: 5,
    commissionAmount: 77500,
    status: TransactionStatus.COMPLETED,
    createdAt: '2026-04-01T09:00:00Z',
  },
];

export const mockCommissions: Commission[] = [
  {
    id: 'comm-1',
    transactionId: 'txn-1',
    amount: 77500,
    percentage: 5,
    status: CommissionStatus.PAID,
    dueDate: '2026-04-30',
    paidDate: '2026-04-15',
    createdAt: '2026-04-01T09:00:00Z',
  },
];

export const mockCities: string[] = [
  'Casablanca',
  'Marrakech',
  'Rabat',
  'Tangier',
  'Fez',
  'Agadir',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
  'Safi',
  'Mohammedia',
  'Khouribga',
  'Settat',
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return mockProperties.find((p) => p.slug === slug);
}

export function getPropertiesByCategory(category: PropertyCategory): Property[] {
  return mockProperties.filter((p) => p.category === category);
}

export function getFeaturedProperties(): Property[] {
  return mockProperties
    .filter((p) => p.status === PropertyStatus.PUBLISHED && p.isVerified)
    .slice(0, 6);
}

export function filterProperties(filters: PropertyFilters): Property[] {
  let results = [...mockProperties];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.address.city.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.city) {
    results = results.filter((p) => p.address.city.toLowerCase().includes(filters.city!.toLowerCase()));
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.minSurface !== undefined) {
    results = results.filter((p) => p.surface >= filters.minSurface!);
  }

  if (filters.maxSurface !== undefined) {
    results = results.filter((p) => p.surface <= filters.maxSurface!);
  }

  if (filters.bedrooms !== undefined) {
    results = results.filter((p) => p.bedrooms === filters.bedrooms);
  }

  if (filters.bathrooms !== undefined) {
    results = results.filter((p) => p.bathrooms === filters.bathrooms);
  }

  if (filters.isFurnished !== undefined) {
    results = results.filter((p) => p.isFurnished === filters.isFurnished);
  }

  if (filters.hasParking !== undefined) {
    results = results.filter((p) => p.hasParking === filters.hasParking);
  }

  if (filters.hasPool !== undefined) {
    results = results.filter((p) => p.hasPool === filters.hasPool);
  }

  if (filters.hasGarden !== undefined) {
    results = results.filter((p) => p.hasGarden === filters.hasGarden);
  }

  if (filters.hasTerrace !== undefined) {
    results = results.filter((p) => p.hasTerrace === filters.hasTerrace);
  }

  if (filters.isNewConstruction !== undefined) {
    results = results.filter((p) => p.isNewConstruction === filters.isNewConstruction);
  }

  if (filters.isVerified !== undefined) {
    results = results.filter((p) => p.isVerified === filters.isVerified);
  }

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'surface-asc':
        results.sort((a, b) => a.surface - b.surface);
        break;
      case 'surface-desc':
        results.sort((a, b) => b.surface - a.surface);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        results.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }
  }

  return results;
}
