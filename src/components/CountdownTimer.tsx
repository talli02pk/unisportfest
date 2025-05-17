
import { useEffect, useState } from "react";

// The date of the sports fest - set to a future date
const SPORTS_FEST_DATE = new Date("2025-03-15T09:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = SPORTS_FEST_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        // Event has started
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-8 bg-gradient-to-r from-sports-blue to-sports-blue/80 text-white rounded-xl shadow-lg">
      <h3 className="text-center text-xl md:text-2xl font-semibold mb-6">Event Starts In</h3>
      <div className="flex justify-center space-x-4 md:space-x-8">
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm w-16 md:w-24 h-16 md:h-24 rounded-lg flex items-center justify-center">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.days}</span>
          </div>
          <span className="text-sm mt-2">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm w-16 md:w-24 h-16 md:h-24 rounded-lg flex items-center justify-center">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.hours}</span>
          </div>
          <span className="text-sm mt-2">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm w-16 md:w-24 h-16 md:h-24 rounded-lg flex items-center justify-center">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.minutes}</span>
          </div>
          <span className="text-sm mt-2">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm w-16 md:w-24 h-16 md:h-24 rounded-lg flex items-center justify-center">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.seconds}</span>
          </div>
          <span className="text-sm mt-2">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
