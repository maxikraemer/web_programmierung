import React from 'react';

/**
 * StatusBadge Komponente
 * Zeigt den Status eines Tickets visuell hervorgehoben an.
 */
const StatusBadge = ({ status }) => {
  // Mapping von Status zu Tailwind Farbkombinationen
  const colors = {
    'Draft': 'bg-gray-200 text-gray-800',
    'Open': 'bg-blue-100 text-blue-800 border border-blue-200',
    'In-Progress': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'Resolved': 'bg-green-100 text-green-800 border border-green-200',
    'Archived': 'bg-purple-100 text-purple-800 border border-purple-200'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;