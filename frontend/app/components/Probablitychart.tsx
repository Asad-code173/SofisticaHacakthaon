type ProbabilityDistributionProps = {
  probabilities: Record<string, number>;
};

export default function ProbabilityDistribution({
  probabilities,
}: ProbabilityDistributionProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h3 className="text-xl font-semibold">
        Class Probability Distribution
      </h3>

      <p className="text-slate-400 text-sm mt-1 mb-6">
        Probability assigned to each DNS traffic category.
      </p>

      <div className="space-y-5">

        {Object.entries(probabilities).map(
          ([label, probability]) => {

            const percentage = probability * 100;

            return (
              <div key={label}>

                <div className="flex justify-between mb-2">

                  <span className="capitalize font-medium">
                    {label}
                  </span>

                  <span className="text-slate-400">
                    {percentage.toFixed(2)}%
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}