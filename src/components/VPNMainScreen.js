import React, { useEffect, useState } from 'react';

const countryList = [
  { name: 'USA', code: 'us' },
  { name: 'UK', code: 'gb' },
  { name: 'Germany', code: 'de' },
  { name: 'India', code: 'in' },
  { name: 'Japan', code: 'jp' },
  { name: 'Canada', code: 'ca' },
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

        <div style={styles.bottomBar}>
          {countryList.map((c, i) => (
            <div
              key={c.code}
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
                src={`https://flagcdn.com/w80/${c.code}.png`}
                alt={`${c.name} flag`}
                style={styles.flagImage}
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
    justifyContent: 'center',
    alignItems: 'center',
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
};
