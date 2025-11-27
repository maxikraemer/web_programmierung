import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { api } from '../services/api';

/**
 * CreateTicket Komponente
 * Formular zum Erstellen neuer Tickets.
 * Enthält Logik, um entweder einen bestehenden Kunden auszuwählen 
 * oder inline einen neuen Kunden anzulegen.
 */
const CreateTicket = () => {
  const [customers, setCustomers] = useState([]);
  // Haupt-Formulardaten für das Ticket
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Low', customerId: '' });
  
  // UI-State: Wechselt zwischen Dropdown (bestehend) und Formular (neu)
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  
  // Daten für die Inline-Kundenerstellung
  const [newCustomerData, setNewCustomerData] = useState({ name: '', city: '', email: '' });
  
  const navigate = useNavigate();

  // Lädt die Liste der verfügbaren Kunden für das Dropdown
  const loadCustomers = async () => {
    try {
      const data = await api.fetch('/customers');
      setCustomers(data);
    } catch (error) {
      console.error("Kunden konnten nicht geladen werden", error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /**
   * Handelt das Erstellen eines neuen Kunden.
   * Speichert den Kunden im Backend und wählt ihn danach automatisch im Ticket-Formular aus.
   */
  const handleCreateCustomer = async () => {
    try {
      if (!newCustomerData.name || !newCustomerData.city) {
        alert("Bitte mindestens Name und Stadt angeben.");
        return;
      }

      // Daten kopieren und leere Email entfernen (Validierungsschutz)
      const payload = { ...newCustomerData };
      if (!payload.email || payload.email.trim() === '') {
        delete payload.email;
      }

      // API Call zum Erstellen des Kunden
      const newCustomer = await api.fetch('/customers', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Liste aktualisieren und neuen Kunden auswählen
      await loadCustomers();
      setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
      
      // UI zurücksetzen
      setIsCreatingCustomer(false);
      setNewCustomerData({ name: '', city: '', email: '' });

    } catch (err) {
      alert("Fehler beim Erstellen des Kunden: " + err.message);
    }
  };

  /**
   * Sendet das Ticket an das Backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validierung: Ein Kunde muss ausgewählt sein
      if (!formData.customerId && !isCreatingCustomer) {
        alert("Bitte wählen Sie einen Kunden aus.");
        return;
      }

      // Verhindert Absenden, wenn man gerade noch im "Neuer Kunde"-Modus ist
      if (isCreatingCustomer) {
        alert("Bitte speichern Sie den neuen Kunden zuerst (Button 'Kunde speichern').");
        return;
      }

      await api.fetch('/tickets', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      // Erfolgreich -> Zurück zum Dashboard
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Neues Ticket erfassen</h1>
      
      <div className="bg-white p-6 rounded shadow space-y-6">
        
        {/* --- Bereich: Kundenauswahl / Erstellung --- */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} /> Kunde zuordnen
          </h2>

          {!isCreatingCustomer ? (
            // Modus: Bestehenden Kunden wählen
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunden auswählen</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerId}
                  onChange={e => setFormData({...formData, customerId: e.target.value})}
                >
                  <option value="">-- Bitte wählen --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.city})</option>)}
                </select>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCreatingCustomer(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-[42px] whitespace-nowrap transition-colors"
              >
                + Neuer Kunde
              </button>
            </div>
          ) : (
            // Modus: Neuen Kunden anlegen
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-green-800">Neuen Kunden anlegen</span>
                <button 
                  type="button" 
                  onClick={() => setIsCreatingCustomer(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Abbrechen
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  placeholder="Firmenname *" 
                  className="border p-2 rounded w-full" 
                  value={newCustomerData.name} 
                  onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})} 
                />
                <input 
                  placeholder="Stadt *" 
                  className="border p-2 rounded w-full" 
                  value={newCustomerData.city} 
                  onChange={e => setNewCustomerData({...newCustomerData, city: e.target.value})} 
                />
                <input 
                  placeholder="E-Mail (Optional)" 
                  type="email"
                  className="md:col-span-2 border p-2 rounded w-full" 
                  value={newCustomerData.email} 
                  onChange={e => setNewCustomerData({...newCustomerData, email: e.target.value})} 
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  type="button" 
                  onClick={handleCreateCustomer}
                  className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 transition-colors"
                >
                  Kunde speichern
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Bereich: Ticket Daten --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input 
              required 
              placeholder="Ticket Titel" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorität</label>
            <select 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.priority} 
              onChange={e => setFormData({...formData, priority: e.target.value})}
            >
              <option value="Low">Niedrig</option>
              <option value="Medium">Mittel</option>
              <option value="High">Hoch</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea 
              required 
              placeholder="Beschreibung..." 
              className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isCreatingCustomer} 
            className={`w-full py-3 rounded font-bold text-white transition-colors ${
              isCreatingCustomer ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Ticket erstellen
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;