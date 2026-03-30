import React, { createContext, useContext, useState } from 'react';
import { mockWealth } from '../data/mock';

const WealthContext = createContext();

const initialWealth = {
  hiveCoins: mockWealth.hiveCoins,
  mindCredits: mockWealth.mindCredits,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWealth = () => {
  const context = useContext(WealthContext);
  if (!context) {
    throw new Error('useWealth must be used within a WealthProvider');
  }
  return context;
};

export const WealthProvider = ({ children }) => {
  const [wealth, setWealth] = useState(initialWealth);

  const exchangeRate = mockWealth.exchangeRate;

  const exchangeHCToMC = (amount) => {
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return {
        success: false,
        message: 'ENTER A VALID HIVE COIN AMOUNT TO EXCHANGE.',
      };
    }

    if (normalizedAmount > wealth.hiveCoins) {
      return {
        success: false,
        message: 'INSUFFICIENT HIVE COINS FOR THIS EXCHANGE.',
      };
    }

    const received = normalizedAmount / exchangeRate;

    setWealth((prev) => ({
      hiveCoins: Number((prev.hiveCoins - normalizedAmount).toFixed(2)),
      mindCredits: Number((prev.mindCredits + received).toFixed(2)),
    }));

    return {
      success: true,
      message: `EXCHANGE COMPLETE: ${normalizedAmount.toLocaleString()} HC → ${received.toLocaleString(undefined, { maximumFractionDigits: 2 })} MC`,
    };
  };

  const spendHiveCoins = (amount) => {
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return {
        success: false,
        missing: 0,
        message: 'INVALID CHECKOUT AMOUNT.',
      };
    }

    if (normalizedAmount > wealth.hiveCoins) {
      const missing = Number((normalizedAmount - wealth.hiveCoins).toFixed(2));
      return {
        success: false,
        missing,
        message: `TRANSACTION FAILED: YOU NEED ${missing.toLocaleString(undefined, { maximumFractionDigits: 2 })} MORE HIVECOINS.`,
      };
    }

    setWealth((prev) => ({
      ...prev,
      hiveCoins: Number((prev.hiveCoins - normalizedAmount).toFixed(2)),
    }));

    return {
      success: true,
      missing: 0,
      message: `TRANSACTION SUCCESSFUL: ${normalizedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} HIVECOINS DEDUCTED.`,
    };
  };

  return (
    <WealthContext.Provider
      value={{
        wealth,
        exchangeRate,
        exchangeHCToMC,
        spendHiveCoins,
      }}
    >
      {children}
    </WealthContext.Provider>
  );
};
