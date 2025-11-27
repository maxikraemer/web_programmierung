import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * CustomerList Komponente
 * Zeigt eine Übersicht aller registrierten Kunden im System an.
 * Dient dem schnellen Nachschlagen von Kunden-IDs und Stammdaten.
 */
const CustomerList = () => {
  // State für die Liste der Kunden
  const [customers, setCustomers] = useState([]);

  /**
   * Lädt die Kundenliste beim Initialisieren der Komponente.
   */
  useEffect(() => {
    api.fetch('/customers')
      .then(data => setCustomers(data))
      .catch(err => console.error("Fehler beim Laden der Kunden:", err));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kundenverzeichnis</h1>
      
      {/* Grid-Layout für die Kundenkarten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow border hover:border-blue-300 transition-colors">
            <div className="font-bold text-lg">{c.name}</div>
            <div className="text-gray-500 text-sm mb-2">{c.city}</div>
            {/* ID wird gekürzt angezeigt für bessere Lesbarkeit */}
            <div className="text-xs text-gray-400" title={c.id}>
              ID: {c.id.substring(0,8)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;