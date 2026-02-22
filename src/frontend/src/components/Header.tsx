import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/generated/tractor-icon.dim_200x200.png"
            alt="BAJARANGI ENTERPRISES logo"
            className="h-10 w-10"
          />
          <span className="text-lg font-bold text-agricultural-green md:text-xl">
            BAJARANGI ENTERPRISES
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-agricultural-green"
              activeProps={{ className: 'text-agricultural-green' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/admin' })}
              className="text-agricultural-green hover:bg-agricultural-green/10"
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
          )}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-agricultural-green text-agricultural-green hover:bg-agricultural-green hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleLogin}
              className="bg-agricultural-green hover:bg-agricultural-green-dark"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-agricultural-green"
                activeProps={{ className: 'text-agricultural-green' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-agricultural-green"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="mr-2 inline h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-agricultural-green text-agricultural-green"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-agricultural-green hover:bg-agricultural-green-dark"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
