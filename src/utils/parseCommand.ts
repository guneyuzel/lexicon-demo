import { lookupContact } from "./contactLookup";

interface ParsedCommand {
  action: string;
  amount: number;
  token: string;
  recipient: string;
}

export function parseCommand(command: string): ParsedCommand {
  // Extract action
  const actionRegex = /\b(send|transfer)\b/i;
  const actionMatch = command.match(actionRegex);
  if (!actionMatch) {
    throw new Error('Invalid command. Please specify "send" or "transfer".');
  }
  const action = actionMatch[0].toLowerCase();

  // Extract amount and token
  const amountTokenRegex = /(\d+(\.\d+)?)\s*(sol)\b/i;
  const amountTokenMatch = command.match(amountTokenRegex);
  if (!amountTokenMatch) {
    throw new Error('Invalid command. Please specify an amount and token (e.g., "10 SOL").');
  }
  const amount = parseFloat(amountTokenMatch[1]);
  const token = amountTokenMatch[3].toLowerCase();

  // Extract recipient
  const recipientRegex = /\bto\s+(.+)$/i;
  const recipientMatch = command.match(recipientRegex);
  if (!recipientMatch) {
    throw new Error('Invalid command. Please specify a recipient (e.g., "to Alice" or "to <public key>").');
  }
  const recipientInput = recipientMatch[1].trim();

  // Lookup contact or use as public key
  const recipient = lookupContact(recipientInput) || recipientInput;

  return { action, amount, token, recipient };
}