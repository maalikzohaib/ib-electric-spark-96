import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { RetroGrid } from "@/components/ui/retro-grid";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-subtle border-t mt-20 overflow-hidden">
      {/* RetroGrid Background */}
      <RetroGrid className="opacity-40" angle={65} />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/2ffc2111-6050-4ee5-b5f5-0768169c2a5b.png" 
              alt="Ijaz Brothers Electric Store" 
              className="h-12 w-auto"
            />
            <p className="text-muted-foreground text-sm">
              Your trusted source for quality electrical products including fans and bulbs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Shop</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <a 
                  href="https://wa.me/923014539090" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +92 301 4539090
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:info@ibelectricstore.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@ibelectricstore.com
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <a 
                  href="https://maps.google.com/maps?q=Ijaz+Brother+Electric+Store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ijaz Brother Electric Store - View Location
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Link */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Admin</h3>
            <Link 
              to="/admin" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Ijaz Brothers Electric Store. All rights reserved.
            <span className="mx-2">•</span>
            Developed by{' '}
            <a
              href="https://wa.me/923259885086"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Muhammad Zohaib
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
