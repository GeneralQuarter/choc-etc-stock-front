import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import API from './api';

interface APIDataState<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
}

export default function useAPIState<T>(initialState: T, endUrl?: string): [APIDataState<T>, Dispatch<SetStateAction<string>>] {
  const [data, setData] = useState(initialState);
  const [_endUrl, setEndUrl] = useState(endUrl as string);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!_endUrl) {
        return;
      }

      setIsError(false);
      setIsLoading(true);

      try {
        const result = await API.get<T>(_endUrl).then(res => res.data);
        setData(result);
      } catch (e) {
        setIsError(true);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [_endUrl]);

  return [{data, isLoading, isError}, setEndUrl];
}
