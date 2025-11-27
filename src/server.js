import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'url';

// Routen Importe
import customerRoutes from './routes/customers.js';
import ticketRoutes from './routes/tickets.js';
import fileRoutes from './routes/files.js';
import taskRoutes from './routes/tasks.js'; 
import { db, generateId } from './data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });
fastify.register(multipart);

fastify.register(staticPlugin, {
  root: path.join(process.cwd(), 'assets'),
  prefix: '/assets/',
});

// Test-Daten Generator
fastify.post('/api/debug/generate', async (request, reply) => {
  return { message: 'Seed logic is now in store.js' };
});

// Routen registrieren
fastify.register(customerRoutes, { prefix: '/api/customers' });
fastify.register(ticketRoutes, { prefix: '/api/tickets' });
fastify.register(fileRoutes, { prefix: '/api/files' });
fastify.register(taskRoutes, { prefix: '/api/tasks' });

fastify.get('/', async () => ({ status: 'ok', service: 'ServiceDesk Central API' }));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server läuft auf http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();