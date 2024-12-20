import { NextResponse } from 'next/server'
import { getEvents, addEvent, deleteEvent } from "@/lib/eventUtils"
import { Event } from '@/components/types/event'

export async function GET() {
  const events = await getEvents()
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const event: Event = await request.json()
  const newEvent = await addEvent(event)
  return NextResponse.json(newEvent)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteEvent(id)
  return NextResponse.json({ success: true })
}

