
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sports-blue to-sports-orange mb-4">
              UNIVERSITY SPORTS FEST 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">March 15-20, 2025 • University Central Stadium</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Compete, Celebrate, Conquer! Join the biggest sporting event of the year and showcase your athletic prowess across multiple disciplines.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-sports-blue hover:bg-sports-blue/90 text-lg"
              >
                <Link to="/register">Register Now</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-sports-blue text-sports-blue hover:bg-sports-blue/10 text-lg"
              >
                Event Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <CountdownTimer />
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-sports-blue">Featured</span> Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {SPORTS_CATEGORIES.map((sport, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow group animate-pulse-gentle"
              >
                <div className={`w-16 h-16 rounded-full ${sport.bgColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <sport.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{sport.name}</h3>
                <p className="text-gray-600 text-sm">{sport.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                About the <span className="text-sports-blue">Sports Fest</span>
              </h2>
              <p className="text-gray-700 mb-4">
                The annual University Sports Fest is a week-long celebration of athletic excellence, bringing together students from all departments to compete in a variety of sporting disciplines.
              </p>
              <p className="text-gray-700 mb-4">
                With a rich history spanning over two decades, the Sports Fest has become a cornerstone of university life, fostering teamwork, discipline, and school spirit.
              </p>
              <p className="text-gray-700">
                Whether you're a seasoned athlete or a recreational player, there's a place for you at the Sports Fest. Join us in creating memories that will last a lifetime!
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-sports-blue">Event</span> Highlights
              </h2>
              <ul className="space-y-3">
                {HIGHLIGHTS.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-sports-blue/20 flex items-center justify-center mt-1 mr-3">
                      <span className="text-sports-blue font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-montserrat font-bold text-xl mb-2">University Sports Fest 2025</p>
              <p className="text-gray-300">Organized by University Sports Committee</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="hover:text-sports-orange transition-colors">Home</Link>
              <Link to="/register" className="hover:text-sports-orange transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; 2025 University Sports Committee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Dummy data for the sports categories
const SPORTS_CATEGORIES = [
  {
    name: "Cricket",
    description: "Team-based bat-and-ball sport",
    bgColor: "bg-sports-blue",
    icon: ({ className, size }: { className?: string; size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="M10.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0"></path>
      </svg>
    )
  },
  {
    name: "Football",
    description: "11-a-side team sport",
    bgColor: "bg-sports-green",
    icon: ({ className, size }: { className?: string; size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a27.24 27.24 0 0 1 3 10 27.24 27.24 0 0 1-3 10 27.24 27.24 0 0 1-3-10 27.24 27.24 0 0 1 3-10"></path>
        <path d="m2 12 20 0"></path>
      </svg>
    )
  },
  {
    name: "Badminton",
    description: "Racket sport played with shuttlecock",
    bgColor: "bg-sports-orange",
    icon: ({ className, size }: { className?: string; size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6 8 22"></path>
        <path d="m16 6-2 12"></path>
        <path d="M8 6s10 0 11 4"></path>
        <circle cx="14" cy="6" r="2"></circle>
        <circle cx="6" cy="6" r="2"></circle>
      </svg>
    )
  },
  {
    name: "Table Tennis",
    description: "Fast-paced table-based racket sport",
    bgColor: "bg-sports-red",
    icon: ({ className, size }: { className?: string; size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M3 12h6"></path>
        <path d="M15 12h6"></path>
        <path d="m12 4 7 3-7 3"></path>
      </svg>
    )
  },
  {
    name: "Athletics",
    description: "Track and field events",
    bgColor: "bg-sports-yellow",
    icon: ({ className, size }: { className?: string; size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4"></path>
        <path d="M12 14v3"></path>
        <path d="M12 19v2"></path>
        <path d="M12 5V2"></path>
        <path d="M5 8v3"></path>
        <path d="M15 10v3"></path>
        <path d="M19 15v3"></path>
        <circle cx="16" cy="19" r="2"></circle>
        <circle cx="19" cy="12" r="2"></circle>
        <circle cx="12" cy="10" r="2"></circle>
        <circle cx="8" cy="12" r="2"></circle>
        <path d="M14.5 18a7 7 0 1 0-9.4-6"></path>
      </svg>
    )
  }
];

// Dummy data for event highlights
const HIGHLIGHTS = [
  "Opening ceremony with torch lighting and cultural performances",
  "Inter-departmental competitions with attractive prizes",
  "Live streaming of all major matches on university portal",
  "Professional referees and state-of-the-art equipment",
  "Closing awards ceremony with special celebrity guest appearance"
];

export default Index;
