import { randomUUID } from 'crypto';

/**
 * store.js
 * In-Memory State Management.
 * Simuliert die Persistenzschicht für den MVP.
 */

// Globaler Daten-Container
export const db = {
  customers: new Map(),
  tickets: new Map(),
  comments: new Map(),
  files: new Map()
};

// Generiert UUIDs für Entitäten
export const generateId = () => randomUUID();

// Setzt den Store komplett zurück (für Testing-Zwecke)
export const resetStore = () => {
  db.customers.clear();
  db.tickets.clear();
  db.comments.clear();
  db.files.clear();
};

// Initialisiert die Applikation mit Basis-Daten
const seedData = () => {
  // Verhindert doppeltes Seeding, falls Modul neu geladen wird
  if (db.customers.size > 0) return;

  console.log('Info: Initialisiere Datenbank mit Seed-Daten...');

  // Customers
  const cust1 = { id: generateId(), name: 'Prismarine Solutions', city: 'Berlin', email: 'info@prismarine.de', createdAt: new Date().toISOString() };
  const cust2 = { id: generateId(), name: 'ACME Corp', city: 'Hamburg', email: 'contact@acme.com', createdAt: new Date().toISOString() };
  const cust3 = { id: generateId(), name: 'Wayne Enterprises', city: 'Gotham', email: 'bruce@wayne.com', createdAt: new Date().toISOString() };

  db.customers.set(cust1.id, cust1);
  db.customers.set(cust2.id, cust2);
  db.customers.set(cust3.id, cust3);

  // Tickets
  const tickets = [
    {
      id: generateId(),
      title: 'Login funktioniert nicht',
      description: 'Benutzer erhalten beim Login einen 500er Fehler. Scheint an der Auth-API zu liegen.',
      status: 'Open',
      priority: 'High',
      customerId: cust1.id,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Feature Request: Dark Mode',
      description: 'Der Kunde wünscht sich einen Dark Mode für das Dashboard.',
      status: 'Draft',
      priority: 'Low',
      customerId: cust1.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Server Performance Nachts',
      description: 'Latenzzeiten steigen zwischen 2 und 4 Uhr morgens stark an.',
      status: 'In-Progress',
      priority: 'Medium',
      customerId: cust2.id,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Alte Logs archivieren',
      description: 'Logfiles aus 2023 müssen archiviert werden.',
      status: 'Resolved',
      priority: 'Low',
      customerId: cust2.id,
      createdAt: new Date(Date.now() - 400000000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Bat-Signal defekt',
      description: 'Der Scheinwerfer auf dem Dach flackert.',
      status: 'Open',
      priority: 'High',
      customerId: cust3.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Bestellung Kryptonit',
      description: 'Lieferung verzögert sich.',
      status: 'Archived',
      priority: 'High',
      customerId: cust3.id,
      createdAt: new Date(Date.now() - 1000000000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  tickets.forEach(t => db.tickets.set(t.id, t));

  // Comments
  const comment1 = {
    id: generateId(),
    ticketId: tickets[0].id,
    text: 'Ich habe mir die Logs angesehen, sieht nach einem DB-Timeout aus.',
    author: 'Engineer',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  };
  
  const comment2 = {
    id: generateId(),
    ticketId: tickets[2].id,
    text: 'Monitoring Tool wurde installiert.',
    author: 'Support-Agent',
    createdAt: new Date().toISOString()
  };

  db.comments.set(comment1.id, comment1);
  db.comments.set(comment2.id, comment2);

  console.log(`Database Seed complete. Customers: ${db.customers.size}, Tickets: ${db.tickets.size}`);
};

seedData();