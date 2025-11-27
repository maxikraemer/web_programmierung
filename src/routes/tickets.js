import { db, generateId } from '../data/store.js';
import { requireRole, ROLES } from '../utils/auth.js';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'assets');

// Helper: Sicherstellen, dass Upload Ordner existiert
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export default async function ticketRoutes(fastify, options) {

  // --- A1: CREATE TICKET ---
  fastify.post('/', {
    preHandler: requireRole([ROLES.USER, ROLES.SUPPORT]) // Engineer legt selten Tickets an, aber könnte erlaubt sein
  }, async (request, reply) => {
    const { title, description, priority, customerId } = request.body;

    // Validierung: Existiert der Kunde?
    if (!db.customers.has(customerId)) {
      return reply.code(400).send({ error: 'Bad Request', message: 'Kunden ID existiert nicht.' });
    }

    const newTicket = {
      id: generateId(),
      title,
      description,
      priority: priority || 'Low',
      status: 'Draft', // A4: Initialer Status
      customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.tickets.set(newTicket.id, newTicket);
    return reply.code(201).send(newTicket);
  });

  // --- A1 & A7: GET TICKETS (mit Filter) ---
  fastify.get('/', {
    preHandler: requireRole([ROLES.USER, ROLES.SUPPORT, ROLES.ENGINEER])
  }, async (request, reply) => {
    const { status, priority, title, customerId } = request.query;
    let tickets = Array.from(db.tickets.values());

    if (status) tickets = tickets.filter(t => t.status === status);
    if (priority) tickets = tickets.filter(t => t.priority === priority);
    if (customerId) tickets = tickets.filter(t => t.customerId === customerId);
    if (title) tickets = tickets.filter(t => t.title.toLowerCase().includes(title.toLowerCase()));

    return tickets;
  });

  // --- A1: GET SINGLE TICKET ---
  fastify.get('/:id', async (request, reply) => {
    const ticket = db.tickets.get(request.params.id);
    if (!ticket) return reply.code(404).send({ error: 'Not Found' });
    return ticket;
  });

  // --- A4 & A5: PATCH STATUS (Statusübergänge) ---
  fastify.patch('/:id/status', {
    // Auth Check passiert manuell in der Handler-Logik für granulare Kontrolle, 
    // oder hier allgemein und dann verfeinert. Wir nutzen hier allgemein RequireRole.
    preHandler: requireRole([ROLES.SUPPORT, ROLES.ENGINEER]) // User darf keinen Status ändern (laut A5)
  }, async (request, reply) => {
    const ticket = db.tickets.get(request.params.id);
    if (!ticket) return reply.code(404).send({ error: 'Not Found' });

    const { status: newStatus } = request.body;
    const currentStatus = ticket.status;
    const role = request.userRole;

    // Logik & Regeln (A4)
    let allowed = false;

    // Regel: In Draft/Open dürfen Inhalte gepflegt werden, nach Resolved/Archived nicht mehr.
    // Das betrifft PUT Requests, hier prüfen wir nur Statusübergänge.

    // Statusübergänge Logik
    if (currentStatus === 'Draft' && newStatus === 'Open') {
      // Annahme: Support Agent oder Engineer darf freigeben
      if (role === ROLES.SUPPORT || role === ROLES.ENGINEER) allowed = true;
    } 
    else if ((currentStatus === 'Open' || currentStatus === 'Draft') && newStatus === 'In-Progress') {
      // Nur Engineer darf technische Prüfung starten
      if (role === ROLES.ENGINEER) allowed = true;
    }
    else if (newStatus === 'Resolved') {
      // Nur Engineer darf lösen
      if (role === ROLES.ENGINEER) allowed = true;
    }
    else if (newStatus === 'Archived') {
      // Support Agent darf archivieren
      if (role === ROLES.SUPPORT) allowed = true;
    }

    if (!allowed) {
      return reply.code(403).send({ 
        error: 'Forbidden', 
        message: `Statuswechsel von ${currentStatus} zu ${newStatus} ist für Rolle ${role} nicht erlaubt.` 
      });
    }

    // Update durchführen
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    db.tickets.set(ticket.id, ticket);

    return ticket;
  });

  // --- A2: DATEI UPLOAD (.txt) ---
  fastify.post('/:id/files', {
    preHandler: requireRole([ROLES.SUPPORT, ROLES.ENGINEER, ROLES.USER])
  }, async (request, reply) => {
    const ticket = db.tickets.get(request.params.id);
    if (!ticket) return reply.code(404).send({ error: 'Not Found' });

    // A4 Check: Keine Änderungen erlaubt wenn Resolved/Archived
    if (['Resolved', 'Archived'].includes(ticket.status)) {
      return reply.code(400).send({ error: 'Bad Request', message: 'Ticket ist abgeschlossen. Upload nicht erlaubt.' });
    }

    const data = await request.file();
    
    // Validierung: Nur .txt erlaubt (A2)
    if (!data.filename.endsWith('.txt')) {
      return reply.code(415).send({ error: 'Unsupported Media Type', message: 'Nur .txt Dateien erlaubt.' });
    }

    const fileId = generateId();
    const storedFileName = `${fileId}_${data.filename}`;
    const filePath = path.join(UPLOAD_DIR, storedFileName);

    // Datei auf Dateisystem speichern
    await pipeline(data.file, fs.createWriteStream(filePath));

    // Metadaten speichern
    const fileEntry = {
      id: fileId,
      ticketId: ticket.id,
      originalName: data.filename,
      storedName: storedFileName,
      url: `/assets/${storedFileName}`, // Statische URL
      uploadedAt: new Date().toISOString()
      // tags: [] // (Vorbereitung für Aufgabe 3)
    };

    db.files.set(fileId, fileEntry);
    return reply.code(201).send(fileEntry);
  });

  // --- A2: DATEI LISTE ---
  fastify.get('/:id/files', async (request, reply) => {
    const ticketId = request.params.id;
    // Filter Files für dieses Ticket
    const files = Array.from(db.files.values()).filter(f => f.ticketId === ticketId);
    return files;
  });

  // --- A3: KOMMENTARE (CRUD) ---
  fastify.post('/:id/comments', {
    preHandler: requireRole([ROLES.SUPPORT, ROLES.ENGINEER, ROLES.USER])
  }, async (request, reply) => {
    const ticketId = request.params.id;
    const ticket = db.tickets.get(ticketId);
    
    if (!ticket) return reply.code(404).send('Ticket nicht gefunden');
    if (['Resolved', 'Archived'].includes(ticket.status)) {
      return reply.code(400).send('Ticket abgeschlossen. Kommentieren nicht möglich.');
    }

    const { text } = request.body;
    const newComment = {
      id: generateId(),
      ticketId,
      text,
      author: request.userRole, // Vereinfachung: Rolle als Autor, da keine echten User-Accounts
      createdAt: new Date().toISOString()
    };

    db.comments.set(newComment.id, newComment);
    return reply.code(201).send(newComment);
  });

  // Kommentare abrufen
  fastify.get('/:id/comments', async (request, reply) => {
    const comments = Array.from(db.comments.values())
      .filter(c => c.ticketId === request.params.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return comments;
  });
}