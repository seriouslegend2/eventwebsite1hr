import fs from 'fs/promises'
import path from 'path'
import { Event } from '@/components/types/event'

const eventsFile = path.join(process.cwd(), 'data', 'events.json')

export async function getEvents(): Promise<Event[]> {
  const data = await fs.readFile(eventsFile, 'utf8')
  return JSON.parse(data)
}

export async function saveEvents(events: Event[]): Promise<void> {
  await fs.writeFile(eventsFile, JSON.stringify(events, null, 2))
}

export async function addEvent(event: Event): Promise<Event> {
  const events = await getEvents()
  const newEvent = { ...event, id: Date.now().toString() }
  events.push(newEvent)
  await saveEvents(events)
  return newEvent
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await getEvents()
  const updatedEvents = events.filter(event => event.id !== id)
  await saveEvents(updatedEvents)
}

