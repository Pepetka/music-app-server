export type OnceCallbackType<T = never> = (...args: T[]) => void;

export const onceCallback = <T = never>(
  callback: OnceCallbackType<T>,
): OnceCallbackType<T> => {
  let called = false;
  return (...args: T[]) => {
    if (!called) {
      called = true;
      callback(...args);
    }
  };
};
