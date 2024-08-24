export function lookupContact(name: string): string | null {
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    const contact = contacts.find((c: { name: string; publicKey: string }) => 
      c.name.toLowerCase() === name.toLowerCase()
    );
    return contact ? contact.publicKey : null;
  }