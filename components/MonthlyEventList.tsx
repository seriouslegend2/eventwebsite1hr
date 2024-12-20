"use client"

import { Event } from "@/components/types/event"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parse, addMonths, subMonths } from 'date-fns'
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

interface MonthlyEventListProps {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  events: Event[]
  isAdmin: boolean
  onDelete: () => void
}

export function MonthlyEventList({ selectedMonth, setSelectedMonth, events, isAdmin, onDelete }: MonthlyEventListProps) {
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate)
    return eventDate.getFullYear() === parseInt(selectedMonth.split('-')[0]) &&
           eventDate.getMonth() === parseInt(selectedMonth.split('-')[1]) - 1
  })

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  const handlePrevMonth = () => {
    const prevMonth = subMonths(parse(selectedMonth, 'yyyy-MM', new Date()), 1)
    setSelectedMonth(format(prevMonth, 'yyyy-MM'))
  }

  const handleNextMonth = () => {
    const nextMonth = addMonths(parse(selectedMonth, 'yyyy-MM', new Date()), 1)
    setSelectedMonth(format(nextMonth, 'yyyy-MM'))
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Event List</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>{format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(new Date().getFullYear(), i, 1)
                  return (
                    <SelectItem key={i} value={format(date, 'yyyy-MM')}>
                      {format(date, 'MMMM yyyy')}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Events for {format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            {filteredEvents.map(event => (
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
                  {format(new Date(event.startDate), 'MMM d, h:mm a')} - {format(new Date(event.endDate), 'MMM d, h:mm a')}
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
  )
}

