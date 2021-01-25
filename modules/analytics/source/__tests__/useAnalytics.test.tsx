import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAnalytics } from '..';

// Components
const LeafNoDataComponent = () => {
  const { trackEvent } = useAnalytics();
  return (
    <button
      type="button"
      onClick={() => trackEvent({ action: 'button-click' })}
    >
      NoDataComponent
    </button>
  );
};

const LeafComponent = ({ label = '' }) => {
  const { trackEvent } = useAnalytics({ leaf: label });
  return (
    <button
      type="button"
      onClick={() => trackEvent({ action: 'button-click' })}
    >
      {label}
    </button>
  );
};

type ParentComponentProps = {
  children?: React.ReactNode;
  dispatch?: (data: Object) => void;
  dispatchOnMount?: boolean;
};
const ParentComponent = ({
  children,
  dispatch,
  dispatchOnMount = false,
}: ParentComponentProps) => {
  const { Provider } = useAnalytics(
    { parent: 'ParentComponent' },
    // Trigger an event when the component is mounted
    { dispatch, dispatchOnMount },
  );
  return <Provider>{children}</Provider>;
};

type RootComponentProps = {
  children?: React.ReactNode;
  dispatch: (data: Object) => void;
  rootEventData?: Object;
};
const RootComponent = ({
  children,
  dispatch,
  rootEventData = { root: 'RootComponent' },
}: RootComponentProps) => {
  const { Provider } = useAnalytics(
    // Shared event data
    rootEventData,
    // Dispatch function to handle triggered events
    { dispatch },
  );

  return <Provider>{children}</Provider>;
};

// Tests
describe('useAnalytics', () => {
  test('do not dispatch on mount', async () => {
    const dispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={dispatchSpy}>
        <ParentComponent />
      </RootComponent>,
    );

    expect(dispatchSpy).not.toBeCalled();
  });

  test('dispatch on mount', async () => {
    const dispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={dispatchSpy}>
        <ParentComponent dispatchOnMount />
      </RootComponent>,
    );

    expect(dispatchSpy).toHaveBeenCalledWith({
      root: 'RootComponent',
      parent: 'ParentComponent',
    });
  });

  test('dispatch with leaf that has no local event data', async () => {
    const dispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={dispatchSpy}>
        <LeafNoDataComponent />
      </RootComponent>,
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(0);

    // No-data leaf button click
    fireEvent.click(screen.getByText('NoDataComponent'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      action: 'button-click',
      root: 'RootComponent',
    });
  });

  test('dispatch with mutated root event data', async () => {
    const dispatchSpy = jest.fn();
    const { rerender } = render(
      <RootComponent dispatch={dispatchSpy}>
        <LeafNoDataComponent />
      </RootComponent>,
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
    await rerender(
      <RootComponent
        dispatch={dispatchSpy}
        rootEventData={{ root: 'RootComponentChanged' }}
      >
        <LeafNoDataComponent />
      </RootComponent>,
    );

    // No-data leaf button click
    fireEvent.click(screen.getByText('NoDataComponent'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      action: 'button-click',
      root: 'RootComponentChanged',
    });
  });

  test('dispatch with leaf event data', async () => {
    const dispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={dispatchSpy}>
        <LeafComponent label="FirstLeafComponent" />
        <LeafComponent label="SecondLeafComponent" />
      </RootComponent>,
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(0);

    // First leaf button click
    fireEvent.click(screen.getByText('FirstLeafComponent'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      action: 'button-click',
      leaf: 'FirstLeafComponent',
      root: 'RootComponent',
    });

    // Second leaf button click
    fireEvent.click(screen.getByText('SecondLeafComponent'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      action: 'button-click',
      leaf: 'SecondLeafComponent',
      root: 'RootComponent',
    });
  });

  test('dispatch with merged root, parent, and leaf event data', async () => {
    const dispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={dispatchSpy}>
        <ParentComponent>
          <LeafComponent label="FirstLeafComponent" />
        </ParentComponent>
      </RootComponent>,
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(0);

    // First leaf button click
    fireEvent.click(screen.getByText('FirstLeafComponent'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      action: 'button-click',
      leaf: 'FirstLeafComponent',
      parent: 'ParentComponent',
      root: 'RootComponent',
    });
  });

  test('dispatch using parent override', async () => {
    const rootDispatchSpy = jest.fn();
    const parentDispatchSpy = jest.fn();
    render(
      <RootComponent dispatch={rootDispatchSpy}>
        <ParentComponent dispatch={parentDispatchSpy} dispatchOnMount />
      </RootComponent>,
    );
    expect(rootDispatchSpy).toHaveBeenCalledTimes(0);
    expect(parentDispatchSpy).toHaveBeenCalledTimes(1);
    expect(parentDispatchSpy).toHaveBeenCalledWith({
      parent: 'ParentComponent',
      root: 'RootComponent',
    });
  });
});
