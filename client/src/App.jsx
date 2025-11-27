import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import der Seiten-Komponenten
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import CustomerList from './pages/CustomerList';

/**
 * App Komponente
 * Der Einstiegspunkt der Frontend-Applikation.
 * Definiert das Routing und das globale Layout (Navbar + Content Area).
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Globale Navigationsleiste */}
        <Navbar />
        
        {/* Routing-Bereich */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/customers" element={<CustomerList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;