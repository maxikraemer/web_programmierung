/**
 * auth.js
 * Middleware zur Überprüfung der Rollen basierend auf dem Authorization Header.
 * Schema: "Authorization: Basic <Role>"
 */

export const ROLES = {
  SUPPORT: 'Support-Agent',
  ENGINEER: 'Engineer',
  USER: 'User'
};

/**
 * Erstellt einen PreHandler-Hook für Fastify, der prüft, ob der User eine der erlaubten Rollen hat.
 * @param {string[]} allowedRoles - Array der erlaubten Rollen
 */
export const requireRole = (allowedRoles) => {
  return async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      reply.code(401).send({ error: 'Unauthorized', message: 'Fehlender oder falscher Authorization Header.' });
      return;
    }

    const role = authHeader.split(' ')[1]; // "Basic Engineer" -> "Engineer"

    if (!allowedRoles.includes(role)) {
      reply.code(403).send({ 
        error: 'Forbidden', 
        message: `Rolle '${role}' ist für diese Aktion nicht berechtigt. Erlaubt: ${allowedRoles.join(', ')}` 
      });
      return;
    }

    // Rolle im Request speichern für spätere Verwendung
    request.userRole = role;
  };
};