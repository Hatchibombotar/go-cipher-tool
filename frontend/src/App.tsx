import { Textarea } from "~/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card"

import { For, Setter, createEffect, createSignal } from "solid-js";
import { DecodeCaesarCipher, Format, DecodeSubsitutionCipher } from "../wailsjs/go/main/App";
import { FormatOptions, FormattingMode } from "./models";
import { SetStoreFunction, createStore } from "solid-js/store";
import { FaSolidAngleUp, FaSolidXmark, FaSolidAngleDown } from 'solid-icons/fa'
import { FormatNode, FormatNodeData } from "./nodes/Format";
import { Highlight, HighlightNodeData } from "./nodes/Highlight";
import { CaesarCipher, CaesarCipherNodeData } from "./nodes/CaesarCipher";
import { Output, OutputNodeData } from "./nodes/Output";
import { IndexOfCoincidence } from "./nodes/IndexOfCoincidence";
import { FrequencyAnalysis, FrequencyAnalysisNodeData } from "./nodes/FrequencyAnalysis";
import { SubstitutionCipher, SubstitutionCipherNodeData } from "./nodes/SubstitutionCipher";
import { panic } from "./utils";

type Store = {
  text: string,
  blocks: BlockData[],
}

type BlockData = (
  (
    FrequencyAnalysisNodeData |
    CaesarCipherNodeData |
    SubstitutionCipherNodeData |
    FormatNodeData |
    OutputNodeData |
    HighlightNodeData
  ) & {
    input?: number
  }
)

const example_workspace_caesar: Store = {
  text: "Hello, World!",
  blocks: [
    {
      type: "format",
      data: {
        case: FormattingMode.LowerCaseFormatting,
        removeUnknown: true,
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
        case: FormattingMode.SentenceCaseFormatting,
        removeUnknown: true
      }
    },
    {
      type: "output",
    }
  ],
}
const example_workspace_substitution: Store = {
  "text": "Hello, World!",
  "blocks": [
    {
      type: "substitution_cipher",
      data: {
        subsitution: {}
      }
    },
    {
      "type": "output"
    }
  ]
}

async function processData(store: Store, setStore: SetStoreFunction<Store>, setDataStack: Setter<string[]>) {
  let datastack = [
    store.text
  ]
  for (const [blockindex, block] of store.blocks.entries()) {
    if (block.type === "caesar_cipher") {
      datastack.push(
        await DecodeCaesarCipher(datastack.at(-1) ?? panic(), block.data.steps)
      )
    } else if (block.type === "substitution_cipher") {
      const subsitution_with_runes = Object.fromEntries(
        Object.entries(block.data.subsitution).map(([k, v]) => [k.charCodeAt(0), v.charCodeAt(0)])
      )
      datastack.push(
        await DecodeSubsitutionCipher(datastack.at(-1) ?? panic(), subsitution_with_runes)
      )

    } else if (block.type === "format") {
      const options: FormatOptions = {
        CaseMode: block.data.case,
        RemoveUnknown: block.data.removeUnknown
      }

      datastack.push(
        await Format(datastack.at(-1) ?? panic(), options)
      )
    }
    setStore("blocks", blockindex, {
      ...block,
      input: datastack.length - 1
    })
  }
  console.log(JSON.stringify(store, null, 4))
  setDataStack(datastack)
}

function App() {
  const [store, setStore] = createStore<Store>(example_workspace_caesar)

  const [dataStack, setDataStack] = createSignal<string[]>([])

  let processDebounceTimer: number | null;

  createEffect(() => {
    // This is really disgusting, there should be another way of doing this.
    JSON.stringify(store.text)
    JSON.stringify(store.blocks)

    if (processDebounceTimer) clearTimeout(processDebounceTimer)
    processDebounceTimer = setTimeout(() => {
      processData(store, setStore, setDataStack)
      processDebounceTimer = null
    }, 100) as unknown as number
  })

  processData(store, setStore, setDataStack)


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
    substitution_cipher: {
      title: "Substitution Cipher",
      description: "Encode/Decode",
      component(block, data, index) {
        return <SubstitutionCipher onChange={(substitution) => {
          setStore("blocks", index(), {
            type: "substitution_cipher",
            data: {
              subsitution: substitution
            }
          })
        }}
          text={data}
        />
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
              case: settings.case,
              removeUnknown: settings.removeUnknown
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
    },
    highlight: {
      title: "Highlight",
      description: "Highlight Text",
      component(block, data, index) {
        return <Highlight text={data} />
      },
    }
  }

  return (
    <div class="bg-slate-50 p-4">
      <div class="mb-4 flex gap-2">
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md">Save Workspace</button>
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md">Load Workspace</button>
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md">Clear Workspace</button>
      </div>
      <div class="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3">
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
                    <FaSolidAngleUp> </FaSolidAngleUp>
                  </button>
                  <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                    const oldIndex = blockIndex()
                    const newIndex = Math.min(oldIndex + 1, store.blocks.length - 1)
                    const new_store_data = store.blocks.filter((_, index) => index != oldIndex)
                    new_store_data.splice(newIndex, 0, node)
                    setStore("blocks", new_store_data)
                  }}>
                    <FaSolidAngleDown></FaSolidAngleDown>
                  </button>
                  <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                    setStore("blocks", store.blocks.filter((_, index) => index != blockIndex()))
                  }}>
                    <FaSolidXmark  />
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
                  case: FormattingMode.UnchangedCaseFormatting,
                  removeUnknown: false
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

export default App;