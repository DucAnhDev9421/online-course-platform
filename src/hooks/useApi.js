import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * useApi - Custom hook để gọi API từ backend
 * @param {string} url - Endpoint của API
 * @param {object} options - Các tuỳ chọn: { method, data, params, headers, ... }
 * @param {boolean} [auto=true] - Tự động gọi API khi mount hoặc khi url/options thay đổi
 * @returns {object} { data, error, loading, refetch }
 */
export default function useApi(url, options = {}, auto = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        headers: options.headers,
        ...options,
      });
      setData(response.data);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (auto) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [url, JSON.stringify(options), trigger, auto]);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return { data, error, loading, refetch };
} 