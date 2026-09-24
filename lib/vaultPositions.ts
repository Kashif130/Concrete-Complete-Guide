// Shared helper: given a wallet, read its live position (shares + underlying
// value) across every vault in KNOWN_VAULT_INFO, on every supported chain.
// Used by the Telegram bot's /myvaults command. app/api/vault/route.ts stays
// as-is (manual chain+vault-list mode for the website UI) — this is the
// "scan everything we know about" counterpart, the same convenience
// /api/vaults already provides for the aggregate (no-wallet) dashboard.
import { getAddress } from "viem";
import { getPublicClient, type ChainKey, SUPPORTED_CHAINS } from "./chains";
import { erc4626Abi, erc20MetadataAbi } from "./erc4626Abi";
import { formatUnits } from "./units";
import { KNOWN_VAULT_INFO } from "./knownVaults";

export type WalletVaultPosition = {
  chain: ChainKey;
  vaultAddress: string;
  label: string; // from KNOWN_VAULT_INFO, e.g. "Concrete DeFi USDT (ctDefiUSDT)"
  symbol: string | null;
  underlyingSymbol: string | null;
  sharesHeldFormatted: string;
  underlyingValueFormatted: string;
  error?: string;
};

/**
 * Reads on-chain balance for `wallet` in every known vault, across every
 * chain in KNOWN_VAULT_INFO. Returns only vaults where the wallet holds a
 * non-zero share balance (a Telegram reply isn't the place for a wall of
 * zeroes) — pass `includeZero: true` to get every vault instead.
 */
export async function getWalletVaultPositions(
  wallet: string,
  opts: { includeZero?: boolean } = {}
): Promise<WalletVaultPosition[]> {
  const account = getAddress(wallet);
  const chainKeys = Object.keys(KNOWN_VAULT_INFO) as ChainKey[];

  const perChain = await Promise.all(
    chainKeys.map(async (chainKey) => {
      const vaults = KNOWN_VAULT_INFO[chainKey];
      if (vaults.length === 0) return [] as WalletVaultPosition[];

      const client = getPublicClient(chainKey);
      const blockNumber = await client.getBlockNumber().catch(() => null);
      const blockTagOpt = blockNumber !== null ? { blockNumber } : {};

      return Promise.all(
        vaults.map(async (info): Promise<WalletVaultPosition> => {
          try {
            const vault = getAddress(info.address);
            const [symbol, decimals, assetAddress, shares] = await Promise.all([
              client.readContract({ address: vault, abi: erc4626Abi, functionName: "symbol", ...blockTagOpt }).catch(() => null),
              client.readContract({ address: vault, abi: erc4626Abi, functionName: "decimals", ...blockTagOpt }),
              client.readContract({ address: vault, abi: erc4626Abi, functionName: "asset", ...blockTagOpt }).catch(() => null),
              client.readContract({ address: vault, abi: erc4626Abi, functionName: "balanceOf", args: [account], ...blockTagOpt }),
            ]);

            const underlyingValue = await client
              .readContract({ address: vault, abi: erc4626Abi, functionName: "convertToAssets", args: [shares], ...blockTagOpt })
              .catch(() => null);

            let underlyingSymbol: string | null = null;
            let underlyingDecimals = decimals;
            if (assetAddress) {
              try {
                [underlyingSymbol, underlyingDecimals] = await Promise.all([
                  client.readContract({ address: assetAddress, abi: erc20MetadataAbi, functionName: "symbol", ...blockTagOpt }),
                  client.readContract({ address: assetAddress, abi: erc20MetadataAbi, functionName: "decimals", ...blockTagOpt }),
                ]);
              } catch {
                // best-effort
              }
            }

            return {
              chain: chainKey,
              vaultAddress: vault,
              label: info.label,
              symbol,
              underlyingSymbol,
              sharesHeldFormatted: formatUnits(shares, decimals),
              underlyingValueFormatted: formatUnits(underlyingValue ?? 0n, underlyingDecimals),
            };
          } catch (err) {
            return {
              chain: chainKey,
              vaultAddress: info.address,
              label: info.label,
              symbol: null,
              underlyingSymbol: null,
              sharesHeldFormatted: "0",
              underlyingValueFormatted: "0",
              error: err instanceof Error ? err.message : "read failed",
            };
          }
        })
      );
    })
  );

  const flat = perChain.flat();
  if (opts.includeZero) return flat;
  return flat.filter((p) => !p.error && Number(p.sharesHeldFormatted) > 0);
}

export function isSupportedChain(v: string): v is ChainKey {
  return v in SUPPORTED_CHAINS;
}
