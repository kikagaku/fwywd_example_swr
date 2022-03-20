import useSWR, { useSWRConfig } from 'swr';

interface UseSetCount {
  countUp: () => void;
}

interface UseCount extends UseSetCount {
  count?: number | null;
}

export const useCount = (): UseCount => {
  // 非同期処理の疑似的に再現
  const getCount = async (): Promise<number> => {
    return 0;
  };

  const { data: count } = useSWR('count', getCount);

  const setter = useSetCount();

  return { count, ...setter };
};

export const useSetCount = (): UseSetCount => {
  const { mutate } = useSWRConfig();

  const countUp = (): void => {
    mutate(
      'count',
      (count?: number) => {
        if (count !== undefined) return count + 1;
      },
      false,
    );
  };

  return { countUp };
};
