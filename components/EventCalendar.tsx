"use client"

import { useState } from 'react'
import { Event } from '@/components/types/event'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { format, parse, isSameDay } from 'date-fns'
import { motion, AnimatePresence } from "framer-motion"
import { Trash2 } from 'lucide-react'

interface EventCalendarProps {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  events: Event[]
  isAdmin: boolean
  onDelete: () => void
}

export function EventCalendar({ selectedMonth, setSelectedMonth, events, isAdmin, onDelete }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleMonthChange = (date: Date) => {
    setSelectedMonth(format(date, 'yyyy-MM'))
  }

  const handleDeleteEvent = async (id: string) => {
    const response = await fetch('/api/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      onDelete()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-8"
    >
      <Card className="flex-1 p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
          className="rounded-md border shadow"
        />
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Events for {format(selectedDate || new Date(), 'MMMM d, yyyy')}
          </CardTitle>
          <CardDescription>Click on a date to see events</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <AnimatePresence>
              {events
                .filter(event => isSameDay(new Date(event.startDate), selectedDate || new Date()))
                .map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-4 rounded-lg shadow-md relative"
                    style={{backgroundColor: event.color + '20', borderLeft: `4px solid ${event.color}`}}
                  >
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.club}</p>
                    <p className="text-sm font-medium mt-2">
                      {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                    </p>
                    <p className="text-sm mt-2">{event.description}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Venue:</span> {event.venue}</p>
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleDeleteEvent(event.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

