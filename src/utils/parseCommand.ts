import { lookupContact } from "./contactLookup";
import { PublicKey } from "@solana/web3.js";

export function parseCommand(command: string) {
  const parts = command.toLowerCase().split(' ');
  if (parts.length < 4) {
    throw new Error('Invalid command format. Use: send [amount] sol to [recipient_name_or_public_key]');
  }

  const action = parts[0];
  const amount = parseFloat(parts[1]);
  const token = parts[2];
  const recipientInput = parts.slice(4).join(' ');

  if (action !== 'send') {
    throw new Error('Invalid action. Only "send" is supported.');
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount. Must be a positive number.');
  }

  if (token !== 'sol') {
    throw new Error('Invalid token. Only SOL is supported.');
  }

  if (parts[3] !== 'to') {
    throw new Error('Invalid command format. Use: send [amount] sol to [recipient_name_or_public_key]');
  }

  let recipient: string;
  const contactPublicKey = lookupContact(recipientInput);
  if (contactPublicKey) {
    recipient = contactPublicKey;
  } else {
    try {
      new PublicKey(recipientInput);
      recipient = recipientInput;
    } catch (error) {
      throw new Error('Invalid recipient. Use a contact name or a valid public key.');
    }
  }

  return { action, amount, token, recipient };
}