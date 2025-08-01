import React, { useState } from 'react';
import VPNSelectionScreen from './components/VPNSelectionScreen';
import LoginScreen from './components/LoginScreen';
import VPNMainScreen from './components/VPNMainScreen';

export default function App() {
  const [step, setStep] = useState('select');
  const [provider, setProvider] = useState('');

  return (
    <>
      {step === 'select' && (
        <VPNSelectionScreen
          onSelect={(p) => {
            setProvider(p);
            setStep('login');
          }}
        />
      )}
      {step === 'login' && (
        <LoginScreen
          provider={provider}
          onLogin={() => setStep('vpn')}
          onBack={() => setStep('select')}
        />
      )}
      {step === 'vpn' && <VPNMainScreen />}
    </>
  );
}
