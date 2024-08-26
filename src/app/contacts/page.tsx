"use client";

import ContactsList from "@/components/ContactsList";

export default function ContactsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Contacts</h2>
      <ContactsList />
    </div>
  );
}