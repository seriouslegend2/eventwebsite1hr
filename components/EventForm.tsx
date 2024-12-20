"use client"

import { useState } from 'react'
import { Event } from "@/components/types/event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface EventFormProps {
  onEventAdded: () => void
}

export function EventForm({ onEventAdded }: EventFormProps) {
  const [event, setEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    club: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    description: '',
    venue: '',
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      if (response.ok) {
        toast({
          title: "Event added successfully!",
          description: "Your new event has been added to the calendar.",
        })
        onEventAdded()
        setEvent({
          title: '',
          club: '',
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date().toISOString().slice(0, 16),
          description: '',
          venue: '',
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        })
      } else {
        throw new Error('Failed to add event')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent(prev => ({ ...prev, [name]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Event</CardTitle>
          <CardDescription>Fill in the details to create a new event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={event.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club">Club Name</Label>
              <Input
                id="club"
                name="club"
                value={event.club}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={event.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={event.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={event.venue}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Event Color</Label>
              <Input
                id="color"
                name="color"
                type="color"
                value={event.color}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">Add Event</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

