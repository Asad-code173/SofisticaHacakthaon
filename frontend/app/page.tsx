"use client";
import SampleSelector from "../app/components/SampleSelector";
import Header from "../app/components/Header";

import { useState } from "react";
import PredictionCards from "./components/Predictioncard";
import ProbabilityDistribution from "./components/Probablitychart";
import Footer from "./components/Footer";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedSample, setSelectedSample] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeDNS = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      if (!jsonInput.trim()) {
        throw new Error("Please enter DNS data.");
      }

      const parsedData = JSON.parse(jsonInput);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err: any) {
      setError(
        err.message || "Unable to analyze DNS traffic."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <Header />

      {/* Main */}
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-8">

          <p className="text-blue-400 font-medium mb-2">
            XGBoost Detection Engine
          </p>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Analyze DNS Traffic
          </h2>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Submit DNS traffic features and let our machine learning
            model classify the traffic across seven categories.
          </p>

        </div>

        {/* Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="text-lg font-semibold">
                DNS Feature Data
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Paste a JSON feature record from your dataset.
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400">
              17 Raw Features
            </span>
            <SampleSelector
              selectedSample={selectedSample}
              onSelect={(label, sample) => {
                setSelectedSample(label);
                setJsonInput(JSON.stringify(sample, null, 2));
                setResult(null);
                setError("");
              }}
            />
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste DNS JSON here...'
            className="w-full h-72 p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm outline-none focus:border-blue-500 resize-none"
          />

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={analyzeDNS}
            disabled={loading}
            className="mt-5 w-full md:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? "Analyzing DNS Traffic..." : "Analyze DNS Traffic"}
          </button>

        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Analysis Result
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  XGBoost classification result
                </p>
              </div>

              <div className="text-sm text-emerald-400">
                Analysis Complete
              </div>

            </div>

            {/* Prediction cards */}
            <PredictionCards label={result.label} confidence={result.confidence} />

            {/* Probability distribution */}
            <ProbabilityDistribution probabilities={result.probabilities} />

            {/* Message */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-5">

              <p className="text-blue-300">
                🛡️ {result.message}
              </p>

            </div>

          </div>
        )}

      </section>

      <Footer />

    </main>
  );
}