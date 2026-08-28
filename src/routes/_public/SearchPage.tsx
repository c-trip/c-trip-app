import { useNavigate } from 'react-router'
import HeaderCarousel from '../../components/HeaderCarousel'
import SearchCard from '../../components/SearchCard'
import PopularRoutes from '../../components/PopularRoutes'

export default function SearchPage() {
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate('/search-results/luanda/benguela?date=2026-08-15&passengers=1')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="relative w-full">
        <HeaderCarousel />
      </header>
      <div className="px-4 -mt-8 relative z-10">
        <SearchCard onSearch={handleSearch} />
        <PopularRoutes />
      </div>
    </div>
  )
}