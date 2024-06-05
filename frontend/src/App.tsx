import { Textarea } from "~/components/ui/textarea"
import { Slider, SliderFill, SliderThumb, SliderTrack } from "~/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card"
import { BarChart } from "~/components/ui/charts";

import { For, createEffect, createSignal } from "solid-js";
import { CountMonograms, DecodeCaesarCipher, Format } from "../wailsjs/go/main/App";
import { ChartData, ChartOptions } from "chart.js";
import { FormatOptions, FormattingMode } from "./models";

function panic(err: Error | string): never {
  throw err
}

const blockdata = {
  
}

function App() {
  const [text, setText] = createSignal("Hello")
  const blocks = [
    {
      "type": "frequency_analysis",
    },
    {
      "type": "caesar_cipher",
    },
    {
      "type": "frequency_analysis",
    },
    {
      "type": "format",
    },
    {
      "type": "output",
    }
  ]
  let [dataStack, setDataStack] = createSignal([text()])

  const setInputText = (text: string) => {
    text = text.toLowerCase()
    setText(text)
    setDataStack([text])
  }

  createEffect(() => {
    console.log(dataStack())
  })

  return (
    <div class="p-6 flex flex-col gap-4 md:grid grid-cols-2 bg-white">
      <InputNode onChange={setInputText} />
      <For each={blocks}>{(node) => {
        let index = dataStack().length - 1
        const data = () => dataStack().at(index) ?? ""

        if (node.type === "frequency_analysis") {
          return <FrequencyAnalysis text={data} />

        } else if (node.type === "caesar_cipher") {
          index += 1
          setDataStack([...dataStack(), dataStack().at(index - 1) ?? ""])

          const onChange = async (n: number) => {
            const prevDataStack = [...dataStack()]
            prevDataStack[index] = await DecodeCaesarCipher(dataStack().at(index - 1) ?? panic("error"), n)
            setDataStack(prevDataStack)
          }

          onChange(0)
          return <CaesarCipher onChange={(n) => { onChange(n) }} />
        } else if (node.type === "format") {
          index += 1
          setDataStack([...dataStack(), dataStack().at(index - 1) ?? ""])

          const onChange = async (settings: FormatNodeSettings) => {
            const options: FormatOptions = {
              CaseMode: settings.case,
              RemoveUnknown: false
            }

            const prevDataStack = [...dataStack()]
            prevDataStack[index] = await Format(dataStack().at(index - 1) ?? panic("error"),  options)
            setDataStack(prevDataStack)
          }
          onChange({
            case: FormattingMode.UnchangedCaseFormatting
          })
          return <FormatNode onChange={(settings) => { onChange(settings) }} />

        } else if (node.type === "output") {

          return <Output text={data} />

        } else {
          return
        }
      }}
      </For>

      <Card class="p-2 flex flex-row gap-2">
        <For each={[0, 1, 2]}>{() =>
          <div class="group relative w-12">
            <div class="border hover:bg-slate-100 cursor-pointer rounded-lg h-12 w-12"></div>
            <div class="hidden group-hover:flex pt-3 absolute left-full ml-2 top-0 border z-20 bg-slate-200 p-2 rounded-lg h-12 w-auto">
              <p class="text-sm whitespace-nowrap font-semibold">Frequency Analysis</p>
            </div>
          </div>
        }</For>
      </Card>
    </div>
  );
}

function InputNode({ onChange }: { onChange: (text: string) => void }) {
  return <div class="">
    <Card>
      <CardHeader>
        <CardTitle>Input</CardTitle>
        <CardDescription>Enter Encoded Text</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="Type your message here." onInput={(e) => onChange(e.currentTarget.value)} />
      </CardContent>
    </Card>
  </div>
}

function FrequencyAnalysis({ text }: { text: () => string }) {
  const [monograms, setMonograms] = createSignal<any>(null)
  createEffect(async () => {
    setMonograms(await CountMonograms(text()))
  }, text)
  const chartData: () => ChartData = () => ({
    labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    datasets: [
      {
        label: "Your Text",
        data: Object.values(monograms() ?? {}) ?? [],
        yAxisID: "y"
      },

      {
        label: "English",
        data: [8.167, 1.492, 2.202, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, .0153, 1.292, 4.025, 2.406, 6.749, 7.507, 1.929, .0095, 5.987, 6.327, 9.356, 2.758, .0978, 2.56, .015, 1.994, .0077],
        yAxisID: "y1"
      }
    ],
  })
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

  }
  return <div class="">
    <Card>
      <CardHeader>
        <CardTitle>Frequency Analysis</CardTitle>
        <CardDescription>Count the frequency of Monograms</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-96">
          <BarChart data={chartData()} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  </div>
}

function Output({ text }: { text: () => string }) {
  return <div class="">
    <Card>
      <CardHeader>
        <CardTitle>Output</CardTitle>
        <CardDescription>Decoded Text</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="">
          <p>{text()}</p>
        </div>
      </CardContent>
    </Card>
  </div>
}
function CaesarCipher({ onChange }: { onChange: (steps: number) => void }) {
  const [steps, setSteps] = createSignal(0)
  return <div class="">
    <Card>
      <CardHeader>
        <CardTitle>Caesar Cipher</CardTitle>
        <CardDescription>Encode/Decode</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col">
          <p class="ml-auto mr-0 mb-1">{steps()}</p>
          <Slider defaultValue={[0]} step={1} minValue={-26} maxValue={26} onChange={(e) => {
            onChange(e[0])
            setSteps(e[0])
          }}>
            <SliderTrack>
              <SliderFill />
              <SliderThumb />
            </SliderTrack>
          </Slider>
        </div>
      </CardContent>
    </Card>
  </div>
}

type FormatNodeSettings = {
  case: FormattingMode
}
function FormatNode({ onChange }: { onChange: (settings: FormatNodeSettings) => void }) {
  const [caseType, setCaseType] = createSignal<FormatNodeSettings["case"]>(FormattingMode.UnchangedCaseFormatting)

  function change() {
    onChange({
      case: caseType()
    })
  }

  return <div class="">
    <Card>
      <CardHeader>
        <CardTitle>Format</CardTitle>
        <CardDescription>Format Text</CardDescription>
      </CardHeader>
      <CardContent>
        <select onChange={(e) => {
          setCaseType(Number(e.currentTarget.value) as FormattingMode)
          change()
        }}>
          <option value={FormattingMode.UnchangedCaseFormatting}>default</option>
          <option value={FormattingMode.SentenceCaseFormatting}>Sentence case.</option>
          <option value={FormattingMode.UpperCaseFormatting}>UPPER CASE</option>
          <option value={FormattingMode.LowerCaseFormatting}>lower case</option>
        </select>
      </CardContent>
    </Card>
  </div>
}

export default App;
