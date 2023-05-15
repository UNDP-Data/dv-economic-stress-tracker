import { useContext } from 'react';
import sortBy from 'lodash.sortby';
import UNDPColorModule from 'undp-viz-colors';
import { DataType, CtxDataType, IndicatorMetaDataType } from '../../Types';
import Context from '../../Context/Context';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
}

export function TableView(props: Props) {
  const { data, indicators } = props;
  const { selectedRegions, selectedIncomeGroups, selectedCountries } =
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
  const dataFIlteredFinal = dataFilteredByCountry;
  return (
    <div>
      <div>
        <div className='undp-table-head undp-table-head-sticky'>
          <div
            style={{ width: '30%' }}
            className='undp-table-head-cell undp-sticky-head-column'
          >
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              Country
            </div>
          </div>
          {indicators.map((d, i) => (
            <div
              style={{ width: '20%' }}
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
            style={{ backgroundColor: 'var(--white)' }}
          >
            <div
              style={{ width: '30%', fontSize: '1rem' }}
              className='undp-table-row-cell'
            >
              <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                <h5 className='undp-typography'>{d['Country or Area']}</h5>
              </div>
            </div>
            {indicators.map((el, j) => {
              const val =
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
                ? UNDPColorModule.divergentColors.colorsx04.reverse()
                : UNDPColorModule.divergentColors.colorsx04;
              const bgColor =
                val === 'NA'
                  ? UNDPColorModule.graphBackgroundColor
                  : el.CategoriesRange.findIndex(range => val <= range) === -1
                  ? colorArr[3]
                  : colorArr[
                      el.CategoriesRange.findIndex(range => val <= range)
                    ];
              const textColor =
                val === 'NA'
                  ? 'var(--black)'
                  : el.CategoriesRange.findIndex(range => val <= range) === 0 ||
                    el.CategoriesRange.findIndex(range => val <= range) === -1
                  ? 'var(--white)'
                  : 'var(--black)';
              return (
                <div
                  key={j}
                  style={{
                    width: '20%',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontWeight: 'bold',
                  }}
                  className='undp-table-row-cell align-right'
                >
                  <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    {val}
                    {el.LabelSuffix}
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
