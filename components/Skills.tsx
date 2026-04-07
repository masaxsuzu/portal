interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsProps {
  title: string;
  categories: SkillCategory[];
}

export default function Skills({ data }: { data: SkillsProps }) {
  return (
    <div className="w-full">
      <h2 className="text-white text-[30px] pb-6">{data.title}</h2>
      <div className="flex flex-col gap-4">
        {data.categories.map((category, idx) => (
          <div key={idx}>
            <p className="text-primary font-bold mb-2">{category.name}</p>
            <ul className="flex flex-wrap gap-2">
              {category.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="text-primary border border-primary rounded px-3 py-1 text-[14px]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
