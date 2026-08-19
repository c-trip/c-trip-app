import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { IconBus, IconTicket, IconMapPin, IconClock } from '@tabler/icons-react'

import 'swiper/css'
import 'swiper/css/pagination'

const slides = [
  {
    title: 'Pesquise Viagens',
    description: 'Encontre rotas entre províncias com as melhores transportadoras de Angola',
    icon: IconBus,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
  },
  {
    title: 'Compre o seu Bilhete',
    description: 'Reserve e pague online de forma rápida e segura, sem filas',
    icon: IconTicket,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  },
  {
    title: 'Escolha o seu Lugar',
    description: 'Veja o mapa de lugares em tempo real e selecione o melhor assento',
    icon: IconMapPin,
    image: 'https://images.unsplash.com/photo-1464219789975-3f60e69aab20?w=800&h=400&fit=crop',
  },
  {
    title: 'Viaje com Confiança',
    description: 'Apresente o seu QR code no embarque e parta tranquilo',
    icon: IconClock,
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=400&fit=crop',
  },
]

export default function HeaderCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="w-full h-64"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-64">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A4A3D]/80 via-[#3A6356]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <slide.icon className="w-6 h-6" />
                <h2 className="text-xl font-bold">{slide.title}</h2>
              </div>
              <p className="text-sm text-white/90">{slide.description}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
