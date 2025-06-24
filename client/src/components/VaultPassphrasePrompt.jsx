import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { encryptPassphrase } from '../utils/encryption';

const VaultPassphrasePrompt = ({ onKeyDerived, error }) => {
  const [passphrase, setPassphrase] = useState('');
  const [validationError, setValidationError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Derive key from passphrase using PBKDF2 (same as original version)
      const derivedKey = CryptoJS.PBKDF2(passphrase, 'securevault-salt', {
        keySize: 256 / 32,
        iterations: 1000,
      }).toString();

    const encryptedTest = encryptPassphrase(passphrase);

      // Validate with backend
      const res = await axios.post('/vault/validate-key', {
        encryptedTest,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.valid) {
        onKeyDerived(derivedKey); // Pass derived key to dashboard
      } else {
        setValidationError("Invalid passphrase.");
      }

    } catch (err) {
      console.error(err);
      setValidationError(err.response?.data?.message || "Validation failed.");
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>🔐 Enter Your Vault Passphrase</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Vault Passphrase"
          required
        />
        <button type="submit">Unlock</button>
      </form>
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      {error && <p style={{ color: 'red' }}>Invalid passphrase or vault data corrupted.</p>}
    </div>
  );
};

export default VaultPassphrasePrompt;
