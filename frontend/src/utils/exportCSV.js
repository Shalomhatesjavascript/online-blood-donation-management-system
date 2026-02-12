/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without .csv extension)
 * @param {Array} headers - Optional custom headers {key: 'field_name', label: 'Display Name'}
 */
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // If no headers provided, use keys from first object
  const csvHeaders = headers || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Create CSV header row
  const headerRow = csvHeaders.map(h => h.label).join(',');

  // Create CSV data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      let value = row[header.key];
      
      // Handle nested objects (e.g., row.User.email)
      if (header.key.includes('.')) {
        const keys = header.key.split('.');
        value = keys.reduce((obj, key) => obj?.[key], row);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Handle dates
      if (value instanceof Date) {
        value = value.toISOString().split('T')[0];
      }
      
      // Escape commas and quotes
      value = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
  });

  // Combine header and data
  const csv = [headerRow, ...dataRows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};

