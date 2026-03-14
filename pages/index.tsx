import Head from 'next/head';
import data from './data.json';
import About from '../components/About';
import MainCta from '../components/MainCta';
import Divider from '../components/Divider';
import Cards from '../components/Cards';
import Controls from '../components/Controls';
import { useAppContext } from '../contexts/AppContext';

type ComponentMapKeyType = 'About' | 'MainCta' | 'Divider' | 'Cards';

const componentMap = {
  About,
  MainCta,
  Divider,
  Cards,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyTranslations(
  name: string,
  itemData: any,
  t: ReturnType<typeof useAppContext>['t']
) {
  if (name === 'MainCta') return { ...itemData, bio: t.mainCtaBio };
  if (name === 'About')
    return { ...itemData, title: t.aboutTitle, description: t.aboutDesc };
  if (name === 'Cards') return { ...itemData, title: t.cardsTitle };
  return itemData;
}

export default function HomePage() {
  const { t } = useAppContext();

  return (
    <div className="bg-background flex justify-center w-full">
      <Head>
        <title>{data?.title}</title>
        <meta name="description" content={data?.siteDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Controls />
      <div className="my-10  text-primary max-w-[1024px] flex flex-col items-start px-6">
        {data?.components?.map((item, idx) => {
          const key = item?.name as ComponentMapKeyType;
          const Comp = componentMap[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (
            <Comp
              key={idx}
              data={applyTranslations(item.name, item?.data as any, t)}
            />
          );
        })}
      </div>
    </div>
  );
}
