import { useEffect, useRef, useState, Component, type ReactNode } from 'react'

interface QrScannerProps {
  onScan: (decodedText: string) => void
  fps?: number
  qrboxSize?: number
}

type ScannerState = 'loading' | 'scanning' | 'success' | 'error'

class ScannerErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function ScannerInner({ onScan, fps = 10, qrboxSize = 250 }: QrScannerProps) {
  const startedRef = useRef(false)
  const [state, setState] = useState<ScannerState>('loading')

  useEffect(() => {
    let cancelled = false
    let html5Qrcode: InstanceType<typeof import('html5-qrcode')['Html5Qrcode']> | null = null

    const setup = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (cancelled) return

        const scanner = new Html5Qrcode('qr-scanner-region', { verbose: false })
        html5Qrcode = scanner

        const devices = await Html5Qrcode.getCameras()
        if (cancelled || !devices || devices.length === 0) {
          setState('error')
          return
        }

        const rearCamera = devices.find(
          (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('traseira'),
        )
        const cameraId = rearCamera?.id || devices[devices.length - 1].id

        await scanner.start(
          cameraId,
          {
            fps,
            qrbox: { width: qrboxSize, height: qrboxSize },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (cancelled) return
            scanner.pause(true)
            setState('success')
            onScan(decodedText)
          },
          () => {},
        )

        if (!cancelled) {
          startedRef.current = true
          setState('scanning')
        }
      } catch {
        if (!cancelled) setState('error')
      }
    }

    setup()

    return () => {
      cancelled = true

      if (html5Qrcode) {
        if (startedRef.current && html5Qrcode.isScanning) {
          try { html5Qrcode.pause(true) } catch { /* ignore */ }
          try { html5Qrcode.stop().catch(() => {}) } catch { /* ignore */ }
        }
        try { html5Qrcode.clear() } catch { /* ignore */ }
      }
      startedRef.current = false

      const region = document.getElementById('qr-scanner-region')
      if (region) {
        region.querySelectorAll('video').forEach((v) => {
          const stream = v.srcObject as MediaStream | null
          stream?.getTracks().forEach((t) => t.stop())
          v.remove()
        })
        region.querySelectorAll('canvas').forEach((c) => c.remove())
      }
    }
  }, [fps, qrboxSize, onScan])

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden bg-black rounded-2xl"
        style={{ aspectRatio: '1 / 1', maxWidth: qrboxSize + 40 }}
      >
        <div id="qr-scanner-region" className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />

        {state === 'scanning' && (
          <div className="qr-viewfinder" aria-hidden="true" />
        )}

        {state === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="flex flex-col items-center gap-3">
              <div className="size-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-sm font-outfit">A iniciar câmara...</span>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="size-16 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
              <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-3 px-8 text-center">
              <svg className="size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <span className="text-white text-sm font-outfit">Não foi possível iniciar a câmara</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QrScanner(props: QrScannerProps) {
  return (
    <ScannerErrorBoundary
      fallback={
        <div className="w-full flex items-center justify-center bg-black rounded-2xl" style={{ aspectRatio: '1 / 1', maxWidth: 290 }}>
          <span className="text-gray-400 text-sm font-outfit">Erro ao carregar câmara</span>
        </div>
      }
    >
      <ScannerInner {...props} />
    </ScannerErrorBoundary>
  )
}
