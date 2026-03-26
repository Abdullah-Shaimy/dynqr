'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRPreviewProps {
  url: string
  size?: number
}

export default function QRPreview({ url, size = 120 }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#e5e7eb',
          light: '#00000000',
        },
        errorCorrectionLevel: 'M',
      })
    }
  }, [url, size])

  return (
    <div className="inline-flex items-center justify-center rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
