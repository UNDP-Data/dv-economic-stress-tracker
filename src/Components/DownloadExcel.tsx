import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  indicatorTitle: string;
}

function ExportExcel(props: Props) {
  const { data, indicatorTitle } = props;
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const Heading = [
    {
      country: 'Country',
      countryCode: 'ISO-3 Code',
      value: indicatorTitle,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exportToExcel = (csvData: any) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      header: ['country', 'countryCode', 'value'],
      skipHeader: true,
    });

    const wscols = [{ wch: 20 }, { wch: 5 }, { wch: 15 }];

    ws['!cols'] = wscols;
    XLSX.utils.sheet_add_json(ws, csvData, {
      header: ['country', 'countryCode', 'value'],
      skipHeader: true,
      origin: -1, // ok
    });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataForExcel = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(
      dataForExcel,
      `${indicatorTitle.replaceAll(',', '').replaceAll('.', ' ')}.xlsx`,
    );
  };

  return (
    <button
      type='button'
      className='undp-button button-tertiary button-arrow'
      onClick={() => exportToExcel(data)}
    >
      Download Data as XLSX
    </button>
  );
}

export default ExportExcel;
