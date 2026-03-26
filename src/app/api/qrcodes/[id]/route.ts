import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/qrcodes/[id]'>) {
  const supabase = await createClient()
  const { id } = await ctx.params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, original_url, group_id } = body

  if (original_url) {
    try {
      new URL(original_url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (title !== undefined) updateData.title = title
  if (original_url !== undefined) updateData.original_url = original_url
  if (group_id !== undefined) updateData.group_id = group_id || null

  const { data, error } = await supabase
    .from('qrcodes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/qrcodes/[id]'>) {
  const supabase = await createClient()
  const { id } = await ctx.params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('qrcodes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
