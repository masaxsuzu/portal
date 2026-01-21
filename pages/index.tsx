import Head from 'next/head';
import data from './data.json';
import About from '../components/About';
import MainCta from '../components/MainCta';
import Divider from '../components/Divider';
import Cards from '../components/Cards';
type ComponentMapKeyType = 'About' | 'MainCta' | 'Divider' | 'Cards';

const componentMap = {
  About,
  MainCta,
  Divider,
  Cards,
};

export default function HomePage() {
  return (
    <div className="bg-background flex justify-center w-full">
      <Head>
        <title>{data?.title}</title>
        <meta name="description" content={data?.siteDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-10  text-primary max-w-[1024px] flex flex-col items-start px-6">
        {data?.components?.map((item, idx) => {
          const key = item?.name as ComponentMapKeyType;
          const Comp = componentMap[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return <Comp key={idx} data={item?.data as any} />;
        })}
      </div>
    </div>
  );
}
