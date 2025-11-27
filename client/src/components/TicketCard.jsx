import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * TicketCard Komponente
 * Zeigt eine kompakte Vorschau eines Tickets für Listenansichten an.
 */
const TicketCard = ({ ticket }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
    {/* Header: Status und Datum */}
    <div className="flex justify-between items-start mb-2">
      <StatusBadge status={ticket.status} />
      <span className="text-xs text-gray-500 font-mono">
        {new Date(ticket.createdAt).toLocaleDateString()}
      </span>
    </div>
    
    {/* Titel Link */}
    <Link to={`/tickets/${ticket.id}`} className="font-bold text-lg text-slate-800 hover:text-blue-600 transition-colors mb-1 block">
      {ticket.title}
    </Link>
    
    {/* Beschreibung (gekürzt via CSS line-clamp) */}
    <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">
      {ticket.description}
    </p>
    
    {/* Footer: Priorität */}
    <div className="mt-3 text-xs font-medium text-gray-400 border-t pt-2 w-full">
      Prio: <span className="text-gray-600">{ticket.priority}</span>
    </div>
  </div>
);

export default TicketCard;