"use client"

import { useState, useEffect } from 'react'
import { EventForm } from "@/components/EventForm"
import { EventCalendar } from '@/components/EventCalendar'
import { EventPrint } from '@/components/EventPrint'
import { MonthlyEventList } from '@/components/MonthlyEventList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ListTodo, PlusCircle, Printer, LogOut, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Event } from '@/components/types/event'

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  )
  const [isAdmin, setIsAdmin] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adminCode, setAdminCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const response = await fetch('/api/events')
    if (response.ok) {
      const data = await response.json()
      setEvents(data)
    }
  }

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false)
    } else {
      setIsDialogOpen(true)
    }
  }

  const handleDialogSubmit = () => {
    if (adminCode === "220504") {
      setIsAdmin(true)
      setIsDialogOpen(false)
      setError("")
    } else {
      setError("Invalid code. Please try again.")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 min-h-screen flex flex-col"
    >
      <header className="flex justify-between items-center mb-8">
        <motion.h1 
          className="text-4xl font-bold text-primary"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          IIIT Sricity Tech Club Events
        </motion.h1>
        <Button onClick={handleAdminToggle} variant="outline">
          {isAdmin ? (
            <>
              <LogOut className="mr-2 h-4 w-4" /> Exit Admin Mode
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" /> Enter Admin Mode
            </>
          )}
        </Button>
      </header>
      <Tabs defaultValue="calendar" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Event
            </TabsTrigger>
          )}
          <TabsTrigger value="print">
            <Printer className="mr-2 h-4 w-4" />
            Print View
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <ListTodo className="mr-2 h-4 w-4" />
            Monthly List
          </TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <TabsContent value="calendar" className="h-full">
              <EventCalendar 
                selectedMonth={selectedMonth} 
                setSelectedMonth={setSelectedMonth}
                events={events}
                isAdmin={isAdmin}
                onDelete={fetchEvents}
              />
            </TabsContent>
            {isAdmin && (
              <TabsContent value="add">
                <EventForm onEventAdded={fetchEvents} />
              </TabsContent>
            )}
            <TabsContent value="print">
              <EventPrint selectedMonth={selectedMonth} events={events} />
            </TabsContent>
            <TabsContent value="monthly">
              <MonthlyEventList 
                selectedMonth={selectedMonth} 
                setSelectedMonth={setSelectedMonth}
                events={events}
                isAdmin={isAdmin}
                onDelete={fetchEvents}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Enter Admin Code</h2>
            <input
              type="password"
              className="border border-gray-300 rounded w-full p-2 mb-4"
              placeholder="Enter code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleDialogSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

