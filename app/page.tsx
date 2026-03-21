'use client';

import data from './data.json';
import About from '../components/About';
import MainCta from '../components/MainCta';
import Divider from '../components/Divider';
import Cards from '../components/Cards';
import { useAppContext } from '../contexts/AppContext';
import type { Translations } from '../lib/i18n';

type ComponentMapKeyType = 'About' | 'MainCta' | 'Divider' | 'Cards';

const componentMap = {
  About,
  MainCta,
  Divider,
  Cards,
};

function applyTranslations(
  name: string,
  itemData: Record<string, unknown>,
  t: Translations
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
    <div className="flex justify-center w-full">
      <div className="my-10 text-primary max-w-[1024px] flex flex-col items-start px-6 w-full">
        {data?.components?.map((item, idx) => {
          const key = item?.name as ComponentMapKeyType;
          const Comp = componentMap[key];
          const translatedData = applyTranslations(
            item.name,
            item?.data as Record<string, unknown>,
            t
          );
          return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Comp key={idx} data={translatedData as any} />
          );
        })}
      </div>
    </div>
  );
}
