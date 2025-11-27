/**
 * store.js
 * Dient als In-Memory Datenbank Ersatz.
 * In einer echten Produktion würde hier Prisma/Postgres stehen.
 */

// Daten-Container
export const db = {
  customers: new Map(),
  tickets: new Map(),
  comments: new Map(),
  files: new Map()
};

// Hilfsfunktion für eindeutige IDs (einfache UUID simulation)
export const generateId = () => crypto.randomUUID();

// Initialer Reset / Seed für Tests
export const resetStore = () => {
  db.customers.clear();
  db.tickets.clear();
  db.comments.clear();
  db.files.clear();
  console.log('Datenbank zurückgesetzt.');
};