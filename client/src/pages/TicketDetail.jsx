import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, FileText, Upload } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

/**
 * TicketDetail Komponente
 * Zeigt alle Informationen zu einem spezifischen Ticket an.
 * Beinhaltet Funktionalität für:
 * - Statusänderungen (Rollenbasiert)
 * - Kommentare schreiben
 * - Dateien hochladen
 */
const TicketDetail = () => {
  const { id } = useParams();
  
  // State für die verschiedenen Datenbereiche
  const [ticket, setTicket] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  
  // State für Interaktionen
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // Aktuelle Rolle für Berechtigungs-Checks
  const role = localStorage.getItem('userRole');

  /**
   * Lädt alle relevanten Daten für die Ansicht parallel nach.
   */
  const loadAll = async () => {
    try {
      const t = await api.fetch(`/tickets/${id}`);
      setTicket(t);
      
      // Parallel Daten laden, die von der Ticket-ID abhängen
      // (Kunde muss separat geladen werden, da er im Ticket referenziert ist)
      const c = await api.fetch(`/customers/${t.customerId}`);
      setCustomer(c);
      
      const com = await api.fetch(`/tickets/${id}/comments`);
      setComments(com);
      
      const f = await api.fetch(`/tickets/${id}/files`);
      setFiles(f);
    } catch (e) { 
      setError(e.message); 
    }
  };

  useEffect(() => { loadAll(); }, [id]);

  /**
   * Ändert den Status des Tickets.
   */
  const handleStatusChange = async (newStatus) => {
    try {
      await api.fetch(`/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      loadAll(); // Reload um Änderungen sichtbar zu machen
    } catch (e) { alert(e.message); }
  };

  /**
   * Sendet einen neuen Kommentar.
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newComment.trim()) return;
      
      await api.fetch(`/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment })
      });
      setNewComment('');
      loadAll();
    } catch (e) { alert(e.message); }
  };

  /**
   * Handhabt den Datei-Upload via Input-Change Event.
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await api.uploadFile(id, file);
      loadAll();
    } catch (e) { alert(e.message); }
  };

  // Error und Loading States
  if (error) return <div className="p-8 text-red-500 text-center">Fehler beim Laden: {error}</div>;
  if (!ticket) return <div className="p-8 text-center text-gray-500">Lade Ticketdetails...</div>;

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Linke Hauptspalte: Beschreibung & Aktionen & Kommentare */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Detail Karte */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold mb-2 text-slate-800">{ticket.title}</h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-gray-700 whitespace-pre-wrap mt-2">{ticket.description}</p>
          
          {/* Rollenbasierte Aktions-Buttons */}
          <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
            {role === 'Engineer' && (
              <>
                <button onClick={() => handleStatusChange('In-Progress')} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors">Start Work</button>
                <button onClick={() => handleStatusChange('Resolved')} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors">Resolve</button>
              </>
            )}
            {role === 'Support-Agent' && (
              <button onClick={() => handleStatusChange('Archived')} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors">Archive</button>
            )}
          </div>
        </div>

        {/* Kommentar-Sektion */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
            <MessageSquare size={18}/> Kommentare
          </h3>
          
          <div className="space-y-4 mb-4">
            {comments.map(c => (
              <div key={c.id} className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-slate-700">{c.author}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-800">{c.text}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-gray-400 text-sm italic">Noch keine Kommentare.</p>}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              className="flex-1 border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Kommentar schreiben..." 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
            />
            <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition-colors">Senden</button>
          </form>
        </div>
      </div>

      {/* Rechte Spalte: Metadaten & Dateien */}
      <div className="space-y-6">
        
        {/* Info Box */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Metadaten</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Kunde:</span>
              <Link to={`/customers`} className="text-blue-600 hover:underline font-medium">{customer?.name}</Link>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Priorität:</span>
              <span className="font-medium">{ticket.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Erstellt:</span>
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Dateien Box */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <FileText size={16}/> Dateien
          </h3>
          
          <div className="space-y-3 mb-4">
            {files.map(f => (
              <div key={f.id} className="block p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <a 
                    href={`http://localhost:3000${f.url}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-blue-600 font-medium truncate hover:underline"
                  >
                    {f.originalName}
                  </a>
                  {/* Tags anzeigen */}
                  <div className="flex gap-1">
                    {f.tags && f.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {files.length === 0 && <span className="text-xs text-gray-400 italic">Keine Dateien hochgeladen.</span>}
          </div>
          
          <div className="border-t pt-3">
            <label className="block text-xs font-medium text-gray-700 mb-2">Upload (.txt)</label>
            <label className="cursor-pointer bg-slate-100 px-3 py-2 rounded hover:bg-slate-200 text-sm flex items-center gap-2 w-full justify-center text-slate-600 transition-colors border border-dashed border-slate-300">
              <Upload size={14} /> Datei wählen
              <input type="file" className="hidden" accept=".txt" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;