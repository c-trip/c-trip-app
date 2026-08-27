import HeaderCarousel from '../../components/HeaderCarousel'
import SearchCard from '../../components/SearchCard'
import PopularRoutes from '../../components/PopularRoutes'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="relative w-full">
        <HeaderCarousel />
      </header>
      <div className="px-4 -mt-8 relative z-10">
        <SearchCard />
        <PopularRoutes />
      </div>
    </div>
  )
}
