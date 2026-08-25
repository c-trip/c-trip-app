import { IconMapPin , IconClock} from '@tabler/icons-react'

function formatDate(): string {
  const now = new Date()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `hoje, ${now.getDate()} ${months[now.getMonth()]}`
}

export default function OperatorDayTrips() {
  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header
        className="px-5 pt-10 flex flex-col gap-2 rounded-b-3xl h-[186px]"
        style={{ background: 'linear-gradient(280deg, #2E8B57 0%, #1B7A3D 40%, #0B2F1A 100%)' }}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-1">
            <IconMapPin className="size-4" />
            <span className="text-[13px] font-semibold">Terminal de Viana</span>
          </div>
          <div className='bg-[#FFFFFF33] py-1.5  px-2.5 rounded-4xl flex items-center justify-center 
          gap-1 border border-[#FFFFFF1F]'>
         <IconClock className='size-3'/> 
          <span className="text-xs font-semibold opacity-90">{formatDate()}</span>
          </div>
        </div>

      <div className=" mt-2">
        <h1 className="text-[34px] font-extrabold text-white">Painel do Dia</h1>

        <div className="flex items-end justify-between gap-3 mb-6">
          <span className="text-sm text-[#FFFFFFB3] whitespace-nowrap">Visão geral em tempo real</span>
          <div className="h-px w-[100px] bg-[#FFFFFFB3]" />
        </div>
      </div>
      </header>
    </div>
  )
}
