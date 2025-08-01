import React, { useEffect, useState } from 'react';

export default function LoginScreen({ provider, onLogin, onBack }) {
  const [focused, setFocused] = useState(0);
  const buttons = ['Login', 'Back'];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') setFocused((i) => (i + 1) % 2);
    if (e.key === 'ArrowLeft') setFocused((i) => (i - 1 + 2) % 2);
    if (e.key === 'Enter') (focused === 0 ? onLogin : onBack)();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div style={styles.container}>
      <h1>{provider} Login</h1>
      <p style={styles.text}>Username: <strong>user@example.com</strong></p>
      <p style={styles.text}>Password: <strong>••••••••</strong></p>
      <div style={styles.buttonRow}>
        {buttons.map((label, i) => (
          <button
            key={label}
            onClick={() => (i === 0 ? onLogin() : onBack())}
            style={{
              ...styles.button,
              border: focused === i ? '2px solid yellow' : '1px solid gray',
            }}
          >
            {label}
          </button>
        ))}
      </div>
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
  text: {
    fontSize: '1.5rem',
    margin: '2vh 0',
  },
  buttonRow: {
    display: 'flex',
    gap: '2vw',
    marginTop: '5vh',
  },
  button: {
    fontSize: '1.5rem',
    padding: '1vh 3vw',
    cursor: 'pointer',
    background: '#222',
    color: 'white',
  },
};
