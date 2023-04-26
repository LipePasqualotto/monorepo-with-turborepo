/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react";

interface UseControllableStateParams<T> {
  value?: T | undefined;
  defaultValue?: T | undefined;
  onChange?: (value: T) => void;
}

type SetStateFn<T> = (prevValue: T) => T;

function useControllableState<T>({
  value,
  defaultValue,
  onChange = () => { },
}: UseControllableStateParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useUncontrollableState({ defaultValue, onChange })
  const isControlled = value !== undefined;
  const finalValue = isControlled ? value : uncontrolledValue;

  const setState = React.useCallback((nextValue: T | undefined) => {
    if (isControlled) {
      const setter = nextValue as SetStateFn<T>;
      const newValue = typeof nextValue === 'function' ? setter(value) : nextValue;
      if (nextValue !== value) onChange(newValue as T);
    } else {
      setUncontrolledValue(nextValue);
    }
  }, [isControlled, onChange, setUncontrolledValue, value]);

  return [finalValue, setState] as const;
}

interface UseUncontrollableStateParams<T> {
  defaultValue?: T | undefined;
  onChange?: (value: T) => void;
}

function useUncontrollableState<T>({
  defaultValue,
  onChange = () => { },
}: Omit<UseUncontrollableStateParams<T>, 'value'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultValue);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef<T | undefined>(value);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChange(value as T);
      prevValueRef.current = value;
    }
  }, [onChange, value])

  return uncontrolledState
}

export { useControllableState }
