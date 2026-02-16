// Lista completa de ciudades principales de España (capitales de provincia + ciudades importantes)
export const SPANISH_CITIES = [
  'A Coruña',
  'Albacete',
  'Alicante',
  'Almería',
  'Ávila',
  'Badajoz',
  'Barcelona',
  'Bilbao',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Castellón',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Donostia-San Sebastián',
  'Girona',
  'Granada',
  'Guadalajara',
  'Huelva',
  'Huesca',
  'Jaén',
  'Las Palmas de Gran Canaria',
  'León',
  'Lleida',
  'Logroño',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Ourense',
  'Oviedo',
  'Palencia',
  'Palma',
  'Pamplona',
  'Pontevedra',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Santander',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vitoria-Gasteiz',
  'Zamora',
  'Zaragoza'
].sort();

// Tipos de precio disponibles
export const PRICE_TYPES = [
  { value: 'mes', label: '/mes' },
  { value: 'hora', label: '/hora' },
  { value: 'clase', label: '/clase' },
  { value: 'semana', label: '/semana' },
  { value: 'otro', label: '' },
] as const;

export type PriceType = typeof PRICE_TYPES[number]['value'];

// Lista completa de categorías de actividades extraescolares
export const ACTIVITY_CATEGORIES = [
  'Arte',
  'Danza',
  'Deportes',
  'Idiomas',
  'Música',
  'Otros',
  'Robótica'
].sort();
