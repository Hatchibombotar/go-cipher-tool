import { createEffect, createMemo, createSignal, For, Index, onCleanup, onMount, Show } from "solid-js";
import { InputNode } from "../nodes/InputNode";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    NumberField,
    NumberFieldDecrementTrigger,
    NumberFieldIncrementTrigger,
    NumberFieldInput
} from "~/components/ui/number-field"
import { Textarea } from "~/components/ui/textarea";
import challenge from "./challenge";
import { ChartData, ChartOptions } from "chart.js";
import { corpusMonograms } from "~/globalstate";
import { BarChart } from "~/components/ui/charts";
import { corpus_data } from "~/utils";
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";

const alphabetplus = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');


const expectedthings =
    "/".charCodeAt(0)
    + "|".charCodeAt(0)
    + "\\".charCodeAt(0)

export function Shuffle() {
    const columns = 21
    const [columnOrder, setColumnOrder] = createSignal<number[]>([])

    const [stringKey, setStringKey] = createSignal("")

    const rows = () => Math.ceil(challenge.length / columns)

    createEffect(() => {
        if (columnOrder().length != columns) {
            let currentOrder = columnOrder()
            for (const iString in new Array(columns).fill(null)) {
                const i = Number(iString)
                if (!currentOrder.includes(i)) {
                    currentOrder.push(i)
                }
            }
            currentOrder = currentOrder.filter(x => x < columns)
            setColumnOrder([...currentOrder])
        }
        setStringKey(JSON.stringify(columnOrder()))
    })

    let container!: HTMLTableElement;

    const getNeedleResult = () => {
        let result = ""
        for (const rowS in new Array(rows()).fill(null)) {
            const row = Number(rowS)
            for (const col of columnOrder()) {
                result += challenge[(row * columns) + col] ?? ""
            }
        }
        return result
    }

    const getADFGVXResult = createMemo(() => {
        return threeNeedleTelegraph(getNeedleResult())
    })
    const getTextResult = createMemo(() => {
        return adfgvxtotext(getADFGVXResult())
    })

    const getBestFit = () => {
        const text = getTextResult()
        const input_frequencies = countMonograms(text);
        const sorted_input = Object.entries(input_frequencies).sort(([, a], [, b]) => a - b);

        const corpus_frequencies = corpus_data.monograms as Record<string, number>
        for (const char of alphabetplus) {
            if (!(char in corpus_frequencies)) {
                corpus_frequencies[char] = 0;
            }
        }

        const sorted_corpus = Object.entries(corpus_frequencies).sort(([, a], [, b]) => a - b);

        const substitution: Record<string, string> = {};
        for (const [index, [expected_char]] of Object.entries(sorted_corpus)) {
            const [character] = sorted_input[Number(index)] ?? [];
            if (character == undefined) {
                break;
            }
            substitution[character] = expected_char;
        }

        return substitutionCipher(text, substitution)
    }

    createEffect(() => {
        setResultMonograms(countMonograms(getBestFit()))
    })


    function copy() {
        const htmlContent = container.outerHTML

        const blob = new Blob([htmlContent], { type: "text/html" })
        const clipboardItem = new ClipboardItem({ "text/html": blob })

        navigator.clipboard.write([clipboardItem]).then(() => {
            console.log("Table with styling copied!")
        }).catch((err) => {
            console.error("Error copying table: ", err)
        })
    }

    function moveLeft(index: number) {
        if (index == 0) return

        const result = [
            ...columnOrder().slice(0, index - 1),
            columnOrder()[index],
            columnOrder()[index - 1],
            ...columnOrder().slice(index + 1, columnOrder().length)
        ]

        setColumnOrder(result)
    }

    function moveRight(index: number) {
        if (index == columnOrder().length - 1) return

        const result = [
            ...columnOrder().slice(0, Math.max(0, index)),
            columnOrder()[index + 1],
            columnOrder()[index],
            ...columnOrder().slice(index + 2, columnOrder().length)
        ]

        setColumnOrder(result)
    }

    const [resultMonograms, setResultMonograms] = createSignal<Record<string, number>>({});

    const chartData: () => ChartData = () => ({
        labels: alphabetplus,
        datasets: [
            {
                label: "Result",
                data: alphabetplus.map((letter) => resultMonograms()[letter]) ?? [],
                yAxisID: "y"
            },

            {
                label: "Corpus",
                data: alphabetplus.map((letter) => corpusMonograms()[letter]) ?? [],
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

    // const [keySymmetry, setKeySymmetry] = createSignal(false)

    // createEffect(makeSymmetrical)
    // function makeSymmetrical() {
    //     const neworder = columnOrder().slice(0, 11)
    //     console.log(neworder)
    //     for (let i = 0; i < 10; i++) {
    //         console.log(i)
    //     }
    // }

    function isKeySymmetrical() {
        const neworder = columnOrder().slice(0, 11)
        console.log(neworder)

        let isSymmetrical = true
        for (let i = 0; i < 11; i++) {
            // console.log(columnOrder()[i])
            // console.log()
            // console.log(i, 20-i)
            if (columnOrder()[i] != 20 - columnOrder()[20-i]) {
                isSymmetrical = false
                break
            }
        }

        return isSymmetrical
    }

    function getFrequenciesForADFGVXColumn(column: number) {
        const text = getADFGVXResult()
        const frequencies: Record<string, number> = {}
        for (let i = column; i <= text.length; i += 7) {
            const char = text[i]
            frequencies[char] = (frequencies[char] ?? 0) + 1
        }
        return frequencies
    }

    function getAverageADFGVXColumnFrequencies() {
        const cols = 7
        const total = {
            A: 0, D: 0, F: 0, G: 0, V: 0, X: 0
        }
        for (let i = 0; i < cols; i++) {
            const f = getFrequenciesForADFGVXColumn(i)
            total.A += f.A
            total.D += f.D
            total.F += f.F
            total.G += f.G
            total.V += f.V
            total.X += f.X
        }
        total.A /= cols
        total.D /= cols
        total.F /= cols
        total.G /= cols
        total.V /= cols
        total.X /= cols

        return total
    }

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <button onClick={copy} class="bg-black text-white rounded-md py-1 px-2 mt-4">Copy Table</button>
                <button onClick={() => setColumnOrder([])} class="bg-black text-white rounded-md py-1 px-2 mt-4 ml-1">Reset Order</button>


                <span class="font-semibold text-sm block">Key</span>
                <input type="text" class="border rounded h-8 block px-2 w-full" value={stringKey()} onInput={(e) => {
                    const val = JSON.parse(e.currentTarget.value) as number[]
                    const total = (prev: any, cur: any) => prev + cur
                    if (val.reduce(total) != columnOrder().reduce(total)) {
                        return
                    }

                    setColumnOrder(val)

                }}></input>

                <Show when={isKeySymmetrical()} fallback={"Key is not Symmetrical"}>
                    Key is Symmetrical
                </Show>

            </CardContent>
        </Card>

        <div class="grid grid-cols-2">
            <div class="max-h-96 overflow-auto">

                <table ref={container} class="custom-table stickyhead select-auto text-center">
                    <thead>
                        <tr class="text-center select-none">
                            <For each={columnOrder()}>{(columnNumber, columnIndex) =>
                                <th class="max-w-32">
                                    <div class="grid grid-cols-2">
                                        <button onClick={() => moveLeft(columnIndex())}>{"<"}</button>
                                        <button onClick={() => moveRight(columnIndex())}>{">"}</button>
                                    </div>
                                    <span>{columnNumber}</span>
                                </th>
                            }</For>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={new Array(rows())}>{(_, row) =>
                            <tr
                                class="text-center"
                            >
                                <For each={columnOrder()}>{(col, index) => {
                                    const char = () => challenge[(row() * columns) + col]
                                    // const isHighlighted = () => highlight().includes(char())
                                    const isValid = () => {
                                        const startofRow = row() * columns
                                        const starti = Math.floor(index() / 3) * 3
                                        const a = challenge[startofRow + columnOrder()[starti]]
                                        const b = challenge[startofRow + columnOrder()[starti + 1]]
                                        const c = challenge[startofRow + columnOrder()[starti + 2]]
                                        if (a == undefined) return
                                        if (b == undefined) return
                                        if (c == undefined) return

                                        const things = a.charCodeAt(0) + b.charCodeAt(0) + c.charCodeAt(0)
                                        return expectedthings == things
                                    }
                                    return <td
                                        // style={isHighlighted() ? `background: #fde047;` : ""}
                                        classList={{
                                            "bg-green-400": isValid()
                                        }}
                                    >
                                        {char()}
                                    </td>
                                }}</For>
                            </tr>
                        }</For>
                    </tbody>
                </table>

            </div>

            <div class="h-96">
                <BarChart data={chartData()} options={chartOptions} />
            </div>
        </div>
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>ADFGVX Column Analysies</CardTitle>
            </CardHeader>
            <CardContent class="grid grid-cols-7 h-48">
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(0)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(1)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(2)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(3)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(4)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(5)} data2={() => getAverageADFGVXColumnFrequencies()} />
                <BasicFrequencyComparisonGraph alphabet={"ADFGVX".split("")} data1={() => getFrequenciesForADFGVXColumn(6)} data2={() => getAverageADFGVXColumnFrequencies()} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-4">
                    <div>
                        <p>Needles ({getNeedleResult().length})</p>
                        <p class="break-all">{getNeedleResult()}</p>
                    </div>
                    <div>
                        <p>ADFGVX ({getADFGVXResult().length})  Bigrams: {Object.keys(countNGrams(getADFGVXResult(), 2)).length}</p>
                        <p class="break-all">{getADFGVXResult()}</p>
                    </div>
                    <div>
                        <p>Text ({getTextResult().length})</p>
                        <p class="break-all">{getTextResult()}</p>
                    </div>
                    <div>
                        <p>Good Fit Text ({getBestFit().length})</p>
                        <p class="break-all">{getBestFit()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
}

function BasicFrequencyGraph({ alphabet, data }: { alphabet: string[], data: () => Record<string, number> }) {
    const chartData: () => ChartData = () => ({
        labels: alphabet,
        datasets: [
            {
                label: "Frequencies",
                data: alphabet.map((letter) => data()[letter]) ?? [],
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

    return <BarChart data={chartData()} options={chartOptions} />
}

function BasicFrequencyComparisonGraph({ alphabet, data1, data2 }: { alphabet: string[], data1: () => Record<string, number>, data2: () => Record<string, number> }) {
    const chartData: () => ChartData = () => ({
        labels: alphabet,
        datasets: [
            {
                label: "data1",
                data: alphabet.map((letter) => data1()[letter]) ?? [],
                yAxisID: "y"
            },
            {
                label: "data2",
                data: alphabet.map((letter) => data2()[letter]) ?? [],
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

    return <BarChart data={chartData()} options={chartOptions} />
}

function splitIntoGrams(text: string, ngramSize: number): string[] {
    const trigrams: string[] = [];

    for (let n = 0; n < Math.floor(text.length / ngramSize); n++) {
        const i = n * ngramSize;
        const gram = text.slice(i, i + ngramSize);
        trigrams.push(gram);
    }

    return trigrams;
}

function threeNeedleTelegraph(str: string): string {
    const split = splitIntoGrams(str, 3);

    let result = "";
    const substitutions: { [key: string]: string } = {
        "/|\\": "A",
        "/\\|": "D",
        "|/\\": "F",
        "\\/|": "G",
        "|\\/": "V",
        "\\|/": "X",
    };

    for (const ngram of split) {
        result += substitutions[ngram] || ""; // Handle undefined substitution
    }

    return result;
}

const ADFGVX = "ADFGVX".split("")

function adfgvxtotext(str: string) {
    let result = ""
    for (let i = 0; i < str.length - 1; i += 2) {
        const row = ADFGVX.indexOf(str[i])
        const col = ADFGVX.indexOf(str[i + 1])

        let charIndex = (row * 6) + col

        if (charIndex >= 26) {
            charIndex -= 26
            result += String(charIndex)
        } else {
            result += String.fromCharCode("a".charCodeAt(0) + charIndex)
        }
    }
    return result
}


function countMonograms(text: string): Record<string, number> {
    const monograms: Record<string, number> = {}

    for (const char of alphabetplus) {
        monograms[char] = 0;
    }

    for (const char of text) {
        monograms[char] = (monograms[char] || 0) + 1;
    }

    return monograms;
}

function countNGrams(text: string, n: number): Record<string, number> {
    const nGrams: Record<string, number> = {};

    for (let i = 0; i <= text.length - n; i++) {
        const nGram = text.slice(i, i + n); // Extract n-gram of size n
        nGrams[nGram] = (nGrams[nGram] || 0) + 1; // Count occurrences
    }

    return nGrams;
}

function panic() {
    throw Error("Unknown Error")
}

function substitutionCipher(text: string, substitutions: Record<string, string>): string {
    let result = "";

    for (const char of text) {
        result += substitutions[char] || panic()
    }

    return result;
}
