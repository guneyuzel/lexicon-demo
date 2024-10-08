import { lookupContact } from "./contactLookup";
import { PublicKey } from "@solana/web3.js";

interface ParsedCommand {
  action: string;
  amount: number;
  token: string;
  recipient: string;
}

const tokenAliases: { [key: string]: string } = {
  'solana': 'SOL',
  'usdc': 'USDC',
};

export function parseCommand(command: string): ParsedCommand {
  const words = command.toLowerCase().split(/\s+/);
  let action = '';
  let amount = 0;
  let token = '';
  let recipient = '';

  // Find action
  const actionIndex = words.findIndex(word => word === 'send' || word === 'transfer');
  if (actionIndex !== -1) {
    action = words[actionIndex];
  } else {
    throw new Error('Invalid command. Please specify "send" or "transfer".');
  }

  // Find amount and token
  const amountTokenRegex = /(\d+(?:\.\d+)?)\s*(?:amount\s+of\s+)?(\w+)/i;
  const amountTokenMatch = command.match(amountTokenRegex);
  if (amountTokenMatch) {
    amount = parseFloat(amountTokenMatch[1]);
    token = amountTokenMatch[2].toUpperCase();
    // Check if the token is an alias and replace it with the symbol
    token = tokenAliases[token.toLowerCase()] || token;
  } else {
    throw new Error('Invalid command. Please specify an amount and token (e.g., "10 SOL" or "5 USDC").');
  }

  // Find recipient
  const toIndex = words.indexOf('to');
  if (toIndex !== -1 && toIndex < words.length - 1) {
    const possibleRecipient = words.slice(toIndex + 1).join(' ');
    recipient = lookupContact(possibleRecipient) || possibleRecipient;
  } else {
    // If 'to' is not found, check each word after the token
    const tokenIndex = words.findIndex(word => word === token.toLowerCase());
    for (let i = tokenIndex + 1; i < words.length; i++) {
      const contact = lookupContact(words[i]);
      if (contact) {
        recipient = contact;
        break;
      }
      try {
        new PublicKey(words[i]);
        recipient = words[i];
        break;
      } catch {
        // Not a valid public key, continue to next word
      }
    }
  }

  if (!recipient) {
    throw new Error('Invalid command. Please specify a valid recipient (contact name or public key).');
  }

  return { action, amount, token, recipient };
}