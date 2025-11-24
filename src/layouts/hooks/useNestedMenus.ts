import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { NavItem } from '@/layouts/types';

export const useNestedMenus = (items: NavItem[]) => {
  const { pathname } = useLocation();
  const [openNestedMenus, setOpenNestedMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    items.forEach((item) => {
      if (item.nested) {
        const hasActiveChild = item.nested.some(
          (nestedItem) => pathname === nestedItem.path
        );
        if (hasActiveChild) {
          setOpenNestedMenus((prev) => ({ ...prev, [item.path]: true }));
        }
      }
    });
  }, [pathname, items]);

  const toggleNestedMenu = (path: string) => {
    setOpenNestedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return {
    openNestedMenus,
    toggleNestedMenu,
  };
};

