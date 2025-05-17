
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-sports-blue flex items-center justify-center">
              <span className="text-white font-bold text-xl">SF</span>
            </div>
            <span className="font-montserrat font-bold text-lg md:text-xl text-sports-blue">Sports Fest 2025</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-sports-blue transition-colors">Home</Link>
            <Link to="/register" className="font-medium hover:text-sports-blue transition-colors">Register</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-gray-500 hover:text-sports-blue"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden absolute left-0 right-0 bg-white z-20 shadow-lg transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-40 py-3 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="font-medium hover:text-sports-blue py-2" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/register" 
                className="font-medium hover:text-sports-blue py-2" 
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
