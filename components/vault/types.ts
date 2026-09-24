import type { Market, PeriodKey, VaultId, VaultLive, VolKey, WindowKey } from "@/lib/vault/data";

export type Settings = {
  vaultId: VaultId;
  principal: number;
  period: PeriodKey;
  compound: boolean;
  marketVol: VolKey;
  window: WindowKey;
};

export type TabProps = {
  vault: VaultLive;
  vaults: VaultLive[];
  s: Settings;
  market: Market;
};
