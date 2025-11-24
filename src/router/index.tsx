import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LazyWrapper from './components/LazyWrapper';

// Lazy load all components
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome'));
const WeatherPage = lazy(() => import('@/features/weather/WeatherPage'));
const WeatherHome = lazy(() => import('@/features/weather/components/WeatherHome'));
const WeatherResults = lazy(() => import('@/features/weather/components/WeatherResults'));
const NewsPage = lazy(() => import('@/features/news/NewsPage'));
const TicTacToePage = lazy(() => import('@/features/games/tictactoe/TicTacToePage'));
const SnakeGamePage = lazy(() => import('@/features/games/snake/SnakeGamePage'));
const FoodPage = lazy(() => import('@/features/food/FoodPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyWrapper>
        <DashboardLayout />
      </LazyWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <DashboardHome />
          </LazyWrapper>
        ),
      },
      {
        path: 'weather',
        element: (
          <LazyWrapper>
            <WeatherPage />
          </LazyWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyWrapper>
                <WeatherHome />
              </LazyWrapper>
            ),
          },
          {
            path: 'results',
            element: (
              <LazyWrapper>
                <WeatherResults />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: 'news',
        element: (
          <LazyWrapper>
            <NewsPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'games/tictactoe',
        element: (
          <LazyWrapper>
            <TicTacToePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'games/snake',
        element: (
          <LazyWrapper>
            <SnakeGamePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'food',
        element: (
          <LazyWrapper>
            <FoodPage />
          </LazyWrapper>
        ),
      },
    ],
  },
]);
