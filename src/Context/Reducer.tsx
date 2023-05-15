// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_GRAPH_TYPE':
      return { ...state, graphType: action.payload };
    case 'UPDATE_SELECTED_REGIONS':
      return { ...state, selectedRegions: action.payload };
    case 'UPDATE_SELECTED_COUNTRIES':
      return { ...state, selectedCountries: action.payload };
    case 'UPDATE_X_AXIS_INDICATOR':
      return { ...state, xAxisIndicator: action.payload };
    case 'UPDATE_SELECTED_INCOME_GROUPS':
      return { ...state, selectedIncomeGroups: action.payload };
    case 'UPDATE_SHOW_LABEL':
      return { ...state, showLabel: action.payload };
    case 'UPDATE_SHOW_SOURCE':
      return { ...state, showSource: action.payload };
    case 'UPDATE_REVERSE_ORDER':
      return { ...state, reverseOrder: action.payload };
    case 'UPDATE_BAR_LAYOUT':
      return { ...state, verticalBarLayout: action.payload };
    case 'UPDATE_DATA_LIST_COUNTRY':
      return { ...state, dataListCountry: action.payload };
    case 'UPDATE_MULTI_COUNTRY_TREND_CHART_COUNTRIES':
      return { ...state, multiCountryTrendChartCountries: action.payload };
    default:
      return { ...state };
  }
};
