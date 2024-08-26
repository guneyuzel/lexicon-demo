"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";

type Contact = {
  name: string;
  publicKey: string;
};

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState("");
  const [newPublicKey, setNewPublicKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newPublicKey) {
      try {
        new PublicKey(newPublicKey);
        setContacts([...contacts, { name: newName, publicKey: newPublicKey }]);
        setNewName("");
        setNewPublicKey("");
      } catch (error) {
        alert("Invalid public key");
      }
    }
  };

  const removeContact = (publicKey: string) => {
    setContacts(contacts.filter(contact => contact.publicKey !== publicKey));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.publicKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
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
            <span>
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
      <form onSubmit={addContact} className="space-y-2">
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