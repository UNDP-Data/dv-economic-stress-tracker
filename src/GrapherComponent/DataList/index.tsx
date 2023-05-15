import { useContext, useState } from 'react';
import sortBy from 'lodash.sortby';
import { format } from 'd3-format';
import { Input, Select } from 'antd';
import { DataType, CtxDataType, IndicatorMetaDataType } from '../../Types';
import Context from '../../Context/Context';
import { TrendChartSmall } from './TrendChartSmall';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  countries: string[];
}

export function DataList(props: Props) {
  const { data, indicators, countries } = props;
  const { dataListCountry, updateDataListCountry } = useContext(
    Context,
  ) as CtxDataType;
  const [search, updateSearch] = useState<string | undefined>(undefined);
  const countryData = data.filter(
    d => d['Country or Area'] === dataListCountry,
  )[0]?.data;
  return (
    <div>
      {dataListCountry && countryData ? (
        <>
          <div
            style={{
              padding: 'var(--spacing-06)',
              backgroundColor: 'var(--white)',
              borderBottom: '1px solid var(--gray-400)',
              position: 'sticky',
              top: 0,
            }}
          >
            <Input
              className='undp-input'
              placeholder='Search an indicator'
              onChange={d => {
                updateSearch(d.target.value);
              }}
              value={search}
            />
          </div>
          <div>
            <div
              className='undp-table-head undp-table-head-sticky'
              style={{ top: '101px' }}
            >
              <div
                style={{ width: '30%' }}
                className='undp-table-head-cell undp-sticky-head-column'
              >
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  Indicator
                </div>
              </div>
              <div
                style={{ width: '30%' }}
                className='undp-table-head-cell undp-sticky-head-column align-right'
              >
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  Recent Value
                </div>
              </div>
              <div
                style={{ width: '40%' }}
                className='undp-table-head-cell undp-sticky-head-column'
              >
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  Trend
                </div>
              </div>
            </div>
            {sortBy(
              countryData.filter(d =>
                search
                  ? indicators[
                      indicators.findIndex(el => el.DataKey === d.indicator)
                    ].Indicator.toLowerCase().includes(search.toLowerCase())
                  : d,
              ),
              d =>
                indicators[
                  indicators.findIndex(el => el.DataKey === d.indicator)
                ].Indicator,
            ).map((d, i) =>
              indicators.findIndex(el => el.DataKey === d.indicator) !== -1 ? (
                <div
                  key={i}
                  className='undp-table-row'
                  style={{ backgroundColor: 'var(--white)' }}
                >
                  <div
                    style={{ width: '30%', fontSize: '1rem' }}
                    className='undp-table-row-cell'
                  >
                    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      <h5 className='undp-typography'>
                        {
                          indicators[
                            indicators.findIndex(
                              el => el.DataKey === d.indicator,
                            )
                          ].Indicator
                        }
                      </h5>
                    </div>
                  </div>
                  <div
                    style={{ width: '30%' }}
                    className='undp-table-row-cell align-right'
                  >
                    {d.yearlyData.length === 0 ? (
                      'NA'
                    ) : (
                      <div
                        style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                      >
                        <h4 className='undp-typography margin-bottom-00 bold'>
                          {indicators[
                            indicators.findIndex(
                              el => el.DataKey === d.indicator,
                            )
                          ].LabelPrefix
                            ? `${
                                indicators[
                                  indicators.findIndex(
                                    el => el.DataKey === d.indicator,
                                  )
                                ].LabelPrefix
                              } `
                            : ''}
                          {d.yearlyData[d.yearlyData.length - 1].value !==
                          undefined
                            ? (d.yearlyData[d.yearlyData.length - 1]
                                .value as number) < 1000000
                              ? format(',')(
                                  parseFloat(
                                    (
                                      d.yearlyData[d.yearlyData.length - 1]
                                        .value as number
                                    ).toFixed(2),
                                  ),
                                ).replace(',', ' ')
                              : format('.3s')(
                                  d.yearlyData[d.yearlyData.length - 1]
                                    .value as number,
                                ).replace('G', 'B')
                            : d.yearlyData[d.yearlyData.length - 1].value}
                          {indicators[
                            indicators.findIndex(
                              el => el.DataKey === d.indicator,
                            )
                          ].LabelSuffix
                            ? ` ${
                                indicators[
                                  indicators.findIndex(
                                    el => el.DataKey === d.indicator,
                                  )
                                ].LabelSuffix
                              }`
                            : ''}
                        </h4>
                        <p
                          className='undp-typography margin-bottom-00'
                          style={{
                            fontSize: '1rem',
                            color: 'var(--gray-500)',
                          }}
                        >
                          (
                          {d.yearlyData[
                            d.yearlyData.length - 1
                          ].date.toDateString()}
                          )
                        </p>
                      </div>
                    )}
                  </div>
                  <div style={{ width: '40%' }} className='undp-table-row-cell'>
                    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      <TrendChartSmall
                        countryName={dataListCountry}
                        data={d.yearlyData}
                        indicator={
                          indicators[
                            indicators.findIndex(
                              el => el.DataKey === d.indicator,
                            )
                          ]
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </>
      ) : (
        <div
          className='center-area-info-el'
          style={{ width: 'calc(100% - 2rem)' }}
        >
          <h5 className='undp-typography'>
            Please select countries to see their data list
          </h5>
          <Select
            showSearch
            className='undp-select'
            placeholder='Please select a country'
            onChange={d => {
              updateDataListCountry(d);
            }}
            value={dataListCountry}
            maxTagCount='responsive'
          >
            {countries.map(d => (
              <Select.Option className='undp-select-option' key={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
