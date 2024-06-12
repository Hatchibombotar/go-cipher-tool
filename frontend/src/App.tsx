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

import { For , createEffect, createSignal } from "solid-js";
import { CountMonograms, DecodeCaesarCipher, Format, MonogramIndexOfCoincidence } from "../wailsjs/go/main/App";
import { ChartData, ChartOptions } from "chart.js";
import { FormatOptions, FormattingMode } from "./models";
import { createStore } from "solid-js/store";
import { FaSolidXmark } from 'solid-icons/fa'

function panic(err: Error | string = "error"): never {
  throw err
}

type Store = {
  text: string,
  blocks: BlockData[],
}

type BlockData = (
  ({
    type: "frequency_analysis"
  } | {
    type: "caesar_cipher",
    data: {
      steps: number
    }
  } | {
    type: "format",
    data: {
      case: FormattingMode
    }
  } | {
    type: "output"
  }) & {
    input?: number
  }
)


function App() {
  const [store, setStore] = createStore<Store>({
    text: "Hello, World!",
    blocks: [
      {
        type: "format",
        data: {
          case: FormattingMode.LowerCaseFormatting
        }
      },
      {
        type: "frequency_analysis"
      },
      {
        type: "caesar_cipher",
        data: {
          steps: 0
        }
      },
      {
        type: "frequency_analysis",
      },
      {
        type: "format",
        data: {
          case: FormattingMode.SentenceCaseFormatting
        }
      },
      {
        type: "output",
      }
    ],
  })

  const [dataStack, setDataStack] = createSignal<string[]>([])

  let processDebounceTimer: number | null;

  createEffect(() => {
    // This is really disgusting, there should be another way of doing this.
    JSON.stringify(store.text)
    JSON.stringify(store.blocks)

    if (processDebounceTimer) clearTimeout(processDebounceTimer)
    processDebounceTimer = setTimeout(() => {
      processData()
      processDebounceTimer = null
    }, 100) as unknown as number
  })

  processData()

  async function processData() {
    let datastack = [
      store.text
    ]
    for (const [blockindex, block] of store.blocks.entries()) {
      if (block.type === "caesar_cipher") {
        datastack.push(
          await DecodeCaesarCipher(datastack.at(-1) ?? panic(), block.data.steps)
        )
      } else if (block.type === "format") {
        const options: FormatOptions = {
          CaseMode: block.data.case,
          RemoveUnknown: false
        }

        datastack.push(
          await Format(datastack.at(-1) ?? panic(), options)
        )
      }
      console.log(datastack.length)
      setStore("blocks", blockindex, {
        ...block,
        input: datastack.length - 1
      })
    }
    console.log(JSON.stringify(store, null, 4))
    setDataStack(datastack)
  }

  const blockdata: Record<string, { title: string, description: string, component: (block: BlockData, data: () => string, index: () => number) => any }> = {
    frequency_analysis: {
      title: "Frequency Analysis",
      description: "Count the frequency of Monograms",
      component: (block, data) => {
        return <FrequencyAnalysis text={data} />
      }
    },
    index_of_coincidence: {
      title: "Index of Coincidence",
      description: "Calculate the index of coinidence for the input text. Typical for English: 1.75",
      component: (block, data) => {
        return <IndexOfCoincidence text={data} />
      }
    },
    caesar_cipher: {
      title: "Caesar Cipher",
      description: "Encode/Decode",
      component(block, data, index) {
        return <CaesarCipher onChange={(n) => {
          setStore("blocks", index(), {
            type: "caesar_cipher",
            data: {
              steps: n
            }
          })
        }} />
      },
    },
    format: {
      title: "Format",
      description: "Format Text",
      component(block, data, index) {
        return <FormatNode onChange={(settings) => {
          setStore("blocks", index(), {
            type: "format",
            data: {
              case: settings.case
            }
          })
        }} />
      },
    },
    output: {
      title: "Output",
      description: "Decoded Text",
      component(block, data, index) {
        return <Output text={data} />
      },
    }
  }

  return (
    <div class="p-6 flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 bg-white">
      <InputNode onChange={(text) => setStore("text", text)} />
      <For each={store.blocks}>{(node, blockIndex) => {
        const data = () => dataStack().at(node.input ?? 0) ?? ""

        if (node.type in blockdata) {
          const thisblock = blockdata[node.type]
          return <Card>
            <CardHeader>
              <div class="flex gap-1">
                <CardTitle>{thisblock.title}</CardTitle>
                <button type="button" class="ml-auto p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                  const oldIndex = blockIndex()
                  const newIndex = Math.max(oldIndex - 1, 0)
                  const new_store_data = store.blocks.filter((_, index) => index != oldIndex)
                  new_store_data.splice(newIndex, 0, node)
                  setStore("blocks", new_store_data)
                }}>
                  {/* <FaSolidAngleUp> </FaSolidAngleUp> */}
                  ^
                </button>
                <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                  const oldIndex = blockIndex()
                  const newIndex = Math.min(oldIndex + 1, store.blocks.length - 1)
                  const new_store_data = store.blocks.filter((_, index) => index != oldIndex)
                  new_store_data.splice(newIndex, 0, node)
                  setStore("blocks", new_store_data)
                }}>
                  {/* <FaSolidAngleDown></FaSolidAngleDown> */}
                  v
                </button>
                <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                  setStore("blocks", store.blocks.filter((_, index) => index != blockIndex()))
                }}>
                  {/* <FaSolidXmark class="" size={10} /> */}
                  x
                </button>
              </div>
              <CardDescription>{thisblock.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {thisblock.component(node, data, blockIndex)}
            </CardContent>
          </Card>
        }
      }}
      </For>

      <Card class="p-2 flex flex-row gap-2 h-min">
        <For each={Object.entries(blockdata)}>{([type, data]) =>
          <div class="group relative w-12" onClick={() => {
            const object: Partial<BlockData> = {
              type: type as BlockData["type"],
            }
            if (object.type == "caesar_cipher") {
              object.data = {
                steps: 0
              }
            } else if (object.type == "format") {
              object.data = {
                case: FormattingMode.UnchangedCaseFormatting
              }
            }
            setStore("blocks", store.blocks.length, object)
          }}>
            <div class="border hover:bg-slate-100 cursor-pointer rounded-lg h-12 w-12"></div>
            <div class="hidden group-hover:flex pt-3 absolute left-full ml-2 top-0 border z-20 bg-slate-200 p-2 rounded-lg h-12 w-auto">
              <p class="text-sm whitespace-nowrap font-semibold">{data.title}</p>
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
    <div class="h-96">
      <BarChart data={chartData()} options={chartOptions} />
    </div>
  </div>
}


function IndexOfCoincidence({ text }: { text: () => string }) {
  const [ioc, setIoc] = createSignal(0)
  createEffect(async () => {
    setIoc(
      await MonogramIndexOfCoincidence(text())
    )
  })

  return <div class="">
    <div class="h-96">
      <p class="font-semibold text-lg">
        {ioc()}
      </p>
    </div>
  </div>
}


function Output({ text }: { text: () => string }) {
  return <div class="">
    <div class="">
      <p>{text()}</p>
    </div>
  </div>
}
function CaesarCipher({ onChange }: { onChange: (steps: number) => void }) {
  const [steps, setSteps] = createSignal(0)
  return <div class="">
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
    <select onChange={(e) => {
      setCaseType(Number(e.currentTarget.value) as FormattingMode)
      change()
    }}>
      <option value={FormattingMode.UnchangedCaseFormatting}>default</option>
      <option value={FormattingMode.SentenceCaseFormatting}>Sentence case.</option>
      <option value={FormattingMode.UpperCaseFormatting}>UPPER CASE</option>
      <option value={FormattingMode.LowerCaseFormatting}>lower case</option>
    </select>
  </div>
}

export default App;