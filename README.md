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

1. Terminal im Hauptverzeichnis öffnen.

2. Abhängigkeiten installieren:

   ```bash
   npm install
