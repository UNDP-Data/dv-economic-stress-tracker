import { useContext } from 'react';
import sortBy from 'lodash.sortby';
import UNDPColorModule from 'undp-viz-colors';
import {
  DataType,
  CtxDataType,
  IndicatorMetaDataType,
  CategoriesList,
} from '../../Types';
import Context from '../../Context/Context';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
}

export function TableView(props: Props) {
  const { data, indicators } = props;
  const { selectedRegions, selectedIncomeGroups, selectedCountries, sorting } =
    useContext(Context) as CtxDataType;
  const dataSorted = sortBy(data, 'Country or Area');
  const dataFilteredByRegion =
    selectedRegions.length > 0
      ? dataSorted.filter(d => selectedRegions.indexOf(d['Group 1']) !== -1)
      : dataSorted;
  const dataFilteredByIG =
    selectedIncomeGroups.length > 0
      ? dataFilteredByRegion.filter(
          d => selectedIncomeGroups.indexOf(d['Income group']) !== -1,
        )
      : dataFilteredByRegion;
  const dataFilteredByCountry =
    selectedCountries.length > 0
      ? dataFilteredByIG.filter(
          d => selectedCountries.indexOf(d['Country or Area']) !== -1,
        )
      : dataFilteredByIG;
  const dataFIlteredFinal = sortBy(
    dataFilteredByCountry,
    sorting === 'country' ? 'Country or Area' : 'Group 1',
  );
  return (
    <div>
      <div>
        <div className='undp-table-head undp-table-head-sticky'>
          <div
            style={{ width: '30%', fontSize: '1rem' }}
            className='undp-table-head-cell undp-sticky-head-column'
          >
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              Country
            </div>
          </div>
          {indicators.map((d, i) => (
            <div
              style={{ width: '20%', fontSize: '1rem' }}
              key={i}
              className='undp-table-head-cell undp-sticky-head-column align-right'
            >
              <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                {d.Indicator}
              </div>
            </div>
          ))}
        </div>
        {dataFIlteredFinal.map((d, i) => (
          <div
            key={i}
            className='undp-table-row'
            style={{
              backgroundColor: 'var(--white)',
            }}
          >
            <div
              style={{
                width: '30%',
                fontSize: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
              className='undp-table-row-cell'
            >
              <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className='undp-typography small-font'>
                  <span className='bold'>{d['Country or Area']}</span>{' '}
                  <span style={{ color: 'var(--gray-600)' }}>
                    ({d['Group 1']})
                  </span>
                </div>
              </div>
            </div>
            {indicators.map((el, j) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const val: any =
                d.data.findIndex(d1 => d1.indicator === el.DataKey) === -1
                  ? 'NA'
                  : d.data[d.data.findIndex(d1 => d1.indicator === el.DataKey)]
                      .yearlyData.length > 0
                  ? d.data[d.data.findIndex(d1 => d1.indicator === el.DataKey)]
                      .yearlyData[
                      d.data[
                        d.data.findIndex(d1 => d1.indicator === el.DataKey)
                      ].yearlyData.length - 1
                    ].value
                  : 'NA';
              const colorArr = el.reverse
                ? [
                    ...UNDPColorModule.sequentialColors.negativeColorsx04,
                  ].reverse()
                : UNDPColorModule.sequentialColors.negativeColorsx04;
              const bgColor = el.isCategorical
                ? val === 'NA'
                  ? UNDPColorModule.graphBackgroundColor
                  : UNDPColorModule.sequentialColors.negativeColorsx04[
                      el.Categories.indexOf(val as CategoriesList)
                    ]
                : val === 'NA'
                ? UNDPColorModule.graphBackgroundColor
                : el.CategoriesRange.findIndex(range => val <= range) === -1
                ? colorArr[3]
                : colorArr[el.CategoriesRange.findIndex(range => val <= range)];
              const textColor =
                val === 'NA'
                  ? 'var(--black)'
                  : bgColor ===
                      UNDPColorModule.sequentialColors.negativeColorsx04[0] ||
                    bgColor ===
                      UNDPColorModule.sequentialColors.negativeColorsx04[1]
                  ? 'var(--black)'
                  : 'var(--white)';
              return (
                <div
                  key={j}
                  style={{
                    width: '20%',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontWeight: 'bold',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                  }}
                  className='undp-table-row-cell align-right'
                >
                  <div
                    className='small-font bold'
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                  >
                    {el.isCategorical
                      ? val
                      : val === 'NA'
                      ? val
                      : val.toFixed(1)}
                    {val === 'NA' ? '' : el.LabelSuffix}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
