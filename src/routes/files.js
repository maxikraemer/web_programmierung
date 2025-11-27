import { db, generateId } from '../data/store.js';

export default async function fileRoutes(fastify, options) {
  
  // A1: Tags zu einer Datei hinzufügen/ändern (// Aufgabe3)
  fastify.put('/:id/tags', async (request, reply) => {
    const { id } = request.params;
    const { tags } = request.body; // Erwartet Array von Strings

    const file = db.files.get(id);
    if (!file) {
      return reply.code(404).send({ error: 'File not found' });
    }

    // Tags aktualisieren
    file.tags = tags || [];
    db.files.set(id, file);

    return file;
  });

  // A2: Suche starten (Long Running Operation) (// Aufgabe3)
  fastify.post('/search', async (request, reply) => {
    const { tags } = request.body; // Tags nach denen gesucht werden soll

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return reply.code(400).send({ error: 'Tags array required' });
    }

    // 1. Task erstellen (Status: Start/Pending)
    const taskId = generateId();
    const task = {
      id: taskId,
      status: 'Pending',
      requestTags: tags,
      createdAt: new Date().toISOString(),
      result: null
    };
    
    db.tasks.set(taskId, task);

    // 2. Asynchrone Verarbeitung simulieren (ohne await, damit Antwort sofort rausgeht!)
    // Simulierte Dauer: 60 Sekunden (laut Aufgabe)
    setTimeout(() => {
      console.log(`Starte Verarbeitung für Task ${taskId}...`);
      
      const allFiles = Array.from(db.files.values());
      
      // Suchlogik: Datei muss ALLE gesuchten Tags enthalten (UND-Verknüpfung)
      const matches = allFiles.filter(file => {
        if (!file.tags) return false;
        // Prüfen ob jeder gesuchte Tag im Datei-Tag-Array enthalten ist
        return tags.every(searchTag => file.tags.includes(searchTag));
      });

      // Task aktualisieren
      const completedTask = db.tasks.get(taskId);
      if (completedTask) {
        completedTask.status = 'Completed';
        completedTask.result = matches;
        completedTask.completedAt = new Date().toISOString();
        db.tasks.set(taskId, completedTask);
        console.log(`Task ${taskId} abgeschlossen. ${matches.length} Treffer.`);
      }
    }, 60000); // 60 Sekunden Wartezeit

    // 3. Sofortige Antwort (202 Accepted)
    reply.code(202).send({ 
      taskId: taskId, 
      status: 'Pending',
      message: 'Search started. Poll /api/tasks/:id for results.' 
    });
  });
}