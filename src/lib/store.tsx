import { allEvents as initialEvents, type Event } from './eventsData';
import { houses as initialHouses, type House } from './houses';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extend Event type for admin features
export interface AdminEvent extends Event {
  id: string;
  visibility: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participantCount: number;
  prizeInfo: string;
}

export interface Participant {
  id: string;
  name: string;
  regNo: string;
  email: string;
  house: string;
  event: string;
  status: 'confirmed' | 'pending' | 'waitlisted';
  checkIn: boolean;
  certificate: boolean;
}

interface DataContextType {
  events: AdminEvent[];
  houses: House[];
  participants: Participant[];
  updateEvent: (updatedEvent: AdminEvent) => void;
  updateHouse: (updatedHouse: House) => void;
  updateParticipant: (updatedParticipant: Participant) => void;
  updateHousePoints: (houseName: string, points: number) => void;
  settings: {
    festivalStatus: 'pre' | 'live' | 'post';
    registrationsOpen: boolean;
    coordinatorAssignments: Record<string, string>;
  };
  updateSettings: (newSettings: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to initialize admin events from static data
const initializeEvents = (): AdminEvent[] => {
  return initialEvents.map((e, index) => ({
    ...e,
    id: `event-${index}`,
    visibility: true,
    status: 'upcoming',
    participantCount: Math.floor(Math.random() * 150) + 20, // Random mock count
    prizeInfo: 'Trophy + Certificate'
  }));
};

// Mock participants
const generateMockParticipants = (events: AdminEvent[], houses: House[]): Participant[] => {
  const participants: Participant[] = [];
  const names = ["Aravind", "Bhavana", "Chandra", "Deepak", "Eshwar", "Farzana", "Gautam", "Hema", "Indira", "Jeevan"];
  
  for (let i = 0; i < 50; i++) {
    const event = events[Math.floor(Math.random() * events.length)];
    const house = houses[Math.floor(Math.random() * houses.length)];
    participants.push({
      id: `p-${i}`,
      name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}`,
      regNo: `2026SIM${1000 + i}`,
      email: `${names[i % names.length].toLowerCase()}@example.com`,
      house: house.name,
      event: event.name,
      status: 'confirmed',
      checkIn: Math.random() > 0.5,
      certificate: false
    });
  }
  return participants;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [settings, setSettings] = useState({
    festivalStatus: 'pre' as const,
    registrationsOpen: true,
    coordinatorAssignments: {} as Record<string, string>,
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem('simmam_events');
    const storedHouses = localStorage.getItem('simmam_houses');
    const storedParticipants = localStorage.getItem('simmam_participants');
    const storedSettings = localStorage.getItem('simmam_settings');

    const initialAdminEvents = initializeEvents();
    
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    else setEvents(initialAdminEvents);

    if (storedHouses) setHouses(JSON.parse(storedHouses));
    else setHouses(initialHouses);

    if (storedParticipants) setParticipants(JSON.parse(storedParticipants));
    else setParticipants(generateMockParticipants(initialAdminEvents, initialHouses));

    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const updateEvent = (updatedEvent: AdminEvent) => {
    const newEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(newEvents);
    localStorage.setItem('simmam_events', JSON.stringify(newEvents));
  };

  const updateHouse = (updatedHouse: House) => {
    const newHouses = houses.map(h => h.name === updatedHouse.name ? updatedHouse : h);
    setHouses(newHouses);
    localStorage.setItem('simmam_houses', JSON.stringify(newHouses));
  };

  const updateParticipant = (updatedParticipant: Participant) => {
    const newParticipants = participants.map(p => p.id === updatedParticipant.id ? updatedParticipant : p);
    setParticipants(newParticipants);
    localStorage.setItem('simmam_participants', JSON.stringify(newParticipants));
  };

  const updateHousePoints = (houseName: string, points: number) => {
    const newHouses = houses.map(h => {
      if (h.name === houseName) {
        return { ...h, points2025: h.points2025 + points };
      }
      return h;
    });
    setHouses(newHouses);
    localStorage.setItem('simmam_houses', JSON.stringify(newHouses));
  };

  const updateSettings = (newSettings: any) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('simmam_settings', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{ 
      events, 
      houses, 
      participants, 
      updateEvent, 
      updateHouse, 
      updateParticipant, 
      updateHousePoints,
      settings,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
