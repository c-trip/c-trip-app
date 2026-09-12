import { jsPDF } from 'jspdf'
import { formatKz } from '@/lib/format'

export interface TicketPdfData {
  company?: string
  origin: string
  destination: string
  departureDate?: string
  departureTime?: string
  seatLabel: string
  price?: number
  passengerName?: string
  qrHash: string
  qrDataUrl: string
}

/** Gera o PDF do bilhete (rota, lugar, QR code) e devolve como File pronto a partilhar/descarregar. */
export function buildTicketPdf(data: TicketPdfData): File {
  const doc = new jsPDF({ unit: 'mm', format: [90, 160] })
  const pageWidth = 90
  const marginX = 8
  let y = 14

  doc.setFillColor(27, 122, 61)
  doc.rect(0, 0, pageWidth, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Bilhete C-Trip', marginX, y)
  if (data.company) {
    y += 6
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(data.company.toUpperCase(), marginX, y)
  }

  y = 30
  doc.setTextColor(17, 24, 39)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(`${data.origin} -> ${data.destination}`, marginX, y, { maxWidth: pageWidth - marginX * 2 })

  y += 10
  doc.setDrawColor(229, 231, 235)
  doc.line(marginX, y, pageWidth - marginX, y)

  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)

  const row = (label: string, value: string) => {
    doc.setTextColor(75, 85, 99)
    doc.text(label, marginX, y)
    doc.setTextColor(17, 24, 39)
    doc.setFont('helvetica', 'bold')
    doc.text(value, pageWidth - marginX, y, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    y += 7
  }

  if (data.passengerName) row('Passageiro', data.passengerName)
  row('Lugar', data.seatLabel)
  if (data.departureDate || data.departureTime) {
    row('Partida', [data.departureDate, data.departureTime].filter(Boolean).join(' '))
  }
  if (typeof data.price === 'number') row('Preço', formatKz(data.price))

  y += 4
  doc.line(marginX, y, pageWidth - marginX, y)

  const qrSize = 55
  const qrX = (pageWidth - qrSize) / 2
  y += 8
  doc.addImage(data.qrDataUrl, 'PNG', qrX, y, qrSize, qrSize)

  y += qrSize + 7
  doc.setFontSize(7)
  doc.setTextColor(156, 163, 175)
  doc.text(data.qrHash, pageWidth / 2, y, { align: 'center', maxWidth: pageWidth - marginX * 2 })

  y += 8
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Apresente este QR code ao motorista/operador no embarque.', pageWidth / 2, y, {
    align: 'center',
    maxWidth: pageWidth - marginX * 2,
  })

  const blob = doc.output('blob')
  const fileName = `bilhete-c-trip-${data.qrHash.slice(0, 8)}.pdf`
  return new File([blob], fileName, { type: 'application/pdf' })
}
