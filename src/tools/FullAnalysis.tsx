import { createSignal } from "solid-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { BarChart } from "~/components/ui/charts";
import { ChartData, ChartOptions } from "chart.js";
import { corpusMonograms } from "~/globalstate";

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

export function FullAnalysis() {
    const [text, setText] = createSignal("Hello, World!")
    const [monogramFrequency, setMonogramFrequency] = createSignal<{ [key: string]: number; }>({})

    async function analyse() {
        setMonogramFrequency(await CountMonograms(text()));
    }

    const englishMonogramOrder = () => letters.sort((a, b) => corpusMonograms()[b] - corpusMonograms()[a])
    const inputMonogramOrder = () => letters.sort((a, b) => monogramFrequency()[b] - monogramFrequency()[a])

    const chartData: () => ChartData = () => ({
        labels: Array(26).fill(" "),
        datasets: [
            {
                label: "Your Text",
                data: inputMonogramOrder().map((letter) => monogramFrequency()[letter]) ?? [],
                yAxisID: "y1"
            },

            {
                label: "Corpus",
                data: englishMonogramOrder().map((letter) => corpusMonograms()[letter]) ?? [],
                yAxisID: "y"
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

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter Encoded Text</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea value={text()} placeholder="Type your message here." onInput={(e) => setText(e.currentTarget.value)} />
                <button class="py-1 px-2 bg-black text-white rounded-md mt-4" onClick={analyse}>Analyse</button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Frequency Distrubution</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="max-h-96">
                <BarChart data={chartData()} options={chartOptions} />
                </div>

            </CardContent>

        </Card>
    </div>
}