export interface CountryGroupDataType {
  'Alpha-3 code': string;
  'Country or Area': string;
  'Group 1': string;
  'Income group': string;
}
export interface IndicatorDataType {
  indicator: string;
  yearlyData: {
    date: Date;
    value: number;
  }[];
}

export interface DataType extends CountryGroupDataType {
  data: IndicatorDataType[];
}

export interface DataTypeFromCSV {
  BRH_region: string;
  ISOalpha3code: string;
  Country: string;
  date: string;
  year: string;
  debtpctgdp: string;
  dsa: string;
  sovrate: string;
  dsp_pctexp: string;
  reserves_mthimp: string;
  erdep: string;
  inflation: string;
  wb_incgroup: string;
}

export type DataKeysType =
  | 'debtpctgdp'
  | 'sovrate'
  | 'dsp_pctexp'
  | 'reserves_mthimp'
  | 'erdep'
  | 'inflation';

export interface IndicatorMetaDataTypeWithoutYear {
  Indicator: string;
  IndicatorDescription: string;
  DataKey: DataKeysType;
  LabelSuffix?: string;
  LabelPrefix?: string;
  LabelFormat?: string;
  CategoriesRange: number[];
  Categories: string[];
  reverse: boolean;
  resolution: 'monthly' | 'yearly' | 'quarterly';
}

export interface IndicatorMetaDataType
  extends IndicatorMetaDataTypeWithoutYear {
  minYear: Date;
  maxYear: Date;
}

export interface HoverRowDataType {
  title?: string;
  value?: string | number;
  prefix?: string;
  suffix?: string;
  type: 'x-axis' | 'y-axis' | 'color' | 'size';
  year: Date;
  color?: string;
  labelExtra?: string | number;
}

export interface HoverDataType {
  country: string;
  continent: string;
  rows: HoverRowDataType[];
  xPosition: number;
  yPosition: number;
}

export interface CtxDataType {
  graphType:
    | 'multiCountryTrendLine'
    | 'barGraph'
    | 'dataList'
    | 'trendLines'
    | 'tableView';
  selectedRegions: string[];
  selectedCountries: string[];
  selectedIncomeGroups: string[];
  xAxisIndicator: string;
  dataListCountry?: string;
  showLabel: boolean;
  showSource: boolean;
  reverseOrder: boolean;
  verticalBarLayout: boolean;
  multiCountryTrendChartCountries: string[];
  updateGraphType: (
    _d:
      | 'multiCountryTrendLine'
      | 'barGraph'
      | 'dataList'
      | 'trendLines'
      | 'tableView',
  ) => void;
  updateSelectedRegions: (_d: string[]) => void;
  updateSelectedCountries: (_d: string[]) => void;
  updateSelectedIncomeGroups: (_d: string[]) => void;
  updateXAxisIndicator: (_d: string) => void;
  updateDataListCountry: (_d: string) => void;
  updateShowSource: (_d: boolean) => void;
  updateShowLabel: (_d: boolean) => void;
  updateReverseOrder: (_d: boolean) => void;
  updateBarLayout: (_d: boolean) => void;
  updateMultiCountryTrendChartCountries: (_d: string[]) => void;
}

export interface LastUpdatedDataType {
  Source: string;
  Date: string;
}
