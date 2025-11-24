import { Suspense, type ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyWrapperProps {
  children: ReactNode;
}

const LazyWrapper = ({ children }: LazyWrapperProps) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default LazyWrapper;

