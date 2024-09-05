import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export interface TokenInfo {
  mint: string;
  balance: number;
  decimals: number;
  symbol?: string;
}

export async function fetchUserTokens(connection: Connection, publicKey: PublicKey): Promise<TokenInfo[]> {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  return tokenAccounts.value.map((accountInfo) => {
    const parsedInfo = accountInfo.account.data.parsed.info;
    return {
      mint: parsedInfo.mint,
      balance: parsedInfo.tokenAmount.uiAmount,
      decimals: parsedInfo.tokenAmount.decimals,
      symbol: parsedInfo.symbol,
    };
  });
}