import { lookupContact } from "./contactLookup";

interface ParsedCommand {
  action: string;
  amount: number;
  token: string;
  recipient: string;
}

export function parseCommand(command: string): ParsedCommand {
  const lowercaseCommand = command.toLowerCase();

  // Extract action (send or transfer)
  const actionRegex = /(send|transfer)/i;
  const actionMatch = lowercaseCommand.match(actionRegex);
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
  const recipientRegex = /(?:to\s+)?(\S+)(?:\s+\d+(?:\.\d+)?\s*sol\b|\s*$)/i;
  const recipientMatch = command.match(recipientRegex);
  if (!recipientMatch) {
    throw new Error('Invalid command. Please specify a recipient.');
  }
  const recipientInput = recipientMatch[1].replace(/[.!?]+$/, '');

  // Lookup contact or use as public key
  const recipient = lookupContact(recipientInput) || recipientInput;

  return { action, amount, token, recipient };
}