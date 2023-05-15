import { useContext, useState } from 'react';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import minBy from 'lodash.minby';
import UNDPColorModule from 'undp-viz-colors';
import {
  CtxDataType,
  DataType,
  HoverDataType,
  HoverRowDataType,
  IndicatorMetaDataType,
} from '../../Types';
import Context from '../../Context/Context';
import { Tooltip } from '../../Components/Tooltip';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  svgWidth: number;
}

export function Graph(props: Props) {
  const { data, indicators, svgWidth } = props;
  const {
    xAxisIndicator,
    selectedCountries,
    selectedRegions,
    selectedIncomeGroups,
    reverseOrder,
  } = useContext(Context) as CtxDataType;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const margin = {
    top: 100,
    bottom: 10,
    left: 175,
    right: 40,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const xIndicatorMetaData =
    indicators[
      indicators.findIndex(indicator => indicator.Indicator === xAxisIndicator)
    ];

  const dataFormatted = orderBy(
    data
      .map(d => {
        const xIndicatorIndex = d.data.findIndex(
          el => xIndicatorMetaData.DataKey === el.indicator,
        );

        const xVal =
          xIndicatorIndex === -1
            ? undefined
            : d.data[xIndicatorIndex].yearlyData[
                d.data[xIndicatorIndex].yearlyData.length - 1
              ]?.value;
        const incomeGroup = !!(
          selectedIncomeGroups.length === 0 ||
          selectedIncomeGroups.indexOf(d['Income group']) !== -1
        );
        const region = !!(
          selectedRegions.length === 0 ||
          selectedRegions.indexOf(d['Group 1']) !== -1
        );
        const country = !!(
          selectedCountries.length === 0 ||
          selectedCountries.indexOf(d['Country or Area']) !== -1
        );
        const xYear =
          d.data[xIndicatorIndex].yearlyData[
            d.data[xIndicatorIndex].yearlyData.length - 1
          ]?.date;
        return {
          countryCode: d['Alpha-3 code'],
          countryName: d['Country or Area'],
          xVal,
          region,
          incomeGroup,
          country,
          xYear,
        };
      })
      .filter(d => d.xVal !== undefined),
    'xVal',
    reverseOrder ? 'desc' : 'asc',
  );

  const svgHeight = dataFormatted.length * 25 + margin.top + margin.bottom;
  const xMaxValue = maxBy(dataFormatted, d => d.xVal)
    ? (maxBy(dataFormatted, d => d.xVal)?.xVal as number)
    : 0;
  const xMinValue = minBy(dataFormatted, d => d.xVal)
    ? (minBy(dataFormatted, d => d.xVal)?.xVal as number)
    : 0;

  const widthScale = scaleLinear()
    .domain([xMinValue > 0 ? 0 : xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();

  const xTicks = widthScale.ticks(5);
  return (
    <div className='undp-scrollbar'>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <text
          x={margin.left}
          y={60}
          fontSize={24}
          fontWeight='bold'
          fill='#212121'
        >
          {xIndicatorMetaData.Indicator}
        </text>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {xTicks.map((d, i) => (
            <g key={i}>
              <text
                x={widthScale(d)}
                y={-12.5}
                fill='#AAA'
                textAnchor='middle'
                fontSize={12}
              >
                {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
              </text>
              <line
                x1={widthScale(d)}
                x2={widthScale(d)}
                y1={-2.5}
                y2={dataFormatted.length * 25 - 2.5}
                stroke='#AAA'
                strokeWidth={1}
                strokeDasharray='4,8'
                opacity={d === 0 ? 0 : 1}
              />
            </g>
          ))}
          {dataFormatted.map((d, i) => {
            const countryData =
              data[data.findIndex(el => el['Alpha-3 code'] === d.countryCode)];
            const selectedColorOpacity =
              d.region && d.incomeGroup && d.country ? 1 : 0.1;
            const rowData: HoverRowDataType[] = [
              {
                title: xAxisIndicator,
                value: d.xVal !== undefined ? d.xVal : 'NA',
                type: 'x-axis',
                year: d.xYear,
                prefix: xIndicatorMetaData?.LabelPrefix,
                suffix: xIndicatorMetaData?.LabelSuffix,
              },
            ];
            if (d.xVal === undefined) return null;
            return (
              <g
                key={i}
                opacity={
                  !hoverData
                    ? selectedColorOpacity
                    : hoverData.country === countryData['Country or Area']
                    ? 1
                    : 0.1
                }
                onMouseEnter={event => {
                  setHoverData({
                    country: countryData['Country or Area'],
                    continent: countryData['Group 1'],
                    rows: rowData,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseMove={event => {
                  setHoverData({
                    country: countryData['Country or Area'],
                    continent: countryData['Group 1'],
                    rows: rowData,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseLeave={() => {
                  setHoverData(undefined);
                }}
              >
                <text
                  fill='#212121'
                  y={i * 25}
                  x={0}
                  dx={-15}
                  dy={14}
                  fontSize={12}
                  textAnchor='end'
                >
                  {d.countryName.length < 25
                    ? d.countryName
                    : `${d.countryName.substring(0, 25)}...`}
                </text>
                <rect
                  y={i * 25}
                  x={widthScale(Math.min(0, d.xVal))}
                  height={20}
                  fill={UNDPColorModule.graphMainColor}
                  width={Math.abs(widthScale(d.xVal) - widthScale(0))}
                  rx={3}
                  ry={3}
                />
                <text
                  fill='#212121'
                  fontWeight='bold'
                  y={i * 25}
                  x={
                    d.xVal < 0
                      ? widthScale(Math.min(0, d.xVal))
                      : widthScale(d.xVal)
                  }
                  dx={d.xVal < 0 ? -5 : 5}
                  textAnchor={d.xVal < 0 ? 'end' : 'start'}
                  dy={14}
                  fontSize={12}
                >
                  {d.xVal < 1000000
                    ? format(',')(parseFloat(d.xVal.toFixed(2))).replace(
                        ',',
                        ' ',
                      )
                    : format('.3s')(d.xVal).replace('G', 'B')}
                </text>
              </g>
            );
          })}
          <line
            x1={widthScale(0)}
            x2={widthScale(0)}
            y1={-2.5}
            y2={dataFormatted.length * 25 - 2.5}
            stroke='#212121'
            strokeWidth={1}
          />
        </g>
      </svg>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </div>
  );
}
