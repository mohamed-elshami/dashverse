import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { WeatherForecastResponse } from '../types';
import { useAppStore } from '@/stores/appStore';

// Handle CommonJS default export
const Chart = (ReactApexChart as { default?: typeof ReactApexChart }).default || ReactApexChart;

interface WindSpeedChartProps {
  weather: WeatherForecastResponse;
}

const WindSpeedChart = ({ weather }: WindSpeedChartProps) => {
  const { theme } = useAppStore();

  const chartOptions: ApexOptions = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#000000' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return {
      chart: {
        type: 'area',
        toolbar: {
          show: false,
        },
        background: 'transparent',
        foreColor: textColor,
      },
      theme: {
        mode: theme,
      },
      colors: ['#10b981'],
      dataLabels: {
        enabled: true,
        style: {
          colors: [textColor],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
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
          text: 'Wind Speed (km/h)',
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
      name: 'Max Wind Speed',
      data: weather.daily.windspeed_10m_max,
    },
  ], [weather.daily.windspeed_10m_max]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7-Day Wind Speed Forecast</h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={350}
      />
    </div>
  );
};

export default WindSpeedChart;

