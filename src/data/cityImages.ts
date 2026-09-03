// Imagens ilustrativas por cidade (a API só devolve id/name/province).
// Cai para um pool rotativo quando a cidade não tem imagem dedicada.

const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?w=600&h=400&fit=crop&q=70`

const BY_CITY: Record<string, string> = {
  Luanda: UNSPLASH('photo-1580060839134-75a5edca2e99'),
  Benguela: UNSPLASH('photo-1507525428034-b723cf961d3e'),
  Lobito: UNSPLASH('photo-1519501025264-65ba15a82390'),
  Lubango: UNSPLASH('photo-1470071459604-3b5ec3a7fe05'),
  Namibe: UNSPLASH('photo-1509316785289-025f5b846b35'),
  Huambo: UNSPLASH('photo-1464822759023-fed622ff2c3b'),
  Malanje: UNSPLASH('photo-1432405972618-c60b0225b8f9'),
  Cabinda: UNSPLASH('photo-1441974231531-c6227db76b6e'),
  Soyo: UNSPLASH('photo-1505228395891-9a51e7e86bf6'),
  Sumbe: UNSPLASH('photo-1506929562872-bb421503ef21'),
  Uíge: UNSPLASH('photo-1500534314209-a25ddb2bd429'),
  Menongue: UNSPLASH('photo-1516426122078-c23e76319801'),
}

const FALLBACK_POOL = [
  UNSPLASH('photo-1544620347-c4fd4a3d5957'),
  UNSPLASH('photo-1516738901171-8eb4fc13bd20'),
  UNSPLASH('photo-1449824913935-59a10b8d2000'),
  UNSPLASH('photo-1480714378408-67cf0d13bc1b'),
  UNSPLASH('photo-1500375592092-40eb2168fd21'),
  UNSPLASH('photo-1518791841217-8f162f1e1131'),
]

const CITY_GRADIENTS = [
  'from-[#1B7A3D] to-[#3A6356]',
  'from-[#6B9E8C] to-[#3A6356]',
  'from-[#4A7A6A] to-[#2A4A3D]',
  'from-[#5C8E7C] to-[#2E5446]',
  'from-[#7BAF9C] to-[#4A6B5E]',
  'from-[#2A4A3D] to-[#1B3D2F]',
]

function hash(value: string): number {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function cityImage(name: string): string {
  return BY_CITY[name] ?? FALLBACK_POOL[hash(name) % FALLBACK_POOL.length]
}

/** Gradiente de fallback usado quando a imagem não carrega. */
export function cityGradient(name: string): string {
  return CITY_GRADIENTS[hash(name) % CITY_GRADIENTS.length]
}
