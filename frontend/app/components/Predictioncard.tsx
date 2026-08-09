type PredictionCardsProps = {
  label: string;
  confidence: number;
};

export default function PredictionCards({
  label,
  confidence,
}: PredictionCardsProps) {
  const percentage = confidence * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-slate-400 text-sm">
          Classification
        </p>

        <p className="text-4xl font-bold mt-3 capitalize text-blue-400">
          {label}
        </p>

        <p className="text-slate-500 text-sm mt-3">
          Predicted DNS traffic category
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-slate-400 text-sm">
          Model Confidence
        </p>

        <p className="text-4xl font-bold mt-3">
          {percentage.toFixed(2)}%
        </p>

        <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

    </div>
  );
}