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
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
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
