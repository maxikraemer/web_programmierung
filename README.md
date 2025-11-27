\documentclass[11pt, a4paper]{article}

% --- PREAMBLE ---
\usepackage[a4paper, top=2.5cm, bottom=2.5cm, left=2cm, right=2cm]{geometry}
\usepackage{fontspec}
\usepackage[ngerman]{babel}

% Fonts
\setmainfont{Noto Sans}
\setmonofont{Noto Sans Mono}

% Packages for styling
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{graphicx}
\usepackage{listings}
\usepackage{tcolorbox}

% Colors
\definecolor{codebg}{rgb}{0.95,0.95,0.95}
\definecolor{primary}{RGB}{37, 99, 235} % Blue

% Code styling
\lstset{
    backgroundcolor=\color{codebg},
    basicstyle=\ttfamily\small,
    breaklines=true,
    frame=single,
    rulecolor=\color{lightgray},
    framesep=10pt,
    xleftmargin=10pt,
    xrightmargin=10pt
}

% Hyperlink styling
\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    filecolor=magenta,      
    urlcolor=primary,
}

\title{\textbf{ServiceDesk Central 🎫} \\ \large Projekt-Dokumentation \& Anleitung}
\author{Prismarine Solutions GmbH Dev Team}
\date{\today}

\begin{document}

\maketitle

\section*{Projektbeschreibung}

\textbf{ServiceDesk Central} ist eine moderne Webapplikation zur Verwaltung von Support-Tickets, entwickelt für die \textit{Prismarine Solutions GmbH}. Sie ermöglicht Support-Teams, Kundenanfragen effizient zu verwalten, inklusive Ticket-Tracking, Dateianhängen und Kundenverwaltung.

\subsection*{Hauptfeatures}
\begin{itemize}
    \item \textbf{Ticket-Workflow:} Status-Zyklus von "Draft" über "Open" bis "Resolved" und "Archived".
    \item \textbf{Rollenbasiertes System:} Differenzierte Rechte für User, Support-Agents und Engineers.
    \item \textbf{Dateiverwaltung:} Upload und Abruf von Log-Dateien (.txt).
    \item \textbf{Responsive UI:} Optimiert für Desktop und Tablet Nutzung.
    \item \textbf{LRO Suche:} Asynchrone Suche nach Datei-Tags (Long Running Operation).
\end{itemize}

\hrule
\vspace{0.5cm}

\section*{Technologie-Stack}

\begin{itemize}
    \item \textbf{Frontend:} React, Vite, Tailwind CSS
    \item \textbf{Backend:} Node.js, Fastify
    \item \textbf{Datenbank:} In-Memory Store (mit automatischen Testdaten)
\end{itemize}

\section*{Installation \& Setup}

Das Projekt besteht aus zwei getrennten Anwendungen (Client \& Server), die parallel ausgeführt werden müssen.

\subsection*{Voraussetzungen}
\begin{itemize}
    \item Node.js (Version 18+ empfohlen)
    \item npm Package Manager
\end{itemize}

\subsection*{Schritt 1: Backend starten}
Das Backend stellt die REST-API auf Port 3000 bereit.

\begin{enumerate}
    \item Terminal im Hauptverzeichnis öffnen.
    \item Abhängigkeiten installieren:
\begin{lstlisting}[language=bash]
npm install
\end{lstlisting}
    \item Server starten:
\begin{lstlisting}[language=bash]
npm start
\end{lstlisting}
    \textit{Hinweis: Der Server läuft nun unter http://localhost:3000. Testdaten werden automatisch generiert.}
\end{enumerate}

\subsection*{Schritt 2: Frontend starten}
Der Client (React App) läuft auf Port 5173.

\begin{enumerate}
    \item Neues Terminal öffnen und in den Client-Ordner wechseln:
\begin{lstlisting}[language=bash]
cd client
\end{lstlisting}
    \item Abhängigkeiten installieren:
\begin{lstlisting}[language=bash]
npm install
\end{lstlisting}
    \item Entwicklungsserver starten:
\begin{lstlisting}[language=bash]
npm run dev
\end{lstlisting}
    \textit{Hinweis: Die App ist nun unter http://localhost:5173 erreichbar.}
\end{enumerate}

\section*{Nutzungshinweise}

Da es sich um einen MVP ohne komplexe Login-Infrastruktur handelt, erfolgt die Authentifizierung über eine \textbf{Rollen-Simulation}.

\begin{itemize}
    \item Oben rechts in der Navigationsleiste befindet sich ein Dropdown-Menü.
    \item Dort kann die aktive Rolle (\textbf{User}, \textbf{Support-Agent}, \textbf{Engineer}) gewechselt werden.
    \item Die Benutzeroberfläche passt sich automatisch an die Berechtigungen an.
\end{itemize}

\section*{Projektstruktur}

\begin{itemize}
    \item \texttt{src/} - Backend Quellcode
    \begin{itemize}
        \item \texttt{routes/} - API Endpunkte
        \item \texttt{data/} - Datenmodell und Seeding
    \end{itemize}
    \item \texttt{client/} - Frontend Quellcode
    \begin{itemize}
        \item \texttt{src/components/} - UI-Elemente
        \item \texttt{src/pages/} - Hauptansichten
        \item \texttt{src/services/} - API Kommunikation
    \end{itemize}
\end{itemize}

\vspace{1cm}
\textit{\small Erstellt im Rahmen der Prüfung Web-Programmierung.}

\end{document}
