import { useContext } from 'react';
import { CtxDataType, DataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';
import { HorizontalBarChart } from './HorizontalBarChart';
import { BarChart } from './BarChart';
import { DataList } from './DataList';
import { MultiLineChart } from './MultiLineChart';
import { AllCountryLineChart } from './AllCountryLineChart';
import { TableView } from './TableView';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  countries: string[];
}

export function Graph(props: Props) {
  const { data, indicators, countries } = props;
  const { graphType, verticalBarLayout } = useContext(Context) as CtxDataType;
  return (
    <div
      id='graph-node'
      className={`undp-scrollbar graph-el${
        graphType !== 'barGraph' &&
        graphType !== 'dataList' &&
        graphType !== 'tableView'
          ? ' no-overflow'
          : ''
      }`}
    >
      {graphType === 'barGraph' ? (
        verticalBarLayout ? (
          <HorizontalBarChart data={data} indicators={indicators} />
        ) : (
          <BarChart data={data} indicators={indicators} />
        )
      ) : graphType === 'multiCountryTrendLine' ? (
        <MultiLineChart
          data={data}
          indicators={indicators}
          countries={countries}
        />
      ) : graphType === 'trendLines' ? (
        <AllCountryLineChart data={data} indicators={indicators} />
      ) : graphType === 'tableView' ? (
        <TableView data={data} indicators={indicators} />
      ) : (
        <DataList data={data} indicators={indicators} countries={countries} />
      )}
    </div>
  );
}
