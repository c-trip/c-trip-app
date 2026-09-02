import { http } from '../http'
import type {
  ManifestItem,
  OperatorSchedule,
  RecordBoardingPayload,
  RecordBoardingResponse,
  ReprintQrPayload,
  ReprintQrResponse,
  SellTicketPayload,
  SellTicketResponse,
  ValidateQrPayload,
  ValidateQrResponse,
} from '@/types/operator'

export const boardingApi = {
  async getSchedules(date?: string): Promise<OperatorSchedule[]> {
    const { data } = await http.get<OperatorSchedule[]>('/boarding/schedules', {
      params: date ? { date } : undefined,
    })
    return data
  },

  async sell(payload: SellTicketPayload): Promise<SellTicketResponse> {
    const { data } = await http.post<SellTicketResponse>('/boarding/operator/sell', payload)
    return data
  },

  async reprintQr(payload: ReprintQrPayload): Promise<ReprintQrResponse> {
    const { data } = await http.post<ReprintQrResponse>('/boarding/qr/reprint', payload)
    return data
  },

  async validateQr(payload: ValidateQrPayload): Promise<ValidateQrResponse> {
    const { data } = await http.post<ValidateQrResponse>('/boarding/validate', payload)
    return data
  },

  async recordBoarding(payload: RecordBoardingPayload): Promise<RecordBoardingResponse> {
    const { data } = await http.post<RecordBoardingResponse>('/boarding/record', payload)
    return data
  },

  async getManifest(scheduleId: string): Promise<ManifestItem[]> {
    const { data } = await http.get<ManifestItem[]>('/boarding/manifest', {
      params: { schedule_id: scheduleId },
    })
    return data
  },
}