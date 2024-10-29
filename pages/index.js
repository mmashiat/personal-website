import React, { useState, useEffect } from 'react';
import Confetti from '../components/Confetti';

const Home = () => {
  const [theme, setTheme] = useState('light');
  const [currentTime, setCurrentTime] = useState('');
  const [moonPhase, setMoonPhase] = useState('🌕');
  const [walletConnected, setWalletConnected] = useState(false);
  const [newEmoji, setNewEmoji] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [location, setLocation] = useState('Loading...');
  const [signatures, setSignatures] = useState([
    { address: "0x1234...5678", emoji: "🌟", position: { top: '25%', right: '5%' } },
    { address: "0xAB12...89CD", emoji: "✨", position: { top: '45%', left: '5%' } },
    { address: "0x34DE...67FG", emoji: "🚀", position: { top: '65%', right: '8%' } }
  ]);

  const EMOJIS = ["🌟", "🚀", "🎨", "🎭", "🌈", "✨", "🎪", "🎮", "🎯", "🎲", "🔮", "⭐"];

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const updateTimeAndMoon = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit'
      }));

      const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
      const phase = Math.floor((now.getTime() / (29.5 * 24 * 60 * 60 * 1000)) % 8);
      setMoonPhase(phases[phase]);
    };

    updateTimeAndMoon();
    const interval = setInterval(updateTimeAndMoon, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
            const state = data.address.state || '';
            setLocation(`${city}, ${state}`);
          } catch (error) {
            console.error("Error fetching location data:", error);
            setLocation("Location unavailable");
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLocation("Location unavailable");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const getSafePosition = () => {
    const isRightSide = Math.random() > 0.5;
    return {
      top: `${20 + Math.random() * 60}%`,
      [isRightSide ? 'right' : 'left']: `${3 + Math.random() * 5}%`
    };
  };

  const connectWallet = () => {
    setWalletConnected(true);
    setNewEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  };

  const publishSignature = () => {
    const newSignature = {
      address: "0xYOUR...WALLET",
      emoji: newEmoji,
      position: getSafePosition()
    };
    
    setSignatures([...signatures, newSignature]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setWalletConnected(false);
    setNewEmoji("");
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
    }`}>
      {showConfetti && <Confetti />}

      <button
        onClick={toggleTheme}
        className={`fixed top-8 right-8 p-2 rounded-full transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="fixed inset-0 pointer-events-none">
        {signatures.map((sig, index) => (
          <div
            key={index}
            className="absolute group pointer-events-auto"
            style={{
              ...sig.position,
              zIndex: 10
            }}
          >
            <span className="text-2xl opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              {sig.emoji}
            </span>
            <span 
              className={`absolute font-mono text-xs px-2 py-1 rounded-md shadow-sm 
                         opacity-0 group-hover:opacity-100 transition-all duration-200 
                         whitespace-nowrap bottom-full mb-2 left-1/2 transform -translate-x-1/2
                         ${theme === 'dark' 
                           ? 'bg-gray-800 border-gray-700' 
                           : 'bg-white border-gray-200'}`}
            >
              {sig.address}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto p-8 md:p-16">
        <main className="space-y-12">
          <section className={`space-y-3 font-mono text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>{location}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>🕐</span>
              <span>EST • {currentTime}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>{moonPhase}</span>
              <span>Current lunar phase</span>
            </div>
          </section>

          <section className="space-y-6">
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}>
              Hi, I'm [Your Name]. I'm a [your role/passion] based in {location}. 
              I spend my days crafting digital experiences and exploring new technologies.
              When I'm not coding, you'll find me trying new restaurants and working on 
              side projects.
            </p>
            
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}>
              My work focuses on creating simple, effective solutions to complex problems.
              I believe in the power of minimalist design and clean code to create
              meaningful user experiences.
            </p>

            <p className={`italic border-l-2 pl-4 ${
              theme === 'dark' 
                ? 'border-gray-700 text-gray-400' 
                : 'border-gray-200 text-gray-600'
            }`}>
              "Simplicity is the ultimate sophistication." — Leonardo da Vinci
            </p>
          </section>

          <section className="space-y-2 font-mono text-sm">
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
              directory
            </p>
            <div className="flex flex-col space-y-2">
              {['/projects', '/work', '/food', '/photos'].map((path) => (
                <a 
                  key={path}
                  href={path}
                  className={`block transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  └── {path}
                </a>
              ))}
            </div>
          </section>

          <section className="space-y-4 font-mono text-sm">
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
              /guestbook
            </p>
            
            <div className={`border rounded-lg p-6 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {!walletConnected ? (
                <button 
                  onClick={connectWallet}
                  className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  └── connect wallet to sign guestbook ─→
                </button>
              ) : (
                <div className="space-y-4">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    your signature:
                  </p>
                  <div className="text-4xl animate-in fade-in zoom-in duration-300">
                    {newEmoji}
                  </div>
                  <button 
                    onClick={publishSignature}
                    className={`transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    └── confirm ─→
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2 font-mono text-sm pt-4">
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
              connect
            </p>
            <div className="flex flex-col space-y-2">
              {['linkedin', 'twitter'].map((platform) => (
                <a 
                  key={platform}
                  href={`https://${platform}.com/yourusername`}
                  className={`block transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  └── @{platform} ─→
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;