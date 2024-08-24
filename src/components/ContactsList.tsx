"use client";

import { useState, useEffect } from "react";

type Contact = {
  name: string;
  publicKey: string;
};

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState("");
  const [newPublicKey, setNewPublicKey] = useState("");

  useEffect(() => {
    // TODO: Fetch contacts from the backend
    const mockContacts: Contact[] = [
      { name: "Alice", publicKey: "ALiCeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
      { name: "Bob", publicKey: "BoBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    ];
    setContacts(mockContacts);
  }, []);

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newPublicKey) {
      setContacts([...contacts, { name: newName, publicKey: newPublicKey }]);
      setNewName("");
      setNewPublicKey("");
    }
  };

  const removeContact = (publicKey: string) => {
    setContacts(contacts.filter(contact => contact.publicKey !== publicKey));
  };

  return (
    <div className="w-full max-w-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.publicKey} className="mb-2 flex justify-between items-center">
            <span>
              <span className="font-bold">{contact.name}:</span>{" "}
              {contact.publicKey.slice(0, 4)}...{contact.publicKey.slice(-4)}
            </span>
            <button
              onClick={() => removeContact(contact.publicKey)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addContact} className="mt-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Contact Name"
          className="w-full p-2 border border-gray-300 rounded text-black mb-2"
        />
        <input
          type="text"
          value={newPublicKey}
          onChange={(e) => setNewPublicKey(e.target.value)}
          placeholder="Public Key"
          className="w-full p-2 border border-gray-300 rounded text-black mb-2"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Contact
        </button>
      </form>
    </div>
  );
}