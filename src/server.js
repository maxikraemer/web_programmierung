import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'url';

// Routen Importe
import customerRoutes from './routes/customers.js';
import ticketRoutes from './routes/tickets.js';
import { db, generateId } from './data/store.js';

// Setup für __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Plugins registrieren
fastify.register(cors, { origin: '*' }); // Erlaubt Zugriff vom Frontend
fastify.register(multipart); // Für Datei Uploads

// Statische Dateien servieren (für die abrufbaren .txt Dateien)
// Ordner liegt im Root 'assets'
fastify.register(staticPlugin, {
  root: path.join(process.cwd(), 'assets'),
  prefix: '/assets/',
});

// A6: Test-Generator Endpunkt
// Generiert Dummy Daten für manuelles Testen
fastify.post('/api/debug/generate', async (request, reply) => {
  // 1. Dummy Customers
  const custNames = ['Acme Corp', 'Wayne Enterprises', 'Stark Industries'];
  const createdCustomers = [];

  for (const name of custNames) {
    const cust = {
      id: generateId(),
      name,
      city: 'Example City',
      createdAt: new Date().toISOString()
    };
    db.customers.set(cust.id, cust);
    createdCustomers.push(cust);
  }

  // 2. Dummy Tickets
  const ticketTitles = ['Server down', 'Login fehlerhaft', 'Anfrage Feature X'];
  const priorities = ['High', 'Medium', 'Low'];

  for (let i = 0; i < 5; i++) {
    const ticket = {
      id: generateId(),
      title: ticketTitles[i % ticketTitles.length],
      description: 'Automatisch generiertes Test-Ticket',
      priority: priorities[i % priorities.length],
      status: i === 0 ? 'Resolved' : 'Open', // Ein Ticket Resolved, Rest Open
      customerId: createdCustomers[0].id, // Alle hängen am ersten Kunden
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.tickets.set(ticket.id, ticket);
  }

  return { message: 'Testdaten erfolgreich generiert.', stats: { customers: db.customers.size, tickets: db.tickets.size } };
});

// Routen registrieren
fastify.register(customerRoutes, { prefix: '/api/customers' });
fastify.register(ticketRoutes, { prefix: '/api/tickets' });

// Health Check
fastify.get('/', async (request, reply) => {
  return { status: 'ok', service: 'ServiceDesk Central API' };
});

// Server starten
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server läuft auf http://localhost:3000');
    console.log('Dokumentation: Nutze Bruno/Postman für Requests.');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();