import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest, ctx: RouteContext<'/q/[shortId]'>) {
  const supabase = await createClient()
  const { shortId } = await ctx.params

  // Look up QR code by short_id
  const { data: qrcode, error } = await supabase
    .from('qrcodes')
    .select('id, original_url')
    .eq('short_id', shortId)
    .single()

  if (error || !qrcode) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>QR Code Not Found</title></head>
        <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0a0f;color:#e5e7eb;font-family:system-ui;">
          <div style="text-align:center;">
            <h1 style="font-size:3rem;margin-bottom:1rem;">404</h1>
            <p>This QR code does not exist or has been deleted.</p>
            <a href="/" style="color:#6366f1;margin-top:1rem;display:inline-block;">Go to DynQR</a>
          </div>
        </body>
      </html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Log the scan (fire-and-forget, don't block redirect)
  supabase
    .from('scans')
    .insert({ qrcode_id: qrcode.id })
    .then(() => {})

  // Redirect to original URL
  return NextResponse.redirect(qrcode.original_url, 307)
}
