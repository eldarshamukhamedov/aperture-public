import React, { createContext, useEffect } from 'react';

// Types
export type UseAnalytics = (
  // Shared analytics data
  eventData: Object,
  // Configuration object
  options: {
    // Dispatch event handler
    dispatch: (data: Object) => void;
    // Whether to dispatch an event on component mount
    dispatchOnMount: true;
  },
) => {
  // Localized analytics provider
  Provider: React.Provider<Object>;
  // trackEvent function
  trackEvent: (data: Object) => void;
};

const AnalyticsContext = createContext<Object>({});

export const useAnalytics: UseAnalytics = (
  eventData,
  { dispatch, dispatchOnMount },
) => {
  useEffect(() => {
    if (dispatchOnMount) dispatch(eventData);
  }, [dispatch, dispatchOnMount, eventData]);
  return {
    Provider: AnalyticsContext.Provider,
    trackEvent: (data) => {
      dispatch({ ...eventData, ...data });
    },
  };
};
