export const exportToExcel = (data, filename) => {
  if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
    filename += '.xls';
  }

  const parseDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

    const str = String(value).trim();
    if (!str) return null;

    const dmyMatch = str.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const date = new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
      return isNaN(date.getTime()) ? null : date;
    }

    const ymdMatch = str.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
    if (ymdMatch) {
      const date = new Date(Number(ymdMatch[1]), Number(ymdMatch[2]) - 1, Number(ymdMatch[3]));
      return isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const toExcelSerial = (date) => {
    const excelEpoch = new Date(1899, 11, 31);
    const msPerDay = 24 * 60 * 60 * 1000;
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let serial = Math.round((local - excelEpoch) / msPerDay);
    if (serial >= 60) serial += 1;
    return serial;
  };

  const { headerBgColor = '#C9A84C', headerTextColor = '#FFFFFF' } = {};

  const dateCellStyle = ' style="mso-number-format:\'DD\\-MM\\-YYYY\'; text-align: left;"';
  const textCellStyle = ' style="mso-number-format:\\@; text-align: left;"';
  const numberCellStyle = ' style="mso-number-format:0; text-align: right;"';

  let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
  tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
  tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
  tableHTML += '<head><meta charset="UTF-8">';
  tableHTML += '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>';
  tableHTML += '<x:ExcelWorksheet><x:Name>Sheet1</x:Name>';
  tableHTML += '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>';
  tableHTML += '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
  tableHTML += '</head><body><table border="1">';

  const headers = data[0] || [];
  tableHTML += '<thead><tr>';
  headers.forEach((cell) => {
    const cellContent = cell !== null && cell !== undefined ? String(cell).trim() : '';
    tableHTML += `<th bgcolor="${headerBgColor}" style="color:${headerTextColor};font-weight:bold;text-align:center;">${cellContent}</th>`;
  });
  tableHTML += '</tr></thead>';

  const DATE_KEYWORDS = ['date', 'disbursed', 'closed', 'dob', 'birth', 'renewal', 'maturity', 'expiry'];

  const isDateColumn = headers.map((h) => {
    const label = String(h || '').toLowerCase();
    return DATE_KEYWORDS.some((kw) => new RegExp(`(?<![a-z])${kw}(?![a-z])`).test(label));
  });

  tableHTML += '<tbody>';
  data.slice(1).forEach((row) => {
    tableHTML += '<tr>';
    row.forEach((cell, colIdx) => {
      const rawStr = cell !== null && cell !== undefined ? String(cell).trim() : '';

      if (isDateColumn[colIdx]) {
        if (!rawStr) {
          tableHTML += `<td${textCellStyle}></td>`;
          return;
        }
        const dateObj = parseDate(rawStr);
        if (dateObj) {
          const serial = toExcelSerial(dateObj);
          tableHTML += `<td${dateCellStyle}>${serial}</td>`;
        } else {
          const safe = rawStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          tableHTML += `<td${textCellStyle}>${safe}</td>`;
        }
        return;
      }

      const cellContent = rawStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const hasLeadingZero = typeof cell === 'string' && /^0\d+/.test(cell.trim());
      const isNumber = cell !== null && cell !== undefined && cell !== '' && !isNaN(Number(cell));
      const style = hasLeadingZero || !isNumber ? textCellStyle : numberCellStyle;

      tableHTML += `<td${style}>${cellContent}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table></body></html>';

  const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};