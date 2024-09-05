"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useContactsStore } from "@/stores/contactsStore";

export default function ContactsList() {
  const { contacts, addContact, removeContact, loadContacts } = useContactsStore();
  const [newName, setNewName] = useState("");
  const [newPublicKey, setNewPublicKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
            <button
              onClick={() => removeContact(contact.publicKey)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
              aria-label={`Remove ${contact.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddContact} className="space-y-2">
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Add Contact
        </button>
      </form>
    </div>
  );
}