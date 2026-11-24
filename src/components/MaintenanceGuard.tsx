'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MaintenanceScreen } from './MaintenanceScreen';

/**
 * Global Maintenance Mode Switch
 * - true: Public visitor routes (/, /checkout, /checkout/qris) display the MaintenanceScreen.
 *         The Cashier Portal (/admin) remains fully functional for the 12B stand team.
 * - false: Website is 100% live for all public visitors.
 */
export const IS_MAINTENANCE_MODE = false;

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const pathname = usePathname();

  // Admin & POS Cashier portal (/admin) remains accessible so team can manage orders
  if (pathname && pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Show maintenance screen for public visitors
  if (IS_MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
};
