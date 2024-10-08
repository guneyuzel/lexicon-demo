"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useContactsStore } from "@/stores/contactsStore";
import { IconEdit, IconTrash, IconPlus, IconX } from '@tabler/icons-react';

export default function ContactsList() {
  const { contacts, addContact, removeContact, editContact, loadContacts } = useContactsStore();
  const [newName, setNewName] = useState("");
  const [newPublicKey, setNewPublicKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState<{ name: string; publicKey: string } | null>(null);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newPublicKey.trim()) {
      try {
        new PublicKey(newPublicKey.trim());
        addContact(newName.trim(), newPublicKey.trim());
        setNewName("");
        setNewPublicKey("");
      } catch (error) {
        alert("Invalid public key or recipient");
      }
    } else {
      alert("Please enter both name and public key");
    }
  };

  const handleEditContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact && newName.trim() && newPublicKey.trim()) {
      try {
        new PublicKey(newPublicKey.trim());
        editContact(editingContact.publicKey, newName.trim(), newPublicKey.trim());
        setEditingContact(null);
        setNewName("");
        setNewPublicKey("");
      } catch (error) {
        alert("Invalid public key or recipient");
      }
    } else {
      alert("Please enter both name and public key");
    }
  };

  const startEditing = (contact: { name: string; publicKey: string }) => {
    setEditingContact(contact);
    setNewName(contact.name);
    setNewPublicKey(contact.publicKey);
  };

  const cancelEditing = () => {
    setEditingContact(null);
    setNewName("");
    setNewPublicKey("");
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.publicKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black p-8 rounded-lg shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">Contacts</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search contacts..."
        className="w-full p-4 mb-6 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-200"
      />
      <ul className="space-y-4 mb-6">
        {filteredContacts.map((contact) => (
          <li key={contact.publicKey} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
            <span className="text-white">
              <span className="font-bold">{contact.name}:</span>{" "}
              {contact.publicKey.slice(0, 4)}...{contact.publicKey.slice(-4)}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(contact)}
                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-200"
                aria-label={`Edit ${contact.name}`}
              >
                <IconEdit size={20} />
              </button>
              <button
                onClick={() => removeContact(contact.publicKey)}
                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-200"
                aria-label={`Remove ${contact.name}`}
              >
                <IconTrash size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={editingContact ? handleEditContact : handleAddContact} className="space-y-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Contact Name"
          className="w-full p-4 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-200"
        />
        <input
          type="text"
          value={newPublicKey}
          onChange={(e) => setNewPublicKey(e.target.value)}
          placeholder="Public Key"
          className="w-full p-4 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-200"
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-white text-black p-4 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center font-semibold"
          >
            {editingContact ? <IconEdit className="mr-2" size={20} /> : <IconPlus className="mr-2" size={20} />}
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>
          {editingContact && (
            <button
              type="button"
              onClick={cancelEditing}
              className="flex-1 bg-white/10 text-white p-4 rounded-lg hover:bg-white/20 transition duration-200 flex items-center justify-center font-semibold"
            >
              <IconX className="mr-2" size={20} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}