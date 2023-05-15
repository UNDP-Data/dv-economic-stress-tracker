import { useContext } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { CtxDataType, DataType, IndicatorMetaDataType } from '../Types';
import { BarGraphIcon, Logo, DualAxesChartIcon } from '../Icons';
import Context from '../Context/Context';
import { Settings } from './Settings';
import { Graph } from './Graph';
import { DataSources } from './DataSources';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  regions: string[];
  countries: string[];
}

const IconEl = styled.div`
  display: inline;
  @media (max-width: 980px) {
    display: none;
  }
`;

export function GrapherComponent(props: Props) {
  const { data, indicators, regions, countries } = props;
  const { graphType, showSource, updateGraphType, updateShowSource } =
    useContext(Context) as CtxDataType;
  const queryParams = new URLSearchParams(window.location.search);
  return (
    <div className='margin-top-06 margin-bottom-06'>
      <div className='flex-div flex-space-between flex-vert-align-center margin-bottom-05 flex-wrap'>
        <div className='flex-div flex-vert-align-center'>
          <Logo height={75} />
          <div>
            <h3
              className='undp-typography margin-bottom-00'
              style={{ color: 'var(--blue-600)' }}
            >
              Economic Stress Tracker
            </h3>
            <h6 className='undp-typography margin-bottom-00'>
              Exploring economic data
            </h6>
          </div>
        </div>
      </div>
      <div className='dashboard-container'>
        {queryParams.get('showSettings') === 'false' ? null : (
          <div className='tabs-for-graphing-interface-container'>
            <button
              type='button'
              className={`tabs-for-graphing-interface${
                graphType === 'tableView' ? ' selected' : ''
              }`}
              onClick={() => {
                updateGraphType('tableView');
              }}
            >
              <IconEl>
                <DualAxesChartIcon
                  size={48}
                  fill={
                    graphType === 'tableView'
                      ? 'var(--blue-600)'
                      : 'var(--gray-500)'
                  }
                />
              </IconEl>
              Table View
            </button>
            <button
              type='button'
              className={`tabs-for-graphing-interface${
                graphType === 'trendLines' ? ' selected' : ''
              }`}
              onClick={() => {
                updateGraphType('trendLines');
              }}
            >
              <IconEl>
                <DualAxesChartIcon
                  size={48}
                  fill={
                    graphType === 'trendLines'
                      ? 'var(--blue-600)'
                      : 'var(--gray-500)'
                  }
                />
              </IconEl>
              Line Charts
            </button>
            <button
              type='button'
              className={`tabs-for-graphing-interface${
                graphType === 'multiCountryTrendLine' ? ' selected' : ''
              }`}
              onClick={() => {
                updateGraphType('multiCountryTrendLine');
              }}
            >
              <IconEl>
                <DualAxesChartIcon
                  size={48}
                  fill={
                    graphType === 'multiCountryTrendLine'
                      ? 'var(--blue-600)'
                      : 'var(--gray-500)'
                  }
                />
              </IconEl>
              Multi-Country Line Chart
            </button>
            <button
              type='button'
              className={`tabs-for-graphing-interface${
                graphType === 'barGraph' ? ' selected' : ''
              }`}
              onClick={() => {
                updateGraphType('barGraph');
              }}
            >
              <IconEl>
                <BarGraphIcon
                  size={48}
                  fill={
                    graphType === 'barGraph'
                      ? 'var(--blue-600)'
                      : 'var(--gray-500)'
                  }
                />
              </IconEl>
              Ranks
            </button>
            <button
              type='button'
              className={`tabs-for-graphing-interface${
                graphType === 'dataList' ? ' selected' : ''
              }`}
              onClick={() => {
                updateGraphType('dataList');
              }}
            >
              <IconEl>
                <DualAxesChartIcon
                  size={48}
                  fill={
                    graphType === 'dataList'
                      ? 'var(--blue-600)'
                      : 'var(--gray-500)'
                  }
                />
              </IconEl>
              Data List
            </button>
          </div>
        )}
        <div className='graph-container'>
          {queryParams.get('showSettings') === 'false' ? null : (
            <Settings
              indicators={indicators}
              regions={regions}
              countries={countries}
            />
          )}
          <Graph data={data} indicators={indicators} countries={countries} />
        </div>
      </div>
      <Modal
        open={showSource}
        className='undp-modal'
        title='Data Sources'
        onOk={() => {
          updateShowSource(false);
        }}
        onCancel={() => {
          updateShowSource(false);
        }}
        width='75%'
      >
        <DataSources indicators={indicators} data={data} />
      </Modal>
    </div>
  );
}
