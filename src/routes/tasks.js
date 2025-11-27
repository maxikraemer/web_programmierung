import { db } from '../data/store.js';

export default async function taskRoutes(fastify, options) {
  
  //Status eines Tasks abfragen (Polling)
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    const task = db.tasks.get(id);

    if (!task) {
      return reply.code(404).send({ error: 'Task not found' });
    }

    // Antwortformat je nach Status
    if (task.status === 'Completed') {
      return reply.code(200).send(task); // 200 OK mit Ergebnis
    } else {
      return reply.code(200).send({ 
        id: task.id, 
        status: task.status, 
        createdAt: task.createdAt 
      }); // 200 OK (aber noch Pending)
    }
  });
}