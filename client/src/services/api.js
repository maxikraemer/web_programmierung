// Die Basis-URL der API. 
// Nutzung von 127.0.0.1 statt localhost verhindert Probleme mit Node v17+ IPv6 Auflösung.
const API_URL = 'http://127.0.0.1:3000/api';

/**
 * Zentraler API-Service für die Kommunikation mit dem Backend.
 * Kapselt Fetch-Logik, Header-Management und Fehlerbehandlung.
 */
export const api = {
  /**
   * Erstellt die notwendigen HTTP-Header für Anfragen.
   * Liest die aktuelle Rolle aus dem LocalStorage für die Basic Auth.
   * @returns {Object} Header-Objekt
   */
  getHeaders: () => {
    const role = localStorage.getItem('userRole') || 'User';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${role}` 
    };
  },

  /**
   * Generische Fetch-Funktion für JSON-Anfragen.
   * Wirft einen Fehler, wenn der Status-Code nicht im 2xx Bereich liegt.
   * * @param {string} endpoint - Der API-Pfad (z.B. '/tickets')
   * @param {Object} options - Fetch-Optionen (Method, Body, etc.)
   */
  async fetch(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    });
    
    if (!res.ok) {
      // Versuchen, die Fehlermeldung vom Server zu parsen, Fallback auf StatusText
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fehler: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Spezielle Funktion für Datei-Uploads (Multipart/Form-Data).
   * Hier darf KEIN 'Content-Type: application/json' gesetzt werden, 
   * da der Browser den Boundary-String selbst setzen muss.
   * * @param {string} ticketId - ID des Tickets
   * @param {File} file - Das File-Objekt aus dem Input
   */
  async uploadFile(ticketId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Auth-Header manuell holen, da wir die generische getHeaders() hier nur teilweise nutzen können
    const role = localStorage.getItem('userRole') || 'User';
    
    const res = await fetch(`${API_URL}/tickets/${ticketId}/files`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${role}` },
      body: formData
    });

    if (!res.ok) throw new Error('Upload fehlgeschlagen');
    return res.json();
  }
};