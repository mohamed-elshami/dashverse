import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { WeatherForecastResponse } from '../types';
import { useAppStore } from '@/stores/appStore';

// Handle CommonJS default export
const Chart = (ReactApexChart as { default?: typeof ReactApexChart }).default || ReactApexChart;

interface PrecipitationChartProps {
  weather: WeatherForecastResponse;
}

const PrecipitationChart = ({ weather }: PrecipitationChartProps) => {
  const { theme } = useAppStore();

  const chartOptions: ApexOptions = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#000000' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        background: 'transparent',
        foreColor: textColor,
      },
      theme: {
        mode: theme,
      },
      colors: ['#3b82f6'],
      dataLabels: {
        enabled: true,
        style: {
          colors: isDark ? ['#ffffff'] : ['#111827'],
        },
      },
      xaxis: {
        categories: weather.daily.time.map((date) =>
          new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        ),
        labels: {
          style: {
            colors: isDark ? '#ffffff' : '#111827',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Precipitation (mm)',
          style: {
            color: isDark ? '#ffffff' : '#111827',
          },
        },
        labels: {
          style: {
            colors: isDark ? '#ffffff' : '#111827',
          },
        },
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      tooltip: {
        theme: theme,
      },
    };
  }, [weather.daily.time, theme]);

  const chartSeries = useMemo(() => [
    {
      name: 'Precipitation',
      data: weather.daily.precipitation_sum,
    },
  ], [weather.daily.precipitation_sum]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7-Day Precipitation Forecast</h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default PrecipitationChart;

