export function lookupContact(name: string): string | null {
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    const normalizedSearchName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const contact = contacts.find((c: { name: string; publicKey: string }) => 
      c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearchName
    );
    
    return contact ? contact.publicKey : null;
  }