import QRCode from 'qrcode'

export interface TicketPayload {
  scheduleId: string
  operator: string
  origin: string
  destination: string
  date: string
  time: string
  seat: string
  plate: string
}

export async function generateTicketQR(data: TicketPayload): Promise<string> {
  const payload = JSON.stringify(data)
  return QRCode.toDataURL(payload, { width: 200, margin: 2, errorCorrectionLevel: 'M' })
}
