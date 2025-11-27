# ServiceDesk Central 🎫

Eine moderne Webapplikation zur Verwaltung von Support-Tickets, entwickelt für die *Prismarine Solutions GmbH*.

## 📋 Projektbeschreibung

ServiceDesk Central ermöglicht es Support-Teams, Kundenanfragen effizient zu verwalten. Das System unterstützt verschiedene Benutzerrollen und bietet Funktionen wie Ticket-Tracking, Dateianhänge und eine Kundenverwaltung.

**Hauptfeatures:**
* **Ticket-Workflow:** Von "Draft" über "Open" bis "Resolved" und "Archived".
* **Rollenbasiertes System:** Differenzierte Rechte für User, Support-Agents und Engineers.
* **Dateiverwaltung:** Upload und Abruf von Log-Dateien (.txt).
* **Responsive UI:** Optimiert für Desktop und Tablet Nutzung.
* **LRO Suche:** Asynchrone Suche nach Datei-Tags (Long Running Operation).

## 🛠 Technologie-Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Fastify
* **Datenbank:** In-Memory Store (mit Initial Seeding)

## 📦 Installation & Setup

Das Projekt besteht aus zwei getrennten Anwendungen (Client & Server), die parallel ausgeführt werden müssen.

### Voraussetzungen
* Node.js (Version 18+ empfohlen)
* npm Package Manager

### Schritt 1: Backend starten

Das Backend stellt die REST-API auf Port 3000 bereit.

1. Öffne ein Terminal im Hauptverzeichnis des Projekts.
2. Installiere die Abhängigkeiten mit dem Befehl: `npm install`
3. Starte den Server mit dem Befehl: `npm start`

> Hinweis: Der Server läuft nun unter http://localhost:3000. Testdaten werden automatisch generiert.

### Schritt 2: Frontend starten

Der Client (React App) läuft auf Port 5173.

1. Öffne ein **neues** Terminal.
2. Wechsle in den Client-Ordner mit dem Befehl: `cd client`
3. Installiere die Abhängigkeiten mit dem Befehl: `npm install`
4. Starte den Entwicklungsserver mit dem Befehl: `npm run dev`

> Hinweis: Die App ist nun unter http://localhost:5173 erreichbar.

## 🔑 Nutzungshinweise

Da es sich um einen MVP ohne komplexe Login-Infrastruktur handelt, erfolgt die Authentifizierung über eine **Rollen-Simulation**.

* Oben rechts in der Navigationsleiste befindet sich ein Dropdown-Menü.
* Dort kann die aktive Rolle (**User**, **Support-Agent**, **Engineer**) gewechselt werden.
* Die UI passt sich automatisch an die Berechtigungen der gewählten Rolle an (z.B. Sichtbarkeit von Buttons).

## 📂 Struktur

* **src/** - Backend Quellcode
  * **routes/** - API Endpunkte Definitionen
  * **data/** - Datenmodell und Seeding
* **client/** - Frontend Quellcode
  * **src/components/** - Wiederverwendbare UI-Elemente
  * **src/pages/** - Hauptansichten (Views)
  * **src/services/** - API Kommunikation

---
*Erstellt im Rahmen der Prüfung Web-Programmierung.*
