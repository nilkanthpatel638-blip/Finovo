/**
 * Formats a number to the Indian Rupee currency standard.
 * Example: 125000 -> ₹1,25,000; 12500000 -> ₹1,25,00,000
 * @param {number|string} amount 
 * @param {string} symbol - currency symbol, default is '₹'
 * @returns {string}
 */
export const formatIndianRupees = (amount, symbol = '₹') => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${symbol}0`;
  }
  
  const numericVal = Number(amount);
  const isNegative = numericVal < 0;
  const absVal = Math.abs(numericVal).toFixed(2);
  const parts = absVal.split('.');
  
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Format the integer part using the Indian system: comma after 3 digits, then every 2 digits
  let lastThreeDigits = integerPart.substring(integerPart.length - 3);
  const otherDigits = integerPart.substring(0, integerPart.length - 3);
  
  if (otherDigits !== '') {
    lastThreeDigits = ',' + lastThreeDigits;
  }
  
  // Regex to insert commas every 2 digits in the remaining number
  const formattedOtherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const formattedInteger = formattedOtherDigits + lastThreeDigits;
  
  // Return formatted string. Omit decimals if .00 to match premium clean aesthetics, or optionally keep.
  // Let's keep decimals if they are non-zero, or just display integer for clean UI and decimals on hover
  const decimalStr = decimalPart === '00' ? '' : `.${decimalPart}`;
  
  return `${isNegative ? '-' : ''}${symbol}${formattedInteger}${decimalStr}`;
};

/**
 * Downloads data as a CSV file.
 * @param {Array} headers - Column titles
 * @param {Array} rows - Column data rows
 * @param {string} filename - Output name
 */
export const exportToCSV = (headers, rows, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(",")].concat(rows.map(e => e.map(val => {
      // Escape quotes and commas
      let cleanVal = String(val).replace(/"/g, '""');
      if (cleanVal.includes(',') || cleanVal.includes('\n') || cleanVal.includes('"')) {
        cleanVal = `"${cleanVal}"`;
      }
      return cleanVal;
    }).join(","))).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Downloads data as a JSON file.
 */
export const exportToJSON = (data, filename) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
