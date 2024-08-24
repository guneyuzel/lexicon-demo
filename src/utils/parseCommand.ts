export function parseCommand(command: string) {
  const parts = command.toLowerCase().split(' ');
  if (parts.length < 4) {
    throw new Error('Invalid command format. Use: send [amount] sol to [recipient_name_or_public_key]');
  }

  const action = parts[0];
  const amount = parseFloat(parts[1]);
  const token = parts[2];
  const recipient = parts.slice(4).join(' ');

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

  return { action, amount, token, recipient };
}