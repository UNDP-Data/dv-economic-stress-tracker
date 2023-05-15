/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable jsx-a11y/iframe-has-title */
import { useState, useEffect, useReducer } from 'react';
import { json, csv } from 'd3-request';
import uniqBy from 'lodash.uniqby';
import groupBy from 'lodash.groupby';
import { queue } from 'd3-queue';
import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import {
  DataKeysType,
  DataType,
  DataTypeFromCSV,
  IndicatorMetaDataType,
  IndicatorMetaDataTypeWithoutYear,
} from './Types';
import { GrapherComponent } from './GrapherComponent';
import Reducer from './Context/Reducer';
import Context from './Context/Context';
import { DEFAULT_VALUES } from './Constants';

const VizAreaEl = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 10rem;
`;

function App() {
  const [finalData, setFinalData] = useState<DataType[] | undefined>(undefined);
  const [indicatorsList, setIndicatorsList] = useState<
    IndicatorMetaDataType[] | undefined
  >(undefined);
  const [regionList, setRegionList] = useState<string[] | undefined>(undefined);
  const [countryList, setCountryList] = useState<string[] | undefined>(
    undefined,
  );
  const queryParams = new URLSearchParams(window.location.search);
  const initialState = {
    graphType: 'tableView',
    selectedRegions: queryParams.get('regions')?.split('~') || [],
    selectedCountries: queryParams.get('countries')?.split('~') || [],
    selectedIncomeGroups: queryParams.get('incomeGroups')?.split('~') || [],
    multiCountryTrendChartCountries: [
      'China',
      'India',
      'Indonesia',
      'Pakistan',
    ],
    xAxisIndicator:
      queryParams.get('firstMetric') || DEFAULT_VALUES.firstMetric,
    showLabel: queryParams.get('showLabel') === 'true',
    showSource: false,
    reverseOrder: queryParams.get('reverseOrder') === 'true',
    dataListCountry: 'Bangladesh',
    verticalBarLayout: queryParams.get('verticalBarLayout') !== 'false',
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const updateGraphType = (
    graphType: 'scatterPlot' | 'map' | 'barGraph' | 'trendLine' | 'tableView',
  ) => {
    dispatch({
      type: 'UPDATE_GRAPH_TYPE',
      payload: graphType,
    });
  };

  const updateReverseOrder = (reverseOrder: boolean) => {
    dispatch({
      type: 'UPDATE_REVERSE_ORDER',
      payload: reverseOrder,
    });
  };

  const updateSelectedRegions = (selectedRegions: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_REGIONS',
      payload: selectedRegions,
    });
  };

  const updateSelectedCountries = (selectedCountries: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRIES',
      payload: selectedCountries,
    });
  };

  const updateXAxisIndicator = (xAxisIndicator: string) => {
    dispatch({
      type: 'UPDATE_X_AXIS_INDICATOR',
      payload: xAxisIndicator,
    });
  };

  const updateSelectedIncomeGroups = (selectedIncomeGroups?: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_INCOME_GROUPS',
      payload: selectedIncomeGroups,
    });
  };

  const updateShowLabel = (showLabel: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_LABEL',
      payload: showLabel,
    });
  };

  const updateShowSource = (showSource: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_SOURCE',
      payload: showSource,
    });
  };

  const updateBarLayout = (varticalBarLayout: boolean) => {
    dispatch({
      type: 'UPDATE_BAR_LAYOUT',
      payload: varticalBarLayout,
    });
  };

  const updateDataListCountry = (country: string) => {
    dispatch({
      type: 'UPDATE_DATA_LIST_COUNTRY',
      payload: country,
    });
  };

  const updateMultiCountryTrendChartCountries = (
    multiCountryTrendChartCountries: string[],
  ) => {
    dispatch({
      type: 'UPDATE_MULTI_COUNTRY_TREND_CHART_COUNTRIES',
      payload: multiCountryTrendChartCountries,
    });
  };

  useEffect(() => {
    queue()
      .defer(csv, './data/data.csv')
      .defer(json, './data/indicatorMetaData.json')
      .await(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          err: any,
          data: DataTypeFromCSV[],
          indicatorMetaData: IndicatorMetaDataTypeWithoutYear[],
        ) => {
          if (err) throw err;
          const dataFormatted = data.map(d => ({
            ...d,
            date: new Date(
              +d.date.split('/')[2],
              parseInt(d.date.split('/')[1], 10) - 1,
              +d.date.split('/')[0],
            ),
            year: +d.year,
            debtpctgdp: d.debtpctgdp === '' ? null : +d.debtpctgdp,
            sovrate: d.sovrate === '' ? null : +d.sovrate,
            dsp_pctexp: d.dsp_pctexp === '' ? null : +d.dsp_pctexp,
            reserves_mthimp:
              d.reserves_mthimp === '' ? null : +d.reserves_mthimp,
            erdep: d.erdep === '' ? null : +d.erdep,
            inflation: d.inflation === '' ? null : +d.inflation,
            wb_incgroup: d.inflation === '' ? null : d.wb_incgroup,
          }));

          const groupedData = groupBy(dataFormatted, 'ISOalpha3code');
          const dataKeys: DataKeysType[] = [
            'debtpctgdp',
            'sovrate',
            'dsp_pctexp',
            'reserves_mthimp',
            'erdep',
            'inflation',
          ];
          const indicatorMetaDataWithMinMaxYear = indicatorMetaData.map(d => ({
            ...d,
            minYear: sortBy(
              dataFormatted.filter(el => el[d.DataKey] !== null),
              'date',
            )[0].date,
            maxYear: sortBy(
              dataFormatted.filter(el => el[d.DataKey] !== null),
              'date',
              'desc',
            )[0].date,
          }));
          const finalFormattedData = Object.keys(groupedData).map(key => {
            const incomeGroup =
              groupedData[key].filter(d => d.wb_incgroup).length > 0
                ? groupedData[key].filter(d => d.wb_incgroup)[
                    groupedData[key].filter(d => d.wb_incgroup).length - 1
                  ].wb_incgroup
                : '';
            const indicatorData = dataKeys.map(el => ({
              indicator: el as string,
              yearlyData: sortBy(
                groupedData[key]
                  .filter(d => d[el] !== null)
                  .map(d => ({
                    date: d.date,
                    value: d[el] as number,
                  })),
                'date',
              ),
            }));
            return {
              'Alpha-3 code': groupedData[key][0].ISOalpha3code,
              'Country or Area': groupedData[key][0].Country,
              'Group 1': groupedData[key][0].BRH_region,
              'Income group': incomeGroup || '',
              data: indicatorData,
            };
          });
          setFinalData(finalFormattedData);
          setCountryList(
            uniqBy(dataFormatted, 'ISOalpha3code').map(d => d.Country),
          );
          setRegionList(
            uniqBy(dataFormatted, 'BRH_region').map(d => d.BRH_region),
          );
          setIndicatorsList(indicatorMetaDataWithMinMaxYear);
        },
      );
  }, []);
  return (
    <div>
      {indicatorsList && finalData && regionList && countryList ? (
        <div className='undp-container'>
          <Context.Provider
            value={{
              ...state,
              updateGraphType,
              updateSelectedRegions,
              updateSelectedCountries,
              updateXAxisIndicator,
              updateSelectedIncomeGroups,
              updateShowLabel,
              updateShowSource,
              updateReverseOrder,
              updateBarLayout,
              updateDataListCountry,
              updateMultiCountryTrendChartCountries,
            }}
          >
            <GrapherComponent
              data={finalData}
              indicators={indicatorsList}
              regions={regionList}
              countries={countryList}
            />
          </Context.Provider>
        </div>
      ) : (
        <VizAreaEl className='undp-container'>
          <div className='undp-loader' />
        </VizAreaEl>
      )}
    </div>
  );
}

export default App;
