/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axiosInstance';

import VaultPassphrasePrompt from '../components/VaultPassphrasePrompt';
import VaultEntryForm from '../components/VaultEntryForm';
import VaultEntryList from '../components/VaultEntryList';
import TagFilterPanel from '../components/TagFilterPanel';
import VaultExportPanel from '../components/VaultExportPanel';

// import { StarBackground } from "../components";
import StarBackground from "../components/canvas/StarBackground";
import Input from "../components/sharable-ui/Input";

const Dashboard = () => {
    const { logout, token, vaultKey, setVaultKey } = useAuth();
    const navigate = useNavigate();

    const [vaultEntries, setVaultEntries] = useState([]);
    const [message, setMessage] = useState('');
    const [activeTag, setActiveTag] = useState('All');
    const [passphrasePrompted, setPassphrasePrompted] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fetchVault = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/vault/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setVaultEntries(res.data);
        } catch (err) {
            setMessage("Error fetching vault entries");
        }
    };

    useEffect(() => {
        fetchVault();
    }, []);

    const allTags = Array.from(
        new Set(vaultEntries.flatMap(entry => entry.tags || []))
    );

    const filteredEntries =
        activeTag === 'All'
            ? vaultEntries
            : vaultEntries.filter((entry) =>
                Array.isArray(entry.tags) && entry.tags.includes(activeTag)
            );

    
    const [tempMsg, setTempMsg] = useState(null);
    const handleInput = (e) => {
        setTempMsg(e.target.value)
    }

    return (
        <div className="parentContainer">
            <div>
                <Input type="password" title="Enter your name" value={tempMsg} onChange={handleInput} />
                <h2>Dashboard (Protected)</h2>
                <button onClick={handleLogout}>Logout</button>

                {!vaultKey && (
                    <VaultPassphrasePrompt
                        onKeyDerived={(key) => {
                            setVaultKey(key);
                            setPassphrasePrompted(true);
                        }}
                        error={passphrasePrompted && !vaultKey}
                    />
                )}

                {vaultKey && (
                    <>
                        {/* Modular Add Form */}
                        <VaultEntryForm vaultKey={vaultKey} onSuccess={fetchVault} />

                        {/* Tag Filtering */}
                        <TagFilterPanel
                            allTags={allTags}
                            activeTag={activeTag}
                            onTagSelect={(tag) => setActiveTag(tag)}
                        />

                        {/* Vault Entry Listing */}
                        <h3>Your Vault Entries</h3>
                        {message && <p>{message}</p>}

                        <VaultEntryList
                            entries={filteredEntries}
                            vaultKey={vaultKey}
                            token={token}
                            onRefresh={fetchVault}
                        />

                        {/* Export Buttons */}
                        <VaultExportPanel
                            vaultEntries={vaultEntries}
                            vaultKey={vaultKey}
                        />
                    </>
                )}
            </div>
            <StarBackground />
        </div>
    );
};

export default Dashboard;