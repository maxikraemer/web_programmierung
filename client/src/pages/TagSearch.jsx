import React, { useState, useEffect } from 'react';
import { Search, Loader, FileText, Tag } from 'lucide-react';
import { api } from '../services/api';

/**
 * TagSearch Komponente (Aufgabe 3)
 * Implementiert eine asynchrone Suche (Long Running Operation).
 */
const TagSearch = () => {
  const [searchTags, setSearchTags] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('Idle'); // Idle, Pending, Completed
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0); // Fake Progress Bar für UX

  // Polling Effekt
  useEffect(() => {
    let intervalId;

    if (taskId && status === 'Pending') {
      // Fake Progress erhöhen (nur für Optik, da wir keine echten % vom Server kriegen)
      const progressInterval = setInterval(() => {
        setProgress(old => (old < 90 ? old + 1 : old));
      }, 500);

      // Echtes Polling alle 5 Sekunden (laut Aufgabe)
      intervalId = setInterval(async () => {
        try {
          console.log(`Polling Task ${taskId}...`);
          const task = await api.getTaskStatus(taskId);
          
          if (task.status === 'Completed') {
            setStatus('Completed');
            setResults(task.result);
            setTaskId(null); // Polling beenden
            setProgress(100);
            clearInterval(progressInterval);
          }
        } catch (err) {
          console.error("Polling Error:", err);
        }
      }, 5000); 

      return () => {
        clearInterval(intervalId);
        clearInterval(progressInterval);
      };
    }
  }, [taskId, status]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTags.trim()) return;

    try {
      setStatus('Pending');
      setResults([]);
      setProgress(0);
      
      const tagsArray = searchTags.split(',').map(t => t.trim()).filter(t => t);
      
      // LRO starten
      const response = await api.startTagSearch(tagsArray);
      setTaskId(response.taskId);
      
    } catch (err) {
      alert("Fehler beim Starten der Suche: " + err.message);
      setStatus('Idle');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Search /> Datei-Suche nach Tags (LRO)
      </h1>

      {/* Suchformular */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            className="flex-1 border p-3 rounded text-lg"
            placeholder="Tags eingeben (z.B. Logfile, Critical)..."
            value={searchTags}
            onChange={e => setSearchTags(e.target.value)}
            disabled={status === 'Pending'}
          />
          <button 
            type="submit" 
            disabled={status === 'Pending' || !searchTags}
            className={`px-6 py-3 rounded font-bold text-white flex items-center gap-2 ${
              status === 'Pending' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === 'Pending' ? <Loader className="animate-spin"/> : <Search />}
            Suche starten
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-2">
          Hinweis: Die Suche dauert ca. 60 Sekunden. Bitte warten Sie auf das Ergebnis.
        </p>
      </div>

      {/* Status & Loading Anzeige */}
      {status === 'Pending' && (
        <div className="bg-blue-50 p-8 rounded border border-blue-200 text-center mb-8 animate-pulse">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <h3 className="text-xl font-bold text-blue-800 mb-2">Verarbeite Dateien...</h3>
          <p className="text-blue-600">Task ID: {taskId}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Ergebnisse */}
      {status === 'Completed' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Suchergebnisse ({results.length})</h2>
          
          {results.length === 0 ? (
            <p className="text-gray-500 italic">Keine Dateien mit diesen Tags gefunden.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(file => (
                <div key={file.id} className="bg-white p-4 rounded shadow border hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <a href={`http://localhost:3000${file.url}`} target="_blank" className="font-bold text-blue-600 flex items-center gap-2">
                      <FileText size={18} /> {file.originalName}
                    </a>
                    <span className="text-xs text-gray-400">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {file.tags?.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSearch;