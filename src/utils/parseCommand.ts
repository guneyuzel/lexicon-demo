import { lookupContact } from "./contactLookup";

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

  const recipientRegex = /\bto\s+(.+?)(?:[.!?]*)$/i;
  const recipientMatch = command.match(recipientRegex);
  if (!recipientMatch) {
    throw new Error('Invalid command. Please specify a recipient.');
  }
  const recipientInput = recipientMatch[1].trim();

  const recipient = lookupContact(recipientInput) || recipientInput;

  return { action, amount, token, recipient };
}