import React, { useEffect, useRef, useState } from 'react';

const countryList = [
  { name: 'USA', code: 'us', flag: '/flags/us.png' },
  { name: 'UK', code: 'gb', flag: '/flags/uk.png' },
  { name: 'Germany', code: 'de', flag: '/flags/de.png' },
  { name: 'India', code: 'in', flag: '/flags/in.png' },
  { name: 'Japan', code: 'jp', flag: '/flags/jp.png' },
  { name: 'Canada', code: 'ca', flag: '/flags/ca.png' },
  { name: 'Australia', code: 'au', flag: '/flags/au.png' },
  { name: 'Korea', code: 'kr', flag: '/flags/korea.png' },
  { name: 'France', code: 'fr', flag: '/flags/fr.png' },
  { name: 'Brazil', code: 'br', flag: '/flags/br.png' },
  { name: 'Russia', code: 'ru', flag: '/flags/ru.png' },
  { name: 'China', code: 'cn', flag: '/flags/cn.png' },
  { name: 'Italy', code: 'it', flag: '/flags/it.png' },
  { name: 'Spain', code: 'es', flag: '/flags/es.png' },
  { name: 'Netherlands', code: 'nl', flag: '/flags/nl.png' },
];

export default function VPNMainScreen() {
  const [ip, setIp] = useState('Fetching...');
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [focused, setFocused] = useState('button'); // 'button' or 'countries'
  const [isConnected, setIsConnected] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    Host: '',
    Port: '',
    AuthNoCache: '',
    typeProtocol: '',
    Cipher: '',
    Authenticate: '',
    CompLZO: '',
    RemoteCertTLS: '',
    NSCertType: '',
  });
  const flagRefs = useRef([]);
  flagRefs.current = [];

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp('Unknown'));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        if (focused === 'button') setFocused('countries');
        else setShowConfig(true);
      }
      if (e.key === 'ArrowUp') {
        if (focused === 'countries') {
          setShowConfig(false);
          setFocused('button');
        }
      }
      if (e.key === 'ArrowLeft') {
        if (focused === 'countries') {
          setSelectedCountry((i) => (i - 1 + countryList.length) % countryList.length);
        }
      }
      if (e.key === 'ArrowRight') {
        if (focused === 'countries') {
          setSelectedCountry((i) => (i + 1) % countryList.length);
        }
      }
      if (e.key === 'Enter') {
        if (focused === 'button') setIsConnected((prev) => !prev);
        if (focused === 'countries') setShowConfig(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focused]);

  useEffect(() => {
    if (focused === 'countries' && flagRefs.current[selectedCountry]) {
      flagRefs.current[selectedCountry].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCountry, focused]);


  const selected = countryList[selectedCountry];

  return (
    <div style={styles.container}>
      <img src="/world-map.jpg" alt="World Map" style={styles.bg} />
      <div style={styles.overlay}>
        <div style={styles.header}>
          <h1 style={styles.countryName}>
            {selected.name}{' '}
            <span style={{ color: isConnected ? 'lightgreen' : 'red', fontSize: '1.2rem' }}>
              ({isConnected ? 'Connected' : 'Disconnected'})
            </span>
          </h1>
          <h2 style={styles.ip}>Current IP: {ip}</h2>
          <div style={styles.buttonRow}>
            <button
              onClick={() => setIsConnected((prev) => !prev)}
              style={{
                ...styles.button,
                border: focused === 'button' ? '2px solid yellow' : '1px solid gray',
                backgroundColor: isConnected ? 'darkgreen' : '#222',
              }}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        {showConfig && (
          <div style={styles.configBox}>
            <h3>Configuration</h3>
            <ul>
              {Object.entries(config).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong>
                  <input
                    style={styles.inputField}
                    value={v}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, [k]: e.target.value }))
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={styles.flagScrollbar}>
          {countryList.map((c, i) => (
            <div
              key={c.code}
              ref={(el) => (flagRefs.current[i] = el)}
              onClick={() => {
                setSelectedCountry(i);
                setFocused('countries');
                setShowConfig(false);
              }}
              style={{
                ...styles.flagCard,
                border:
                  focused === 'countries' && selectedCountry === i
                    ? '2px solid white'
                    : 'none',
              }}
            >
              <img
                src={c.flag}
                alt={`${c.name} flag`}
                style={styles.flagImage}
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if image fails
                  e.target.src = '/flags/default.png'; // Fallback image
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  bg: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.25)',
    zIndex: 0,
  },
  overlay: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '4vh 5vw',
    color: 'white',
  },
  header: {
    textAlign: 'left',
  },
  countryName: {
    fontSize: '2.5rem',
    marginBottom: '1vh',
  },
  ip: {
    fontSize: '2rem',
    marginBottom: '2vh',
  },
  buttonRow: {
    marginBottom: '2vh',
  },
  button: {
    fontSize: '1.5rem',
    padding: '1vh 3vw',
    color: 'white',
    cursor: 'pointer',
    borderRadius: 8,
  },
  bottomBar: {
    display: 'flex',
    overflowX: 'auto',
    gap: '2vw',
    paddingBottom: '3vh',
    justifyContent: 'flex-start', // Start rather than center for scroll
    alignItems: 'center',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE
  },
  flagCard: {
    width: '10vh',
    height: '10vh',
    borderRadius: '50%',
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    flexShrink: 0, // Prevent from shrinking
    minWidth: '10vh', // Ensures uniform sizing across scroll
  },
  flagImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',     // Ensures full circle fill
    aspectRatio: '1 / 1',   // Ensures it's a perfect square inside the circle
  },
  configBox: {
    position: 'absolute',
    top: '4vh',
    right: '5vw',
    background: '#222',
    padding: '2vh 2vw',
    borderRadius: 10,
    border: '1px solid #444',
    color: 'white',
    zIndex: 2,
    maxWidth: '300px',
  },
  inputField: {
    width: '100%',
    marginTop: '0.5vh',
    marginBottom: '1vh',
    padding: '0.5vh',
    fontSize: '1rem',
    borderRadius: 5,
    border: 'none',
    background: '#333',
    color: 'white',
  },
  flagScrollbar: {
    display: 'flex',
    overflowX: 'auto',
    gap: '2vw',
    paddingBottom: '3vh',
    justifyContent: 'flex-start',
    alignItems: 'center',
    scrollbarWidth: 'none', /* Firefox */
    msOverflowStyle: 'none', /* IE 10+ */
  },
  '::-webkit-scrollbar': {
    display: 'none',
  },
};
