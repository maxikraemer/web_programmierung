import { db, generateId } from '../data/store.js';
import { requireRole, ROLES } from '../utils/auth.js';

// Schemas für Swagger Doku & Validierung
const customerSchema = {
  body: {
    type: 'object',
    required: ['name', 'city'],
    properties: {
      name: { type: 'string', minLength: 2 },
      city: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  }
};

export default async function customerRoutes(fastify, options) {
  
  // A1: Customer anlegen
  // Nur Support-Agents dürfen Kunden anlegen (Annahme laut Szenario "Kunden pflegen")
  fastify.post('/', {
    schema: customerSchema,
    preHandler: requireRole([ROLES.SUPPORT, ROLES.ENGINEER]) 
  }, async (request, reply) => {
    const { name, city, email } = request.body;
    
    const newCustomer = {
      id: generateId(),
      name,
      city,
      email,
      createdAt: new Date().toISOString()
    };

    db.customers.set(newCustomer.id, newCustomer);
    return reply.code(201).send(newCustomer);
  });

  // A1 & A7: Alle Kunden abrufen + Filterung
  fastify.get('/', {
    preHandler: requireRole([ROLES.SUPPORT, ROLES.ENGINEER, ROLES.USER])
  }, async (request, reply) => {
    const { name, city } = request.query;
    let customers = Array.from(db.customers.values());

    // A7: Filterung implementieren
    if (name) {
      customers = customers.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (city) {
      customers = customers.filter(c => c.city.toLowerCase() === city.toLowerCase());
    }

    // Sortierung nach Namen
    customers.sort((a, b) => a.name.localeCompare(b.name));

    return customers;
  });

  // A1: Einzelnen Kunden abrufen
  fastify.get('/:id', async (request, reply) => {
    const customer = db.customers.get(request.params.id);
    if (!customer) {
      return reply.code(404).send({ error: 'Not Found', message: 'Kunde nicht gefunden' });
    }
    return customer;
  });
}