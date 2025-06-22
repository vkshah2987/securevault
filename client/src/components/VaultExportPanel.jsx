import React from 'react';
import { decryptPassword } from '../utils/encryption';

const VaultExportPanel = ({ vaultEntries = [], vaultKey }) => {
  const handleExport = (format) => {
    if (!vaultKey) {
      alert("Vault is locked or key is missing.");
      return;
    }

    const exported = vaultEntries.map(entry => ({
      title: entry.title,
      username: entry.username,
      password: decryptPassword(entry.encryptedPassword, vaultKey),
      tags: entry.tags?.join(', ')
    }));

    let content = '';
    let fileName = `securevault_export_${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(exported, null, 2);
      fileName += '.json';
    } else if (format === 'csv') {
      const header = 'Title,Username,Password,Tags\n';
      const rows = exported.map(e =>
        `"${e.title}","${e.username}","${e.password}","${e.tags}"`
      ).join('\n');
      content = header + rows;
      fileName += '.csv';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Export Vault</h3>
      <button onClick={() => handleExport('json')}>Export as JSON</button>
      <button onClick={() => handleExport('csv')}>Export as CSV</button>
    </div>
  );
};

export default VaultExportPanel;
