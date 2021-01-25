import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { isEqual, merge } from 'lodash-es';

// Types
export type UseAnalytics = (
  // Shared analytics data
  eventData?: Object,
  // Configuration object
  options?: {
    // Dispatch event handler
    dispatch?: (data: Object) => void;
    // Whether to dispatch an event on component mount
    dispatchOnMount?: boolean;
  },
) => {
  // Localized analytics provider
  Provider: ({ children }: { children: React.ReactNode }) => React.ReactElement;
  // trackEvent function
  trackEvent: (data: Object) => void;
};
interface AnalyticsContextValue {
  dispatch: (data: Object) => void;
  eventData: Object;
}

// Constants
const defaultDispatch = () => {};
const defaultContext = { dispatch: defaultDispatch, eventData: {} };
const AnalyticsContext = createContext<AnalyticsContextValue>(defaultContext);

// Exports
export const useAnalytics: UseAnalytics = (
  localEventData = {},
  options = {},
) => {
  const context = useContext(AnalyticsContext);

  // Dispatch select order:
  // 1. local override -> options.dispatch
  // 2. context -> context.dispatch || defaultContext
  const dispatch = options.dispatch || context.dispatch;

  // `eventData` merge order (later values override earlier values):
  // 1. context -> context.eventData || {}
  // 2. local data -> eventData || {}
  const mergedEventState = merge({}, context.eventData, localEventData);

  // We want to avoid mutating the context to prevent unnecessary renders. Since
  // `eventData` is cloned on every render, we need to do a deep equality check
  // and only swap out the reference to `eventData` when its contents change.
  const [eventData, setEventData] = useState(mergedEventState);
  if (!isEqual(eventData, mergedEventState)) setEventData(mergedEventState);

  // Handle dispatchOnMount exactly once per component lifecycle
  const [hasBeenMounted, setHasBeenMounted] = useState(false);
  const dispatchOnMount = options.dispatchOnMount === true;
  useEffect(() => {
    if (dispatchOnMount && !hasBeenMounted) dispatch(eventData);
    setHasBeenMounted(true);
  }, [dispatch, dispatchOnMount, eventData, hasBeenMounted]);

  // Memoize returns (`<Provider />` and `trackEvent`)
  const nextContext = useMemo(() => ({ dispatch, eventData }), [
    dispatch,
    eventData,
  ]);
  const Provider = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <AnalyticsContext.Provider value={nextContext}>
        {children}
      </AnalyticsContext.Provider>
    ),
    [nextContext],
  );
  const trackEvent = useCallback(
    (data) => dispatch({ ...eventData, ...data }),
    [dispatch, eventData],
  );
  return { Provider, trackEvent };
};
