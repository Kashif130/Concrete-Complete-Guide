import type { DocBlock } from "../docs.generated";
import type { Locale } from "@/lib/i18n";
import { whatIsConcrete } from "./what-is-concrete";
import { defiPrimer } from "./defi-primer";
import { gettingStarted } from "./getting-started";
import { vaultSharesAndYield } from "./vault-shares-and-yield";
import { withdrawals } from "./withdrawals";
import { fees } from "./fees";
import { pointsAndRewards } from "./points-and-rewards";
import { vaultCatalog } from "./vault-catalog";
import { strategiesAndCurators } from "./strategies-and-curators";
import { institutionalAssetcxEnterprise } from "./institutional-assetcx-enterprise";
import { campaignsAndPredeposits } from "./campaigns-and-predeposits";
import { securityAndAudits } from "./security-and-audits";
import { risks } from "./risks";
import { architectureDeepDive } from "./architecture-deep-dive";
import { accountingAndYieldMath } from "./accounting-and-yield-math";
import { asyncWithdrawalsDeepDive } from "./async-withdrawals-deep-dive";
import { sdkGuide } from "./sdk-guide";
import { launchingAVaultWalkthrough } from "./launching-a-vault-walkthrough";
import { toolsCatalog } from "./tools-catalog";
import { subgraphAndEvents } from "./subgraph-and-events";
import { faqAToZ } from "./faq-a-to-z";
import { glossary } from "./glossary";
import { resourcesAndLinks } from "./resources-and-links";
import { sourcesAndMethodology } from "./sources-and-methodology";

export const translations: Record<string, Partial<Record<Locale, DocBlock[]>>> = {
  "01-beginner/01-what-is-concrete": whatIsConcrete,
  "01-beginner/02-defi-primer": defiPrimer,
  "01-beginner/03-getting-started": gettingStarted,
  "01-beginner/04-vault-shares-and-yield": vaultSharesAndYield,
  "01-beginner/05-withdrawals": withdrawals,
  "01-beginner/06-fees": fees,
  "01-beginner/07-points-and-rewards": pointsAndRewards,
  "02-intermediate/01-vault-catalog": vaultCatalog,
  "02-intermediate/02-strategies-and-curators": strategiesAndCurators,
  "02-intermediate/03-institutional-assetcx-enterprise": institutionalAssetcxEnterprise,
  "02-intermediate/04-campaigns-and-predeposits": campaignsAndPredeposits,
  "02-intermediate/05-security-and-audits": securityAndAudits,
  "02-intermediate/06-risks": risks,
  "03-advanced/01-architecture-deep-dive": architectureDeepDive,
  "03-advanced/02-accounting-and-yield-math": accountingAndYieldMath,
  "03-advanced/03-async-withdrawals-deep-dive": asyncWithdrawalsDeepDive,
  "03-advanced/04-sdk-guide": sdkGuide,
  "03-advanced/05-subgraph-and-events": subgraphAndEvents,
  "03-advanced/06-launching-a-vault-walkthrough": launchingAVaultWalkthrough,
  "04-ecosystem/01-tools-catalog": toolsCatalog,
  "05-reference/01-faq-a-to-z": faqAToZ,
  "05-reference/02-glossary": glossary,
  "05-reference/03-resources-and-links": resourcesAndLinks,
  "05-reference/04-sources-and-methodology": sourcesAndMethodology,
};
