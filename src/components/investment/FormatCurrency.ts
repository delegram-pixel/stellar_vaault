export const formatCurrency = (
    value: number, 
    currency: string = 'USD', 
    locale: string = 'en-US'
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      console.warn('Currency formatting error:', error);
      // Fallback formatting if Intl.NumberFormat fails
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Optional: Overload for more specific formatting options
  export const formatCompactCurrency = (
    value: number, 
    currency: string = 'USD', 
    locale: string = 'en-US'
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(value);
    } catch (error) {
      console.warn('Compact currency formatting error:', error);
      return formatCurrency(value, currency, locale);
    }
  };