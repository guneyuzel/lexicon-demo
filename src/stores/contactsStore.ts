import create from 'zustand';

type Contact = {
  name: string;
  publicKey: string;
};

type ContactsStore = {
  contacts: Contact[];
  addContact: (name: string, publicKey: string) => void;
  removeContact: (publicKey: string) => void;
  loadContacts: () => void;
};

export const useContactsStore = create<ContactsStore>((set) => ({
  contacts: [],
  addContact: (name, publicKey) => set((state) => {
    const newContacts = [...state.contacts, { name, publicKey }];
    localStorage.setItem("contacts", JSON.stringify(newContacts));
    return { contacts: newContacts };
  }),
  removeContact: (publicKey) => set((state) => {
    const newContacts = state.contacts.filter(contact => contact.publicKey !== publicKey);
    localStorage.setItem("contacts", JSON.stringify(newContacts));
    return { contacts: newContacts };
  }),
  loadContacts: () => {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      set({ contacts: JSON.parse(storedContacts) });
    }
  },
}));