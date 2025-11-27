ServiceDesk Central 🎫

Eine moderne Webapplikation zur Verwaltung von Support-Tickets, entwickelt für die Prismarine Solutions GmbH.

📋 Projektbeschreibung

ServiceDesk Central ermöglicht es Support-Teams, Kundenanfragen effizient zu verwalten. Das System unterstützt verschiedene Benutzerrollen und bietet Funktionen wie Ticket-Tracking, Dateianhänge und eine Kundenverwaltung.

Hauptfeatures:

Ticket-Workflow: Von "Draft" über "Open" bis "Resolved" und "Archived".

Rollenbasiertes System: Differenzierte Rechte für User, Support-Agents und Engineers.

Dateiverwaltung: Upload und Abruf von Log-Dateien (.txt).

Responsive UI: Optimiert für Desktop und Tablet Nutzung.

LRO Suche: Asynchrone Suche nach Datei-Tags (Long Running Operation).

🛠 Technologie-Stack

Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Fastify

Datenbank: In-Memory Store (mit Initial Seeding)

📦 Installation & Setup

Das Projekt besteht aus zwei getrennten Anwendungen (Client & Server), die parallel ausgeführt werden müssen.

Voraussetzungen

Node.js (Version 18+ empfohlen)

npm Package Manager

Schritt 1: Backend starten

Das Backend stellt die REST-API auf Port 3000 bereit.

Terminal im Hauptverzeichnis öffnen.

Abhängigkeiten installieren:

npm install


Server starten:

npm start


Der Server läuft nun unter http://localhost:3000. Testdaten werden automatisch generiert.

Schritt 2: Frontend starten

Der Client (React App) läuft auf Port 5173 (Standard Vite Port).

Neues Terminal öffnen und in den Client-Ordner wechseln:

cd client


Abhängigkeiten installieren:

npm install


Entwicklungsserver starten:

npm run dev


Die App ist nun unter http://localhost:5173 erreichbar.

🔑 Nutzungshinweise

Da es sich um einen MVP ohne komplexe Login-Infrastruktur handelt, erfolgt die Authentifizierung über eine Rollen-Simulation.

Oben rechts in der Navigationsleiste befindet sich ein Dropdown-Menü.

Dort kann die aktive Rolle (User, Support-Agent, Engineer) gewechselt werden.

Die UI passt sich automatisch an die Berechtigungen der gewählten Rolle an (z.B. Sichtbarkeit von Buttons).

📂 Struktur

src/ - Backend Quellcode

routes/ - API Endpunkte Definitionen

data/ - Datenmodell und Seeding

client/ - Frontend Quellcode

src/components/ - Wiederverwendbare UI-Elemente

src/pages/ - Hauptansichten (Views)

src/services/ - API Kommunikation

Erstellt im Rahmen der Prüfung Web-Programmierung.
