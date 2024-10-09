import { BarChart } from "~/components/ui/charts";
import { createEffect, createSignal } from "solid-js";
import { ChartData, ChartOptions } from "chart.js";
import { BlockData } from "~/tools/Workspace/blocks";
import { corpusMonograms } from "~/globalstate";

export interface FrequencyAnalysisBlockData extends BlockData {
  type: "frequency_analysis"
}

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

export function FrequencyAnalysis({ text }: { text: () => string; }) {
  const [monograms, setMonograms] = createSignal<any>({});
  createEffect(async () => {
    setMonograms(await CountMonograms(text()));
  });
  const chartData: () => ChartData = () => ({
    labels: letters,
    datasets: [
      {
        label: "Your Text",
        data: letters.map((letter) => monograms()[letter]) ?? [],
        yAxisID: "y"
      },

      {
        label: "Corpus",
        data: letters.map((letter) => corpusMonograms()[letter]) ?? [],
        yAxisID: "y1"
      }
    ],
  });
  const chartOptions: ChartOptions = {
    animation: false,
    scales: {
      "x": {
        ticks: {
          padding: 10,
          autoSkip: false,
          font: {
            size: 12
          },
          maxRotation: 0,
          minRotation: 0,
        }
      },

      y: {
        position: "left",
        ticks: {
          font: {
            size: 12
          },
          minRotation: 0
        }
      },
      y1: {
        position: "right",
        ticks: {
          font: {
            size: 12
          },
          minRotation: 0
        }
      }
    },
  };
  return <div class="">
    <div class="h-96">
      <BarChart data={chartData()} options={chartOptions} />
    </div>
  </div>;
}
