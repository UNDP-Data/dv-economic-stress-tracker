import { useContext, useState } from 'react';
import { format } from 'd3-format';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { scaleLinear, scaleBand } from 'd3-scale';
import minBy from 'lodash.minby';
import UNDPColorModule from 'undp-viz-colors';
import {
  DataType,
  CtxDataType,
  HoverDataType,
  HoverRowDataType,
  IndicatorMetaDataType,
} from '../../Types';
import Context from '../../Context/Context';
import { MAX_TEXT_LENGTH } from '../../Constants';
import { Tooltip } from '../../Components/Tooltip';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const { data, indicators, svgWidth, svgHeight } = props;
  const {
    xAxisIndicator,
    selectedCountries,
    selectedRegions,
    selectedIncomeGroups,
  } = useContext(Context) as CtxDataType;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const margin = {
    top: 40,
    bottom: 50,
    left: 90,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
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
        const colorArr = xIndicatorMetaData.reverse
          ? [...UNDPColorModule.sequentialColors.negativeColorsx04].reverse()
          : UNDPColorModule.sequentialColors.negativeColorsx04;
        const bgColor =
          xVal === undefined
            ? UNDPColorModule.graphBackgroundColor
            : xIndicatorMetaData.CategoriesRange.findIndex(
                range => xVal <= range,
              ) === -1
            ? colorArr[3]
            : colorArr[
                xIndicatorMetaData.CategoriesRange.findIndex(
                  range => xVal <= range,
                )
              ];
        return {
          countryCode: d['Alpha-3 code'],
          countryName: d['Country or Area'],
          xVal,
          region,
          incomeGroup,
          country,
          xYear,
          bgColor,
        };
      })
      .filter(d => d.xVal !== undefined),
    'xVal',
    'asc',
  );

  const xMaxValue = maxBy(dataFormatted, d => d.xVal)
    ? (maxBy(dataFormatted, d => d.xVal)?.xVal as number)
    : 0;
  const xMinValue = minBy(dataFormatted, d => d.xVal)
    ? (minBy(dataFormatted, d => d.xVal)?.xVal as number)
    : 0;

  const heightScale = scaleLinear()
    .domain([xMinValue > 0 ? 0 : xMinValue, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  const yTicks = heightScale.ticks(5);
  const xScale = scaleBand()
    .domain(dataFormatted.map(d => d.countryCode))
    .range([0, graphWidth])
    .paddingInner(0.25);
  return (
    <>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {yTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  y1={heightScale(d)}
                  y2={heightScale(d)}
                  x1={0}
                  x2={graphWidth}
                  stroke='#AAA'
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={0}
                  y={heightScale(d)}
                  fill={UNDPColorModule.graphGray}
                  textAnchor='end'
                  fontSize={12}
                  dy={3}
                  dx={-2}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              y1={heightScale(0)}
              y2={heightScale(0)}
              x1={0}
              x2={graphWidth}
              stroke={UNDPColorModule.graphGray}
              strokeWidth={1}
            />
            <text
              x={0}
              y={heightScale(0)}
              fill={UNDPColorModule.graphGray}
              textAnchor='end'
              fontSize={12}
              dy={3}
              dx={-2}
            >
              {0}
            </text>
            <text
              transform={`translate(-50, ${graphHeight / 2}) rotate(-90)`}
              fill='#212121'
              textAnchor='middle'
              fontSize={12}
            >
              {xIndicatorMetaData.Indicator.length > MAX_TEXT_LENGTH
                ? `${xIndicatorMetaData.Indicator.substring(
                    0,
                    MAX_TEXT_LENGTH,
                  )}...`
                : xIndicatorMetaData.Indicator}
            </text>
          </g>

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
                <rect
                  x={xScale(d.countryCode)}
                  y={heightScale(Math.max(0, d.xVal))}
                  width={xScale.bandwidth()}
                  fill={d.bgColor}
                  height={Math.abs(heightScale(d.xVal) - heightScale(0))}
                />
                {xScale.bandwidth() >= 7 && xScale.bandwidth() < 20 ? (
                  <g
                    transform={`translate(${
                      (xScale(d.countryCode) as number) + xScale.bandwidth() / 2
                    },${heightScale(0)})`}
                  >
                    <text
                      x={0}
                      y={0}
                      fontSize='10px'
                      textAnchor={d.xVal >= 0 ? 'end' : 'start'}
                      fill='#110848'
                      transform='rotate(-90)'
                      dy='5px'
                      dx={d.xVal >= 0 ? '-5px' : '19px'}
                    >
                      {countryData['Alpha-3 code']}
                    </text>
                  </g>
                ) : null}
                {xScale.bandwidth() >= 20 ? (
                  <text
                    x={
                      (xScale(d.countryCode) as number) + xScale.bandwidth() / 2
                    }
                    y={heightScale(0)}
                    fontSize='12px'
                    textAnchor='middle'
                    fill='#110848'
                    dy={d.xVal >= 0 ? '15px' : '-5px'}
                  >
                    {d.countryCode}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </>
  );
}
