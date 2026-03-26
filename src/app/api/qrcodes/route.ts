import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch QR codes with scan counts
  const { data: qrcodes, error } = await supabase
    .from('qrcodes')
    .select(`
      *,
      scans:scans(count),
      qr_groups:qr_groups(id, name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get last scan for each QR code
  const qrcodesWithAnalytics = await Promise.all(
    (qrcodes || []).map(async (qr) => {
      const { data: lastScan } = await supabase
        .from('scans')
        .select('scanned_at')
        .eq('qrcode_id', qr.id)
        .order('scanned_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...qr,
        scan_count: qr.scans?.[0]?.count || 0,
        last_scan: lastScan?.scanned_at || null,
        group: qr.qr_groups || null,
      }
    })
  )

  return NextResponse.json(qrcodesWithAnalytics)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, original_url, group_id } = body

  if (!original_url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Validate URL
  try {
    new URL(original_url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  const short_id = nanoid(8)

  const { data, error } = await supabase
    .from('qrcodes')
    .insert({
      user_id: user.id,
      short_id,
      title: title || null,
      original_url,
      group_id: group_id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
