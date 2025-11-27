import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Archive, Plus } from 'lucide-react';
import { api } from '../services/api';
import TicketCard from '../components/TicketCard';

/**
 * Dashboard Komponente
 * Die Startseite der Anwendung. Zeigt Tickets gruppiert nach Status an.
 * Ermöglicht schnellen Zugriff auf offene, gelöste und archivierte Tickets.
 */
const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Lädt alle Tickets beim Start
  useEffect(() => {
    api.fetch('/tickets')
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // Filterung der Tickets für die verschiedenen Sektionen
  const openTickets = tickets.filter(t => ['Open', 'In-Progress', 'Draft'].includes(t.status));
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  const archivedTickets = tickets.filter(t => t.status === 'Archived');

  if (loading) return <div className="p-8 text-center text-gray-500">Daten werden geladen...</div>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Bereich mit Aktion zum Erstellen */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Übersicht</h1>
        <Link to="/create-ticket" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition-colors">
          <Plus size={18} /> Neues Ticket
        </Link>
      </div>

      {/* Sektion: Aktive Tickets */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
          <AlertCircle className="text-blue-500"/> Offene Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
          {openTickets.length === 0 && <p className="text-gray-500 italic">Aktuell keine offenen Tickets.</p>}
        </div>
      </section>

      {/* Sektion: Gelöste Tickets */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
          <CheckCircle className="text-green-500"/> Gelöst
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
          {resolvedTickets.length === 0 && <p className="text-gray-500 italic">Keine gelösten Tickets.</p>}
        </div>
      </section>

      {/* Sektion: Archiv (Einklappbar) */}
      <section>
        <button 
          onClick={() => setShowArchived(!showArchived)}
          className="text-gray-500 font-medium flex items-center gap-2 hover:text-gray-700 transition-colors"
        >
          <Archive size={18} /> {showArchived ? 'Archiv einklappen' : 'Archiv anzeigen'}
        </button>
        
        {showArchived && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-fadeIn">
            {archivedTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
            {archivedTickets.length === 0 && <p className="text-gray-500 italic">Das Archiv ist leer.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;