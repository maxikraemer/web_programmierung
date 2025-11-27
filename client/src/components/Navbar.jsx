import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, Search } from 'lucide-react';

/**
 * Navbar Komponente
 * Zeigt die Navigation und den Rollen-Umschalter (für den MVP-Kontext) an.
 */
const Navbar = () => {
  // State für die aktuell ausgewählte Rolle (Default: User)
  const [role, setRole] = useState(localStorage.getItem('userRole') || 'User');

  /**
   * Behandelt den Rollenwechsel.
   * Speichert die neue Rolle im LocalStorage und lädt die Seite neu,
   * um sicherzustellen, dass alle API-Calls den neuen Auth-Header nutzen.
   */
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
    window.location.reload(); 
  };

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:text-slate-200 transition-colors">
          <Briefcase size={24} /> ServiceDesk Central
        </Link>
        
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <Link to="/" className="hover:text-slate-300 transition-colors font-medium">Tickets</Link>
          <Link to="/customers" className="hover:text-slate-300 transition-colors font-medium">Kunden</Link>
          <Link to="/tag-search" className="hover:text-slate-300 transition-colors font-medium flex items-center gap-1">
            <Search size={18} /> Suche
          </Link>
          
          {/* Rollen-Selector (MVP Feature) */}
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded border border-slate-600">
            <User size={16} className="text-slate-300" />
            <select 
              value={role} 
              onChange={handleRoleChange} 
              className="bg-transparent border-none outline-none text-sm cursor-pointer text-white focus:ring-0"
              title="Rolle wechseln"
            >
              <option value="User" className="text-slate-900">User</option>
              <option value="Support-Agent" className="text-slate-900">Support-Agent</option>
              <option value="Engineer" className="text-slate-900">Engineer</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;