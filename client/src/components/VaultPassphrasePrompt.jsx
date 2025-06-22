// src/components/VaultPassphrasePrompt.jsx
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const VaultPassphrasePrompt = ({ onKeyDerived, error }) => {
  const [passphrase, setPassphrase] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && passphrase.trim()) {
      const derivedKey = CryptoJS.PBKDF2(passphrase, 'securevault-salt', {
        keySize: 256 / 32,
        iterations: 1000
      }).toString();

      onKeyDerived(derivedKey);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>🔐 Enter Your Vault Passphrase</h3>
      <input
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Vault Passphrase"
      />
      {error && <p style={{ color: 'red' }}>Invalid passphrase or vault data corrupted.</p>}
    </div>
  );
};

export default VaultPassphrasePrompt;
