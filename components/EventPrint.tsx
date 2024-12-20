"use client"

import { useState, useEffect, useRef } from 'react'
import { Event } from "@/components/types/event"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parse } from 'date-fns'

interface EventPrintProps {
  selectedMonth: string
  events: Event[]
}

export function EventPrint({ selectedMonth, events }: EventPrintProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate)
    return eventDate.getFullYear() === parseInt(selectedMonth.split('-')[0]) &&
           eventDate.getMonth() === parseInt(selectedMonth.split('-')[1]) - 1
  })

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Events for ${format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}</title>
              <style>
                body { font-family: Arial, sans-serif; }
                .event { margin-bottom: 10px; padding: 10px; border-radius: 4px; }
                h1 { text-align: center; }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <h1>Events for ${format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}</h1>
              ${content.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <div>
      <Button onClick={handlePrint} className="mb-4">Print Events</Button>
      <Card>
        <CardHeader>
          <CardTitle>Events for {format(parse(selectedMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}</CardTitle>
          <CardDescription>Printable view of all events this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={printRef}>
            {filteredEvents.map(event => (
              <div key={event.id} className="event mb-4 p-4 rounded-lg" style={{backgroundColor: event.color + '20', borderLeft: `4px solid ${event.color}`}}>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.club}</p>
                <p className="text-sm">
                  {format(new Date(event.startDate), 'MMM d, h:mm a')} - {format(new Date(event.endDate), 'MMM d, h:mm a')}
                </p>
                <p className="text-sm mt-2">{event.description}</p>
                <p className="text-sm"><strong>Venue:</strong> {event.venue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

