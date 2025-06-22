import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import zxcvbn from 'zxcvbn';
import { encryptPassword } from '../utils/encryption';

const VaultEntryForm = ({ vaultKey, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [rawPassword, setRawPassword] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = zxcvbn(rawPassword);

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRawPassword(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaultKey) return alert('Vault key missing');

    const payload = {
      title,
      username,
      encryptedPassword: encryptPassword(rawPassword, vaultKey),
      tags: tags.split(',').map(tag => tag.trim())
    };

    try {
      setLoading(true);
      await axios.post('/vault/create', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTitle('');
      setUsername('');
      setRawPassword('');
      setTags('');
      onSuccess(); // refresh list
    } catch (err) {
      console.error('Error adding entry:', err);
      alert('Error adding entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Add New Vault Entry</h3>
      <input
        type="text"
        value={title}
        placeholder="Title (e.g. Gmail)"
        onChange={(e) => setTitle(e.target.value)}
        required
      /> <br />
      <input
        type="text"
        value={username}
        placeholder="Username or Email"
        onChange={(e) => setUsername(e.target.value)}
      /> <br />
      <input
        type="password"
        value={rawPassword}
        placeholder="Password"
        onChange={(e) => setRawPassword(e.target.value)}
        required
      /> <br />
      <div>
        Strength: {['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.score]}
        <div
          style={{
            width: `${(passwordStrength.score + 1) * 20}%`,
            height: '6px',
            backgroundColor: ['#f44336', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'][passwordStrength.score],
            marginTop: '4px',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      <button type="button" onClick={() => generateRandomPassword()}>
        Generate Random Password
      </button> <br />
      <input
        type="text"
        value={tags}
        placeholder="Tags (comma separated)"
        onChange={(e) => setTags(e.target.value)}
      /> <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>
    </form>
  );
};

export default VaultEntryForm;
