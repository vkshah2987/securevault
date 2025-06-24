import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { encryptPassword } from '../utils/encryption';
import axios from '../utils/axiosInstance';
import { encryptPassphrase } from '../utils/encryption';

const VaultPassphraseSetup = () => {
    const [passphrase, setPassphrase] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token, setVaultKey } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save passphrase in state for future use
            setVaultKey(passphrase);

            // Encrypt a constant string "vault-check"
            const encryptedVaultCheck = encryptPassphrase(passphrase);

            // Send a dummy password entry to store vault-check string
            await axios.post(
                'http://localhost:5001/api/vault/create',
                {
                    title: "__vault_check__",
                    username: "system",
                    encryptedPassword: encryptPassword("system", passphrase),
                    tags: ["__internal__"],
                    encryptedVaultCheck
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError("Failed to initialize passphrase. Try again.");
        }
    };

    return (
        <div>
            <h2>Set Your Vault Passphrase</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    required
                />
                <button type="submit">Save Passphrase</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default VaultPassphraseSetup;
