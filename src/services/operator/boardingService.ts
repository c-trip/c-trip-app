import { http } from '../http'
import type {
  BoardFromManifestResponse,
  BoardingSummary,
  ManifestFilter,
  ManifestItem,
  OperatorSalesTotal,
  OperatorSchedule,
  RecordBoardingPayload,
  RecordBoardingResponse,
  ReprintQrPayload,
  ReprintQrResponse,
  SellTicketPayload,
  SellTicketResponse,
  ValidateQrPayload,
  ValidateQrResponse,
  WalkInBoardingPayload,
  WalkInBoardingResponse,
} from '@/types/operator'

export const boardingApi = {
  async getSchedules(date?: string, days?: number): Promise<OperatorSchedule[]> {
    const params: Record<string, string | number> = {}
    if (date) params.date = date
    if (days !== undefined) params.days = days
    const { data } = await http.get<OperatorSchedule[]>('/boarding/schedules', {
      params: Object.keys(params).length ? params : undefined,
    })
    return data
  },

  async sell(payload: SellTicketPayload): Promise<SellTicketResponse> {
    const { data } = await http.post<SellTicketResponse>('/boarding/operator/sell', payload)
    return data
  },

  /** Total (nº + Kz) das vendas ao balcão do operador no dia. */
  async getMySales(date?: string): Promise<OperatorSalesTotal> {
    const { data } = await http.get<OperatorSalesTotal>('/boarding/my-sales', {
      params: date ? { date } : undefined,
    })
    return data
  },

  async reprintQr(payload: ReprintQrPayload): Promise<ReprintQrResponse> {
    const { data } = await http.post<ReprintQrResponse>('/boarding/qr/reprint', payload)
    return data
  },

  /** Só valida — não regista embarque. */
  async validateQr(payload: ValidateQrPayload): Promise<ValidateQrResponse> {
    const { data } = await http.post<ValidateQrResponse>('/boarding/validate', payload)
    return data
  },

  /** Valida **e** regista o embarque num só passo (fluxo de câmara). */
  async scan(payload: ValidateQrPayload): Promise<ValidateQrResponse> {
    const { data } = await http.post<ValidateQrResponse>('/boarding/scan', payload)
    return data
  },

  /** Registo de embarque para um QR já validado (fluxo em 2 passos). */
  async recordBoarding(payload: RecordBoardingPayload): Promise<RecordBoardingResponse> {
    const { data } = await http.post<RecordBoardingResponse>('/boarding/record', payload)
    return data
  },

  /** Embarcar uma pessoa a partir do manifesto (sem QR). */
  async boardFromManifest(bookingId: string): Promise<BoardFromManifestResponse> {
    const { data } = await http.post<BoardFromManifestResponse>(`/boarding/board/${bookingId}`)
    return data
  },

  async getManifest(scheduleId: string, status?: ManifestFilter): Promise<ManifestItem[]> {
    const { data } = await http.get<ManifestItem[]>('/boarding/manifest', {
      params: { schedule_id: scheduleId, ...(status ? { status } : {}) },
    })
    return data
  },

  /** Resumo de embarque de uma viagem (lugares, embarques, no-shows, receita). */
  async getSummary(scheduleId: string): Promise<BoardingSummary> {
    const { data } = await http.get<BoardingSummary>('/boarding/summary', {
      params: { schedule_id: scheduleId },
    })
    return data
  },

  /** Venda + pagamento + embarque imediato à porta (sem QR). */
  async walkIn(payload: WalkInBoardingPayload): Promise<WalkInBoardingResponse> {
    const { data } = await http.post<WalkInBoardingResponse>('/boarding/walk-in', payload)
    return data
  },
}
