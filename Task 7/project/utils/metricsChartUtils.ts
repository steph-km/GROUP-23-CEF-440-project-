import moment from 'moment';

type Entry = {
  timestamp: number;
  signalStrength?: number;
  downloadSpeed?: number;
  uploadSpeed?: number;
  latency?: number;
  locationName?: string;
};

export function generateChartData(
  entries: Entry[],
  chartType: 'signal' | 'speed' | 'latency' | 'reliability',
  period: 'day' | 'week' | 'month' | 'year'
) {
  const metricKeyMap: Record<typeof chartType, string> = {
    signal: 'signalStrength',
    speed: 'downloadSpeed',
    latency: 'latency',
    reliability: 'uploadSpeed', // placeholder, adjust if needed
  };

  const key = metricKeyMap[chartType];

  // Grouping logic depending on period
  const grouped: Record<string, number[]> = {};

  entries.forEach((entry) => {
    const date = moment(entry.timestamp);
    let label: string;

    switch (period) {
      case 'day':
        label = date.format('HH:mm'); // hourly
        break;
      case 'week':
        label = date.format('ddd'); // Mon, Tue...
        break;
      case 'month':
        label = date.format('D'); // 1, 2, ...
        break;
      case 'year':
        label = date.format('MMM'); // Jan, Feb, ...
        break;
      default:
        label = date.format();
    }

    if (!grouped[label]) grouped[label] = [];
    const value = (entry as any)[key];
    if (typeof value === 'number') grouped[label].push(value);
  });

  const labels = Object.keys(grouped);
  const data = labels.map(label => {
    const values = grouped[label];
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return parseFloat(average.toFixed(2));
  });

  return {
    labels,
    datasets: [{ data }],
  };
}
export function getChartTitle(chartType: 'signal' | 'speed' | 'latency' | 'reliability') {
  const titles: Record<typeof chartType, string> = {
    signal: 'Signal Strength',
    speed: 'Download Speed',
    latency: 'Latency',
    reliability: 'Upload Speed', // placeholder, adjust if needed
  };
  return titles[chartType];
}