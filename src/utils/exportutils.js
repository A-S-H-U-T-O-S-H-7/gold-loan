export const exportToExcel = (data, filename) => {
  if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
    filename += '.xls';
  }
  
  let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
  tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
  tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
  tableHTML += '<head>';
  tableHTML += '<meta charset="UTF-8">';
  tableHTML += '<!--[if gte mso 9]>';
  tableHTML += '<xml>';
  tableHTML += '<x:ExcelWorkbook>';
  tableHTML += '<x:ExcelWorksheets>';
  tableHTML += '<x:ExcelWorksheet>';
  tableHTML += '<x:Name>Sheet1</x:Name>';
  tableHTML += '<x:WorksheetOptions>';
  tableHTML += '<x:DisplayGridlines/>';
  tableHTML += '</x:WorksheetOptions>';
  tableHTML += '</x:ExcelWorksheet>';
  tableHTML += '</x:ExcelWorksheets>';
  tableHTML += '</x:ExcelWorkbook>';
  tableHTML += '</xml>';
  tableHTML += '<![endif]-->';
  tableHTML += '</head>';
  tableHTML += '<body>';
  tableHTML += '<table border="1">';
  
  // Header row
  tableHTML += '<thead><tr>';
  data[0].forEach(cell => {
    const cellContent = cell !== null && cell !== undefined 
      ? String(cell).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') 
      : '';
    tableHTML += `<th bgcolor="#4472C4" style="color: white; font-weight: bold; text-align: center;">${cellContent}</th>`;
  });
  tableHTML += '</tr></thead>';
  
  // Data rows
  tableHTML += '<tbody>';
  const headers = data[0] || [];

  data.slice(1).forEach(row => {
    tableHTML += '<tr>';
    row.forEach((cell, columnIndex) => {
      const cellContent = cell !== null && cell !== undefined 
        ? String(cell).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') 
        : '';

      const isNumber = !isNaN(cell) && cell !== null && cell !== undefined && cell !== '';

      // Preserve leading zeros: any string starting with 0 followed by digits
      const hasLeadingZero = typeof cell === 'string' && /^0\d+/.test(cell);
      const headerLabel = String(headers[columnIndex] || '').toLowerCase();
      const isDateColumn =
        headerLabel.includes('date') ||
        headerLabel.includes('dob') ||
        headerLabel.includes('birth');
      const isEightDigitDateValue = typeof cell === 'string' && /^\d{8}$/.test(cell);

      let style = '';
      if (isDateColumn && isEightDigitDateValue) {
        style = ' style="mso-number-format:00000000"';
      } else if (hasLeadingZero) {
        // mso-number-format '@' = Excel Text format, preserves leading zeros exactly
        style = ` style="mso-number-format:'@'"`;
      } else if (isNumber) {
        style = ' style="mso-number-format:0"';
      }

      tableHTML += `<td${style}>${cellContent}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody>';
  
  tableHTML += '</table>';
  tableHTML += '</body>';
  tableHTML += '</html>';
  
  const blob = new Blob([tableHTML], { 
    type: 'application/vnd.ms-excel' 
  });
  
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
