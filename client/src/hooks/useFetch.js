import { useState, useEffect, useCallback } from 'react';

export const useFetch = (apiFunc, autoFetch = true, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...executeArgs) => {
    setLoading(true);
    setError(null);
    try {
      const callArgs = executeArgs.length > 0 ? executeArgs : args;
      const result = await apiFunc(...callArgs);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  }, [apiFunc, JSON.stringify(args)]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return { data, loading, error, execute, setData };
};
export default useFetch;
