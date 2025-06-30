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

    return (
        <div className="parentContainerCenterLayout dashboardPage">
            {/* <div>
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
                        <VaultEntryForm vaultKey={vaultKey} onSuccess={fetchVault} />
                        <TagFilterPanel
                            allTags={allTags}
                            activeTag={activeTag}
                            onTagSelect={(tag) => setActiveTag(tag)}
                        />

                        <h3>Your Vault Entries</h3>
                        {message && <p>{message}</p>}

                        <VaultEntryList
                            entries={filteredEntries}
                            vaultKey={vaultKey}
                            token={token}
                            onRefresh={fetchVault}
                        />

                        <VaultExportPanel
                            vaultEntries={vaultEntries}
                            vaultKey={vaultKey}
                        />
                    </>
                )}
            </div> */}
            <div className="dashboardContainer">

                <div className="sidePanel glassEffect">
                    <div className="logoContainer">
                        <img src="src/assets/SV_Logo.png" alt="" />
                        <label htmlFor="">Secure<br />Vault</label>
                    </div>

                    <div className="menuOption">
                        <div className="menuBarContainer glassEffect">
                            <img src="src/assets/shield.svg" alt="" />
                            <label htmlFor="">Logins</label>
                        </div>
                        <div className="menuBarContainer glassEffect">
                            <img src="src/assets/shield.svg" alt="" />
                            <label htmlFor="">{`Credit Cards [Coming Soon]`}</label>
                        </div>
                        <div className="menuBarContainer glassEffect">
                            <img src="src/assets/shield.svg" alt="" />
                            <label htmlFor="">{`Notes [Coming Soon]`}</label>
                        </div>
                        <div className="menuBarContainer glassEffect">
                            <img src="src/assets/shield.svg" alt="" />
                            <label htmlFor="">{`Favourites [Coming Soon]`}</label>
                        </div>

                        <TagFilterPanel
                                // allTags={allTags}
                                allTags={['fruit', 'veggi']}
                                activeTag={activeTag}
                                onTagSelect={(tag) => setActiveTag(tag)}
                            />
                    </div>
                </div>

                <div className="mainContainer glassEffect">
                    <div className="header">
                        <div className="searchBar glassEffect">
                            <img src="src/assets/search.svg" alt="" />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>
                    <div className="passwordContainer ">
                        <div className="passwordList ">
                            <VaultEntryList
                                entries={filteredEntries}
                                vaultKey={vaultKey}
                                token={token}
                                type='list'
                                onRefresh={fetchVault}
                            />
                        </div>
                        <div className="passwordView glassEffect">
                            <VaultEntryList
                                entries={filteredEntries}
                                vaultKey={vaultKey}
                                token={token}
                                type='view'
                                onRefresh={fetchVault}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <StarBackground />
        </div>
    );
};

export default Dashboard;