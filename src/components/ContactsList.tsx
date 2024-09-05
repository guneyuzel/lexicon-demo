"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useContactsStore } from "@/stores/contactsStore";

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
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Contacts</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search contacts..."
        className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
      />
      <ul className="space-y-2 mb-4">
        {filteredContacts.map((contact) => (
          <li key={contact.publicKey} className="flex justify-between items-center bg-gray-700 p-3 rounded">
            <span className="text-white">
              <span className="font-bold">{contact.name}:</span>{" "}
              {contact.publicKey.slice(0, 4)}...{contact.publicKey.slice(-4)}
            </span>
            <div>
              <button
                onClick={() => startEditing(contact)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200 mr-2"
                aria-label={`Edit ${contact.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => removeContact(contact.publicKey)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                aria-label={`Remove ${contact.name}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={editingContact ? handleEditContact : handleAddContact} className="space-y-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Contact Name"
          className="w-full p-3 bg-gray-700 rounded text-white"
        />
        <input
          type="text"
          value={newPublicKey}
          onChange={(e) => setNewPublicKey(e.target.value)}
          placeholder="Public Key"
          className="w-full p-3 bg-gray-700 rounded text-white"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
          >
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>
          {editingContact && (
            <button
              type="button"
              onClick={cancelEditing}
              className="flex-1 bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}