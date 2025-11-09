/**
 * Format date string to "01 Jan 13:20" format in IST (UTC+5:30)
 * @param {string} dateString - ISO date string (UTC)
 * @returns {string} Formatted date string in IST
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    // Parse the UTC date string explicitly
    // If it doesn't end with 'Z' or have a timezone, treat it as UTC
    let utcDateString = dateString;
    if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      // No timezone indicator, treat as UTC
      utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    }
    
    // Create Date object from UTC string
    const utcDate = new Date(utcDateString);
    
    // Verify it's a valid date
    if (isNaN(utcDate.getTime())) {
      return 'Invalid Date';
    }
    
    // Use Intl.DateTimeFormat to convert UTC to IST (UTC+5:30)
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(utcDate);
    const day = parts.find(part => part.type === 'day')?.value || '01';
    const month = parts.find(part => part.type === 'month')?.value || 'Jan';
    const hours = parts.find(part => part.type === 'hour')?.value || '00';
    const minutes = parts.find(part => part.type === 'minute')?.value || '00';
    
    return `${day} ${month} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Date formatting error:', error, dateString);
    return 'Invalid Date';
  }
}

