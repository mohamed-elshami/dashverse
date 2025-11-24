import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { WeatherForecastResponse } from '../types';
import { useAppStore } from '@/stores/appStore';

// Handle CommonJS default export
const Chart = (ReactApexChart as { default?: typeof ReactApexChart }).default || ReactApexChart;


interface WeatherChartProps {
  weather: WeatherForecastResponse;
}

const WeatherChart = ({ weather }: WeatherChartProps) => {
  const { theme } = useAppStore();

  const chartOptions: ApexOptions = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#ffffff' : '#111827';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return {
      chart: {
        toolbar: {
          show: false,
        },
        background: 'transparent',
      },
      theme: {
        mode: theme,
      },
      colors: ['#3b82f6', '#ef4444'],
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
      xaxis: {
        categories: weather.daily.time.map((date) =>
          new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        ),
        labels: {
          style: {
            colors: textColor,
          },
        },
      },
      yaxis: [
        {
          title: {
            text: 'Temperature (°C)',
            style: {
              color: textColor,
            },
          },
          labels: {
            style: {
              colors: textColor,
            },
          },
        },
      ],
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      legend: {
        labels: {
          colors: textColor,
        },
      },
      tooltip: {
        theme: theme,
      },
    };
  }, [weather.daily.time, theme]);

  const chartSeries = useMemo(() => [
    {
      name: 'Max Temperature',
      data: weather.daily.temperature_2m_max,
    },
    {
      name: 'Min Temperature',
      data: weather.daily.temperature_2m_min,
    },
  ], [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7-Day Temperature Forecast</h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default WeatherChart;

