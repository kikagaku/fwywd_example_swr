import { useCount } from '@/hook/useCount';

export const CountViewer: React.FC = () => {
  const { count } = useCount();
  return (
    <div>
      Count: <span className='text-lg font-bold'>{count}</span>
    </div>
  );
};
