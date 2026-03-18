import { NavLink, Outlet } from 'react-router-dom';
import { Home, MessageSquare, Bell, PlusCircle } from 'lucide-react';
import Flag from './Flag';
import clsx from 'clsx';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-0 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sand/90 backdrop-blur-sm border-b border-mgreen/20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <Flag className="w-8 h-8 rounded shadow-sm" />
            <span className="font-heading font-bold text-xl tracking-tight text-dark">imsouane.app</span>
          </NavLink>
        </div>
        <div className="zellige-divider"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Sticky Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-paper border-t border-mgreen/20 sm:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-16",
              isActive ? "text-ocean" : "text-dark/60 hover:text-dark"
            )}
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-16",
              isActive ? "text-ocean" : "text-dark/60 hover:text-dark"
            )}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-medium">Feed</span>
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-16",
              isActive ? "text-ocean" : "text-dark/60 hover:text-dark"
            )}
          >
            <Bell size={20} />
            <span className="text-[10px] font-medium">Services</span>
          </NavLink>
          <NavLink
            to="/new"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-16",
              isActive ? "text-terracotta" : "text-dark/60 hover:text-dark"
            )}
          >
            <PlusCircle size={20} />
            <span className="text-[10px] font-medium">New</span>
          </NavLink>
        </div>
      </nav>

      {/* Desktop Sidebar / Footer logic could go here, but for now focus on mobile */}
      <footer className="hidden sm:block text-center py-8 text-sm text-dark/60 border-t border-dark/10 mt-auto">
        <p>No accounts. No algorithms. Just Imsouane.</p>
      </footer>
    </div>
  );
}

export default Layout;
