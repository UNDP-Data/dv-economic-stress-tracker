import { useContext } from 'react';

import { CtxDataType, DataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';
import { DataSourceListItem } from '../Components/DataSourceListItem';

interface Props {
  indicators: IndicatorMetaDataType[];
  data: DataType[];
}

export function DataSources(props: Props) {
  const { indicators, data } = props;
  const { xAxisIndicator } = useContext(Context) as CtxDataType;

  const xIndicatorMetaData =
    indicators[indicators.findIndex(d => d.Indicator === xAxisIndicator)];

  return (
    <div className='undp-scrollbar'>
      <DataSourceListItem indicatorData={xIndicatorMetaData} data={data} />
    </div>
  );
}
