import { useSetCount } from '@/hook/useCount';

export const CountUp: React.FC = () => {
  const { countUp } = useSetCount();
  return (
    <div>
      <button
        onClick={countUp}
        className='rounded bg-primary-800 px-4 py-2 text-white hover:opacity-70'
      >
        UseSetCount 経由の カウントアップ
      </button>
    </div>
  );
};
