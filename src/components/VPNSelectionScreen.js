import React, { useEffect, useState } from 'react';

const providers = ['NordVPN', 'ExpressVPN', 'SurfShark', 'CyberGhost'];

export default function VPNSelectionScreen({ onSelect }) {
  const [selected, setSelected] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') setSelected((s) => (s + 1) % providers.length);
    if (e.key === 'ArrowUp') setSelected((s) => (s - 1 + providers.length) % providers.length);
    if (e.key === 'Enter') onSelect(providers[selected]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div style={styles.container}>
      <h1>Select VPN Provider</h1>
      <ul style={styles.list}>
        {providers.map((p, i) => (
          <li
            key={p}
            onClick={() => onSelect(p)}
            style={{
              ...styles.item,
              backgroundColor: i === selected ? '#333' : 'transparent',
            }}
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: 'black',
    color: 'white',
    padding: '5vh 5vw',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '3vh',
  },
  item: {
    padding: '1.2vh 1vw',
    fontSize: '2rem',
    cursor: 'pointer',
    borderRadius: 8,
  },
};
