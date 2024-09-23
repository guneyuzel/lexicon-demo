import { lookupContact } from "./contactLookup";
import { PublicKey } from "@solana/web3.js";

interface ParsedCommand {
  action: string;
  amount: number;
  token: string;
  recipient: string;
}

export function parseCommand(command: string): ParsedCommand {
  const actionRegex = /\b(send|transfer)\b/i;
  const actionMatch = command.match(actionRegex);
  if (!actionMatch) {
    throw new Error('Invalid command. Please specify "send" or "transfer".');
  }
  const action = actionMatch[0].toLowerCase();

  const amountTokenRegex = /(\d+(?:\.\d+)?)\s*(\w+)\b/i;
  const amountTokenMatch = command.match(amountTokenRegex);
  if (!amountTokenMatch) {
    throw new Error('Invalid command. Please specify an amount and token (e.g., "10 SOL" or "5 USDC").');
  }
  const amount = parseFloat(amountTokenMatch[1]);
  const token = amountTokenMatch[2].toUpperCase();

  const words = command.split(/\s+/);
  let recipient = '';

  for (const word of words) {
    if (word === 'to') continue; // Skip the 'to' word if present
    const contact = lookupContact(word);
    if (contact) {
      recipient = contact;
      break;
    }
    try {
      new PublicKey(word);
      recipient = word;
      break;
    } catch {
      // Not a valid public key, continue to next word
    }
  }

  if (!recipient) {
    throw new Error('Invalid command. Please specify a valid recipient (contact name or public key).');
  }

  return { action, amount, token, recipient };
}