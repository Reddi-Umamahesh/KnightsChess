import { Clock1 } from 'lucide-react';


const Clock = ({ time }: { time: number | undefined }) => {
    if (!time) {
        return null
    }
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time / 1000) % 60);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-2">
      <Clock1 className="w-5 h-5 text-gray-400" />
          <span className="text-gray-100 font-mono text-xl">{formattedTime}</span>
    </div>
  );
};

export default Clock