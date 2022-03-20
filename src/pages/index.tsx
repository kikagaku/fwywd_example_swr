import { CountUp } from '@/component/CountUp';
import { CountViewer } from '@/component/CountViewer';

const Home: React.FC = () => (
  <main className='mx-auto grid max-w-md gap-y-5 py-6 text-primary-800'>
    <h1 className='text-lg font-bold '>Welcome to Kikagaku Next.js Starter Kit!!</h1>
    <CountViewer />
    <CountUp />
  </main>
);

export default Home;
