export interface CostRow {
  id: string;
  account: string;
  spendType?: string;
  spendLayer?: string;
  category?: string;
  system?: string;
  supplier?: string;
  internalOrder?: string;
  itemDescription?: string;
  // Values maps scenarioId (e.g. 'Actual-2024') to number value
  values: { [scenarioId: string]: number };
  isParent: boolean;
  isExpandable: boolean;
  children?: CostRow[];
  parentId?: string;
  // Site and Team metadata for reactive filtering
  site?: string;
  team?: string;
}

export type ScenarioType = 'Actual' | 'Predicted' | 'RFC 1' | 'RFC 2' | 'RFC 3' | 'RFC 4';

export interface Scenario {
  id: string; // Type-Year, e.g. "Actual-2024" or "RFC 1-2026"
  type: ScenarioType;
  year: number;
  displayName: string; // e.g. "Actual 2024" or "RFC 1 2026"
}

export interface VarianceColumn {
  id: string;
  label: string; // "Te" or "V" or target scenario names
  compareLeft: string; // scenarioId
  compareRight: string; // scenarioId
}
