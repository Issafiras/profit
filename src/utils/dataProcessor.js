export function parseDanishNumber(input) {
  if (!input || typeof input !== 'string') return 0;

  const cleaned = input
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateMetrics(row) {
  const salesPrice = parseDanishNumber(row['Udpris'] || row['udpris'] || '0');
  const costPrice = parseDanishNumber(row['GnSKost'] || row['GnsKost'] || row['gnskost'] || '0');
  const inventory = parseInt(row['Disp.beh'] || row['disp.beh'] || '0') || 0;

  if (salesPrice === 99999 || salesPrice === 9999) {
    return null;
  }

  const realRevenue = salesPrice / 1.25;
  const realProfit = realRevenue - costPrice;

  return {
    productCode: row['Varenr'] || row['Varenummer'] || row['Artikelnummer'] || row['EAN'] || row['Produktnr'] || row['SKU'] || '',
    productName: row['Varenavn'] || row['Varetekst.'] || row['Varetekst'] || 'Ukendt',
    inventory,
    salesPrice,
    costPrice,
    realRevenue,
    realProfit
  };
}

export function findCashCows(data) {
  return data
    .filter(item => item && !isNaN(item.realProfit))
    .sort((a, b) => b.realProfit - a.realProfit)
    .slice(0, 10);
}

export function findLagerGuld(data) {
  return data
    .filter(item =>
      item &&
      item.inventory > 10 &&
      item.realProfit > 50 &&
      !isNaN(item.realProfit)
    )
    .sort((a, b) => b.inventory - a.inventory);
}

export function findTabsListe(data) {
  return data
    .filter(item =>
      item &&
      item.realProfit < 0 &&
      !isNaN(item.realProfit)
    )
    .sort((a, b) => a.realProfit - b.realProfit);
}

export function formatCurrency(value) {
  if (isNaN(value)) return '0,00 kr';
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatNumber(value) {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('da-DK').format(value);
}
