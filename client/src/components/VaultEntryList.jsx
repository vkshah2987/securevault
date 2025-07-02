/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { decryptPassword, encryptPassword } from '../utils/encryption';

import Input from "./sharable-ui/Input";

const VaultEntryList = ({ entries, vaultKey, token, type = 'list', onRefresh }) => {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editTags, setEditTags] = useState('');

  const startEdit = (entry) => {
    setEditId(entry._id);
    setEditTitle(entry.title);
    setEditUsername(entry.username);
    setEditPassword(decryptPassword(entry.encryptedPassword, vaultKey));
    setEditTags(entry.tags?.join(', ') || '');
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const handleSave = async () => {
    try {
      const encryptedPassword = encryptPassword(editPassword, vaultKey);
      await axios.put(
        `/vault/${editId}`,
        {
          title: editTitle,
          username: editUsername,
          encryptedPassword,
          tags: editTags.split(',').map((tag) => tag.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditId(null);
      onRefresh();
    } catch (err) {
      alert('Failed to update entry.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/vault/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onRefresh();
    } catch (err) {
      alert('Failed to delete entry.');
    }
  };

  return (
    <>
      {type === 'listNot' && <ul>
        {entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          entries.map((entry) => {
            const isEditing = editId === entry._id;

            return (
              <li key={entry._id}>
                {isEditing ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    /><br />
                    <input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Username"
                    /><br />
                    <input
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Password"
                    /><br />
                    <input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Tags (comma separated)"
                    /><br />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{entry.title}</strong><br />
                    Username: {entry.username}<br />
                    Password: {decryptPassword(entry.encryptedPassword, vaultKey)}<br />
                    Tags: {entry.tags?.join(', ') || 'None'}<br />
                    <button onClick={() => startEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry._id)}>Delete</button>
                    <hr />
                  </>
                )}
              </li>
            );
          })
        )}
      </ul>}

      {
        type === 'list' && (
          <div className='listContainer'>
            {
              entries.length === 0 ? (<div>No Record Exist</div>) : 
              (
                entries.map(item => {
                  return (
                    <div className='listItem'>
                      <img src="https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456" alt="" />
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.username}</p>
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
        )
      }

      {
        type === 'view' && (
          <div className='vaultViewContainer'>
            <div className='rowOne glassEffect'>
              <img src="https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456" alt="" />
              <div className='rowOneData'>
                <label htmlFor="">Netflix</label>
                <button><img src='src/assets/search.svg'></img>Edit</button>
              </div>
            </div>
            <div className='rowTwo glassEffect'>
              <Input
                customClassName = 'marginleft-zero'
                inputClassName='disableEdit'
                type="text"
                name="website"
                title="Website"
                value={'www.google.com'}
              />
              <Input
                customClassName = 'marginleft-zero'
                inputClassName='disableEdit'
                type="text"
                name="username"
                title="Username"
                value={'vkumar90sai'}
              />
              <Input
                customClassName = 'marginleft-zero'
                inputClassName='disableEdit'
                type="password"
                name="password"
                title="Password"
                value={'www.google.com'}
              />
              <Input
              customClassName = 'marginleft-zero'
                inputClassName='disableEdit'
                type="text"
                name="category"
                title="Category"
                value={'work'}
              />
            </div>
          </div>
        )
      }
    </>
  );
};

export default VaultEntryList;
