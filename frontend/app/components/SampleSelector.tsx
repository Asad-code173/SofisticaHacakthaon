"use client";

import { sampleData } from "../dnssamples";

type SampleSelectorProps = {
  selectedSample: string;
  onSelect: (label: string, sample: object) => void;
};

export default function SampleSelector({
  selectedSample,
  onSelect,
}: SampleSelectorProps) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">
        Try a real dataset sample
      </p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(sampleData).map((label) => {
          const isSelected = selectedSample === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() =>
                onSelect(
                  label,
                  sampleData[label as keyof typeof sampleData]
                )
              }
              className={`
                rounded-lg border px-4 py-2 text-sm capitalize
                transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}