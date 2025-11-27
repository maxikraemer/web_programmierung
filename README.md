ServiceDesk Central

Eine Webapplikation zur Verwaltung von Support-Tickets für die Prismarine Solutions GmbH.
Dieses Projekt wurde im Rahmen der Wiederholungsprüfung "Web-Programmierung" erstellt.

🚀 Features

Ticket-Management: Erstellen, Bearbeiten, Status-Tracking (Draft -> Open -> Resolved).

Rollen-System: Unterschiedliche Berechtigungen für User, Support-Agents und Engineers.

Dateiverwaltung: Upload von .txt Logs zu Tickets.

Kundenverwaltung: Übersicht und Verknüpfung von Kunden mit Tickets.

Responsive UI: Modernes Design basierend auf React und Tailwind CSS.

🛠 Tech Stack

Frontend: React, Vite, Tailwind CSS, Lucide Icons

Backend: Node.js, Fastify

Datenhaltung: In-Memory Store (mit Initial Seeding)

📦 Installation & Start

Das Projekt besteht aus zwei Teilen: dem backend (Root) und dem client (Frontend). Beide müssen parallel laufen.

Voraussetzungen

Node.js (Empfohlen: v18 LTS oder v20 LTS)

npm

1. Backend starten

Öffne ein Terminal im Hauptverzeichnis des Projekts:

# Abhängigkeiten installieren
npm install

# Server starten
npm start


Der Server läuft nun unter: http://localhost:3000

(Testdaten werden beim Start automatisch generiert)

2. Frontend starten

Öffne ein neues Terminal und navigiere in den Client-Ordner:

cd client

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev


Die Web-App ist nun erreichbar unter: http://localhost:5173

🔑 Bedienung

Da keine echte Login-Maske existiert (laut Anforderung), erfolgt der Rollenwechsel direkt über das Dropdown-Menü in der Navigationsleiste.

User: Kann Tickets erstellen und kommentieren.

Support-Agent: Kann Tickets archivieren und Kunden verwalten.

Engineer: Kann technische Statuswechsel durchführen (In-Progress, Resolved).

📂 Projektstruktur

.
├── src/                 # Backend Source Code
│   ├── data/            # In-Memory Store & Seeding
│   ├── routes/          # API Endpunkte (Tickets, Customers)
│   └── utils/           # Auth Middleware
├── client/              # Frontend (React)
│   ├── src/             # React Komponenten & Pages
│   └── ...
├── assets/              # Speicherort für hochgeladene Dateien
└── ...
