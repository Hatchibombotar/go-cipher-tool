import { Textarea } from "~/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

import { For, type Setter, createEffect, createSignal, ErrorBoundary, Show } from "solid-js";
import { DecodeCaesarCipher, Format, DecodeSubsitutionCipher, DecodePolybiusCipher } from "../wailsjs/go/main/App";
import { FormatOptions, FormattingMode } from "./models";
import { SetStoreFunction, createStore } from "solid-js/store";
import { FaSolidAngleUp, FaSolidXmark, FaSolidAngleDown, FaSolidExclamation } from 'solid-icons/fa'
import { FormatNode, FormatNodeData } from "./nodes/Format";
import { Highlight, HighlightNodeData } from "./nodes/Highlight";
import { CaesarCipher, CaesarCipherNodeData } from "./nodes/CaesarCipher";
import { Output, OutputNodeData } from "./nodes/Output";
import { IndexOfCoincidence, IndexOfCoincidenceNodeData } from "./nodes/IndexOfCoincidence";
import { FrequencyAnalysis, FrequencyAnalysisNodeData } from "./nodes/FrequencyAnalysis";
import { SubstitutionCipher, SubstitutionCipherNodeData } from "./nodes/SubstitutionCipher";
import { panic, assertError } from "./utils";
import { PolybiusCipher, PolybiusCipherNodeData } from "./nodes/Polybius";

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
    PolybiusCipherNodeData |
    HighlightNodeData |
    IndexOfCoincidenceNodeData
  ) & {
    input?: number,
    error?: Error,
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


  const blockdata: Record<BlockData["type"], { title: string, description: string, component: (block: BlockData, data: () => string, index: () => number) => any, process?: (block: BlockData, previous: string) => Promise<string> }> = {
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
      process(block, previous) {
        return DecodeCaesarCipher(previous, (block as CaesarCipherNodeData).data.steps)
      }
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
      process(block, previous) {
        const subsitution_with_runes = Object.fromEntries(
          Object.entries((block as SubstitutionCipherNodeData).data.subsitution).map(([k, v]) => [k.charCodeAt(0), v.charCodeAt(0)])
        )
        return DecodeSubsitutionCipher(previous, subsitution_with_runes)
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
      process(block, previous) {
        const options: FormatOptions = {
          CaseMode: (block as FormatNodeData).data.case,
          RemoveUnknown: (block as FormatNodeData).data.removeUnknown
        }

        return Format(previous, options)
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
    },
    polybius_cipher: {
      title: "Polybius Cipher",
      description: "Decode",
      component(block, data, index) {
        return <PolybiusCipher text={data} onChange={(key) => {
          setStore("blocks", index(), {
            type: "polybius_cipher",
            data: {
              "key": key.join("")
            }
          })
        }} />
      },
      process: (block, input) => {
        console.log("hello?")
        return DecodePolybiusCipher(input, (block as PolybiusCipherNodeData).data.key)
      }
    }
  }

  async function processData(store: Store, setStore: SetStoreFunction<Store>, setDataStack: Setter<string[]>) {
    let datastack = [
      store.text
    ]
    for (const [blockindex, block] of store.blocks.entries()) {
      const block_data = blockdata[block.type]
      if (block_data && block_data.process) {
        const result = await block_data.process(
          block,
          datastack.at(-1) ?? panic()
        ).catch(
          assertError
        )

        if (result instanceof Error) {
          setStore("blocks", blockindex, {
            ...block,
            error: result,
          })
        } else {
          setStore("blocks", blockindex, {
            ...block,
            error: undefined,
          })
          datastack.push(
            result
          )
        }
      }
      setStore("blocks", blockindex, {
        ...block,
        input: datastack.length - 1
      })
    }
    console.log(JSON.stringify(store, null, 4))
    setDataStack(datastack)
  }

  processData(store, setStore, setDataStack)

  function confirmClear() {
    if (confirm("Remove all blocks from the workspace? This cannot be un-done.")) {
      setStore("blocks", [])
    }
  }

  return (
    <div class="bg-slate-50 p-4 min-h-screen">
      <WorkspaceSave />
      <div class="mb-4 -mt-1 flex gap-2">
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md" onClick={() => setSaveMenuOpen(true)}>Save Workspace</button>
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md">Load Workspace</button>
        <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md" onClick={confirmClear}>Clear Workspace</button>
      </div>
      <div class="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3">
        <InputNode onChange={(text) => setStore("text", text)} />
        <For each={store.blocks}>{(node, blockIndex) => {
          const data = () => dataStack().at(node.input ?? 0) ?? ""

          if (node.type in blockdata) {
            const thisblock = blockdata[node.type]
            return <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
              <Card>
                <CardHeader>
                  <div class="flex gap-1">
                    <CardTitle>{thisblock.title}</CardTitle>
                    <div class="ml-auto flex gap-1">
                      <Show when={node.error}>
                        <div class="p-1 bg-red-300 hover:bg-red-400 rounded-sm group relative">
                          <div class="hidden group-hover:block absolute top-full mt-1 left-0">
                            <p class="w-36 bg-neutral-200 rounded px-2 py-1">{
                              node.error?.message
                            }</p>
                          </div>
                          <FaSolidExclamation> </FaSolidExclamation>
                        </div>
                      </Show>
                      <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
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
                        <FaSolidXmark />
                      </button>
                    </div>
                  </div>
                  <CardDescription>{thisblock.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {thisblock.component(node, data, blockIndex)}
                </CardContent>
              </Card>
            </ErrorBoundary>
          }
        }}
        </For>

        <Card class="p-2 flex flex-row gap-2 h-min">
          <For each={Object.entries(blockdata)}>{([type, data]) =>
            <button type="button" class="group relative w-12" onClick={() => {
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
              <div class="hidden group-hover:flex group-focus:flex pt-3 absolute left-full ml-2 top-0 border z-20 bg-slate-200 p-2 rounded-lg h-12 w-auto">
                <p class="text-sm whitespace-nowrap font-semibold">{data.title}</p>
              </div>
            </button>
          }</For>
        </Card>
      </div>
    </div>
  );
}

const [saveMenuOpen, setSaveMenuOpen] = createSignal(false)
function WorkspaceSave() {
  return <div>
    <Dialog open={saveMenuOpen()} defaultOpen={saveMenuOpen()} onOpenChange={(s) => setSaveMenuOpen(s)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Workspace</DialogTitle>
          <DialogDescription class="flex flex-col gap-2 pt-2">
            <span>New Workspace</span>
            <div class="flex gap-2 w-full">
              <input class="border py-2 px-2 rounded-md w-full text-black" type="text" placeholder="Untitled Workspace"></input>
              <button class="text-white bg-black rounded-md px-4 py-2">Save</button>
            </div>
            <span>Existing Workspaces</span>
            <div class="border py-2 px-2 rounded-md hover:bg-neutral-100 cursor-pointer">
              <span class="text-black">
                Untitled Workspace
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
}

function InputNode({ onChange }: { onChange: (text: string) => void }) {
  return <div class="flex flex-col">
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