import { createContext } from 'react';
import { CtxDataType } from '../Types';

const Context = createContext<CtxDataType>({
  graphType: 'trendLines',
  selectedRegions: [],
  selectedCountries: [],
  selectedIncomeGroups: [],
  xAxisIndicator: '',
  showLabel: false,
  showSource: false,
  reverseOrder: true,
  verticalBarLayout: true,
  dataListCountry: undefined,
  multiCountryTrendChartCountries: ['China', 'India', 'Indonesia', 'Pakistan'],
  updateGraphType: (
    _d:
      | 'multiCountryTrendLine'
      | 'barGraph'
      | 'dataList'
      | 'trendLines'
      | 'tableView',
  ) => {},
  updateSelectedRegions: (_d: string[]) => {},
  updateSelectedCountries: (_d: string[]) => {},
  updateSelectedIncomeGroups: (_d: string[]) => {},
  updateXAxisIndicator: (_d: string) => {},
  updateDataListCountry: (_d: string) => {},
  updateShowLabel: (_d: boolean) => {},
  updateShowSource: (_d: boolean) => {},
  updateReverseOrder: (_d: boolean) => {},
  updateBarLayout: (_d: boolean) => {},
  updateMultiCountryTrendChartCountries: (_d: string[]) => {},
});

export default Context;
