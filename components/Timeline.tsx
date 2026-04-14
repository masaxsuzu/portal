interface TimelineEvent {
  period: string;
  description: string;
}

interface TimelineProps {
  title: string;
  events: TimelineEvent[];
}

export default function Timeline({ data }: { data: TimelineProps }) {
  return (
    <div className="w-full">
      <h2 className="text-white text-[30px] pb-6">{data.title}</h2>
      <div className="relative border-l-2 border-primary pl-6 flex flex-col gap-6">
        {data.events.map((event, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[1.625rem] top-1 w-3 h-3 rounded-full bg-primary" />
            <p className="text-primary text-[14px] mb-1">{event.period}</p>
            <p className="text-white">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
