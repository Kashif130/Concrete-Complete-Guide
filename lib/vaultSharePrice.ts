import { getAddress, type Address } from "viem";
import { getPublicClient, type ChainKey } from "@/lib/chains";
import { erc4626Abi } from "@/lib/erc4626Abi";

/**
 * Reads a vault's current share price the same way /api/vault and the
 * original /api/alert-check do: totalAssets / totalSupply, each
 * normalized by its own token's decimals (the underlying asset's
 * decimals can differ from the vault share token's).
 */
export async function readVaultSharePrice(chain: ChainKey, vaultAddress: string): Promise<number | null> {
  const client = getPublicClient(chain);
  const vault = getAddress(vaultAddress) as Address;

  const [decimals, assetAddress, totalAssets, totalSupply] = await Promise.all([
    client.readContract({ address: vault, abi: erc4626Abi, functionName: "decimals" }),
    client.readContract({ address: vault, abi: erc4626Abi, functionName: "asset" }).catch(() => null),
    client.readContract({ address: vault, abi: erc4626Abi, functionName: "totalAssets" }),
    client.readContract({ address: vault, abi: erc4626Abi, functionName: "totalSupply" }),
  ]);

  let underlyingDecimals = decimals as number;
  if (assetAddress) {
    try {
      underlyingDecimals = await client.readContract({
        address: assetAddress as Address,
        abi: erc4626Abi,
        functionName: "decimals",
      });
    } catch {
      // fall back to share decimals if the underlying can't be read
    }
  }

  const supply = totalSupply as bigint;
  if (supply <= 0n) return null;
  return Number(totalAssets as bigint) / 10 ** underlyingDecimals / (Number(supply) / 10 ** (decimals as number));
}
