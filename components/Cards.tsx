interface CardProps {
  title: string;
  url: string;
  description: string;
  titleTextClass: 'text-csharp' | 'text-c' | 'text-rust' | 'text-ts';
}

function Card({ title, url, description, titleTextClass }: CardProps) {
  return (
    <div className="bg-cardbg flex flex-col border-2 border-cardborder py-4 px-6 rounded-2xl shadow-md shadow-cardbg">
      <div className="flex justify-between relative">
        <span className={`text-[16px] ${titleTextClass} font-[600]`}>
          {title}
        </span>
        <a
          href={url}
          className="absolute right-0 top-[-10px] text-[#444] hover:text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/>
          </svg>
        </a>
      </div>
      <p className="text-[20px] text-white font-bold py-4">{description}</p>
    </div>
  );
}

function Cards({ data }: { data?: { title: string; data: CardProps[] } }) {
  return (
    <div className="w-full">
      <h2 className="text-white text-[30px] pb-6">{data?.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((item, idx) => (
          <Card {...item} key={idx} />
        ))}
      </div>
    </div>
  );
}

export default Cards;
