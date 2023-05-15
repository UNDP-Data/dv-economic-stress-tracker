/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import UNDPColorModule from 'undp-viz-colors';
import { format } from 'd3-format';
import { IndicatorMetaDataType } from '../../Types';

interface Props {
  data: {
    date: Date;
    value?: number;
  }[];
  indicator: IndicatorMetaDataType;
  countryName: string;
}

interface HoverToolTipDataType {
  year: Date;
  prefix?: string;
  suffix?: string;
  value: number | 'NA';
  xPosition: number;
  yPosition: number;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  padding: var(--spacing-03);
  top: ${props =>
    props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40}px;
  left: ${props =>
    props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20}px;
  max-width: 24rem;
  transform: ${props =>
    `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${
      props.verticalAlignment === 'top' ? '-100%' : '0%'
    })`};
`;

export function TrendChartSmall(props: Props) {
  const { data, indicator, countryName } = props;
  const [hoverData, setHoverData] = useState<HoverToolTipDataType | undefined>(
    undefined,
  );
  const svgWidth = 320;
  const svgHeight = 240;
  const margin = {
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const { minYear, maxYear } = indicator;

  const minParam: number = minBy(data, d => d.value)?.value
    ? (minBy(data, d => d.value)?.value as number) > 0
      ? 0
      : (minBy(data, d => d.value)?.value as number)
    : 0;
  const maxParam: number = maxBy(data, d => d.value)?.value
    ? (maxBy(data, d => d.value)?.value as number)
    : 0;

  const dataFiltered = data.filter(d => d.value !== undefined);
  const minYearFiltered: Date = minBy(dataFiltered, d => d.date)?.date
    ? (minBy(dataFiltered, d => d.date)?.date as Date)
    : minYear;
  const maxYearFiltered: Date = maxBy(dataFiltered, d => d.date)?.date
    ? (maxBy(dataFiltered, d => d.date)?.date as Date)
    : maxYear;

  const x = scaleLinear()
    .domain([minYearFiltered as Date, maxYearFiltered as Date])
    .range([0, graphWidth]);
  const y1 = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const dataParam1 = data.filter(d => d.value !== undefined);

  const lineShape = line()
    .defined((d: any) => d.value !== undefined)
    .x((d: any) => x(d.date))
    .y((d: any) => y1(d.value))
    .curve(curveMonotoneX);
  const y1Ticks = y1.ticks(5);
  return (
    <>
      <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <rect
          width={svgWidth}
          height={svgHeight}
          x={0}
          y={0}
          style={{ fill: 'var(--gray-200)' }}
        />
        {data.length === 0 ? (
          <text
            x={svgWidth / 2}
            y={svgHeight / 2}
            textAnchor='middle'
            fontSize='2rem'
            fontWeight='bold'
            style={{ fill: 'var(--gray-600)' }}
          >
            No data available
          </text>
        ) : (
          <g transform={`translate(${margin.left},${margin.top})`}>
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={0}
              x2={graphWidth}
              stroke='#AAA'
              strokeWidth={1}
            />
            <g>
              {y1Ticks.map((d, i) => (
                <g key={i}>
                  <line
                    y1={y1(d)}
                    y2={y1(d)}
                    x1={-15}
                    x2={-20}
                    stroke={UNDPColorModule.graphMainColor}
                    strokeWidth={1}
                  />
                  <text
                    x={-25}
                    y={y1(d)}
                    fill={UNDPColorModule.graphMainColor}
                    textAnchor='end'
                    fontSize={12}
                    dy={3}
                  >
                    {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                  </text>
                </g>
              ))}
              <line
                y1={0}
                y2={graphHeight}
                x1={-15}
                x2={-15}
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={1}
              />
            </g>
            <g>
              {minYearFiltered === maxYearFiltered ? (
                <text
                  y={graphHeight}
                  x={x(minYearFiltered as Date)}
                  fill='#AAA'
                  textAnchor='middle'
                  fontSize={12}
                  dy={15}
                >
                  {minYearFiltered.getMonth() + 1 < 10
                    ? `0${minYearFiltered.getMonth() + 1}`
                    : minYearFiltered.getMonth() + 1}
                  -{minYearFiltered.getFullYear()}
                </text>
              ) : (
                <g>
                  <text
                    y={graphHeight}
                    x={x(minYearFiltered as Date)}
                    fill='#AAA'
                    textAnchor='start'
                    fontSize={12}
                    dy={15}
                  >
                    {minYearFiltered.getMonth() + 1 < 10
                      ? `0${minYearFiltered.getMonth() + 1}`
                      : minYearFiltered.getMonth() + 1}
                    -{minYearFiltered.getFullYear()}
                  </text>
                  <text
                    y={graphHeight}
                    x={x(maxYearFiltered as Date)}
                    fill='#AAA'
                    textAnchor='end'
                    fontSize={12}
                    dy={15}
                  >
                    {maxYearFiltered.getMonth() + 1 < 10
                      ? `0${maxYearFiltered.getMonth() + 1}`
                      : maxYearFiltered.getMonth() + 1}
                    -{maxYearFiltered.getFullYear()}
                  </text>
                </g>
              )}
            </g>
            <g>
              <path
                d={lineShape(data as any) as string}
                fill='none'
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={1}
              />
              <path
                d={lineShape(dataParam1 as any) as string}
                fill='none'
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={1}
                strokeDasharray='4 8'
              />
              {hoverData ? (
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={hoverData.year ? x(hoverData.year) : 0}
                  x2={hoverData.year ? x(hoverData.year) : 0}
                  stroke='#212121'
                  strokeDasharray='4 8'
                  strokeWidth={1}
                />
              ) : null}
            </g>
            <g>
              {data.map((d, i) => (
                <g key={i}>
                  {d.value !== undefined ? (
                    <circle
                      cx={x(d.date)}
                      cy={y1(d.value)}
                      r={1.5}
                      fill={UNDPColorModule.graphMainColor}
                    />
                  ) : null}
                  <rect
                    x={x(d.date) - 3}
                    y={0}
                    width={6}
                    height={graphHeight}
                    fill='#fff'
                    opacity={0}
                    onMouseEnter={event => {
                      setHoverData({
                        year: d.date,
                        prefix: indicator.LabelPrefix,
                        suffix: indicator.LabelSuffix,
                        value: d.value !== undefined ? d.value : 'NA',
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={event => {
                      setHoverData({
                        year: d.date,
                        prefix: indicator.LabelPrefix,
                        suffix: indicator.LabelSuffix,
                        value: d.value !== undefined ? d.value : 'NA',
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                  />
                </g>
              ))}
            </g>
          </g>
        )}
      </svg>
      {hoverData ? (
        <TooltipEl
          x={hoverData.xPosition}
          y={hoverData.yPosition}
          verticalAlignment={
            hoverData.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'
          }
          horizontalAlignment={
            hoverData.xPosition > window.innerWidth / 2 ? 'left' : 'right'
          }
        >
          <p
            className='undp-typography bold margin-bottom-00'
            style={{ fontSize: '0.875rem' }}
          >
            {countryName}
          </p>
          <div className='margin-top-01'>
            <div style={{ gap: '0.25rem', alignItems: 'baseline' }}>
              <p className='undp-typography margin-bottom-00 bold'>
                {hoverData.prefix && hoverData.value && hoverData.value !== 'NA'
                  ? `${hoverData.prefix} `
                  : ''}
                {typeof hoverData.value === 'number'
                  ? hoverData.value < 1000000
                    ? format(',')(
                        parseFloat(hoverData.value.toFixed(2)),
                      ).replace(',', ' ')
                    : format('.3s')(hoverData.value).replace('G', 'B')
                  : hoverData.value}
                {hoverData.suffix && hoverData.value && hoverData.value !== 'NA'
                  ? ` ${hoverData.suffix}`
                  : ''}
              </p>
              <div style={{ fontSize: '0.875rem' }}>
                (
                {hoverData.year.getMonth() + 1 < 10
                  ? `0${hoverData.year.getMonth() + 1}`
                  : hoverData.year.getMonth() + 1}
                -{hoverData.year.getFullYear()})
              </div>
            </div>
          </div>
        </TooltipEl>
      ) : null}
    </>
  );
}
