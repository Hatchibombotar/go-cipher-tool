import { For, type Setter, createEffect, createSignal, ErrorBoundary, Show } from "solid-js";
import { DecodeCaesarCipher, Format, DecodeSubsitutionCipher, DecodePolybiusCipher, MonogramIndexOfCoincidence } from "../wailsjs/go/main/App";
import { FormatOptions, FormattingMode } from "./models";
import { SetStoreFunction, createStore } from "solid-js/store";
import { FaSolidAngleUp, FaSolidXmark, FaSolidAngleDown, FaSolidExclamation } from 'solid-icons/fa'
import { FormatNode, FormatBlockData } from "./nodes/Format";
import { Highlight, HighlightBlockData } from "./nodes/Highlight";
import { CaesarCipher, CaesarCipherBlockData } from "./nodes/CaesarCipher";
import { Output, OutputBlockData } from "./nodes/Output";
import { IndexOfCoincidence, IndexOfCoincidenceBlockData } from "./nodes/IndexOfCoincidence";
import { FrequencyAnalysis, FrequencyAnalysisBlockData } from "./nodes/FrequencyAnalysis";
import { SubstitutionCipher, SubstitutionCipherBlockData } from "./nodes/SubstitutionCipher";
import { panic, assertError, Store } from "./utils";
import { PolybiusCipher, PolybiusCipherBlockData } from "./nodes/Polybius";

export type BlockType = "frequency_analysis" | "polybius_cipher" | "highlight" | "caesar_cipher" | "format" | "index_of_coincidence" | "output" | "substitution_cipher"
export interface BlockData {
  type: BlockType,
  input?: number,
  error?: Error,
}

export type Block = FrequencyAnalysisBlockData |
  CaesarCipherBlockData |
  SubstitutionCipherBlockData |
  FormatBlockData |
  OutputBlockData |
  PolybiusCipherBlockData |
  HighlightBlockData |
  IndexOfCoincidenceBlockData

export const getBlockData: (store: Store, setStore: any) => Record<BlockData["type"], { title: string, description: string, component: (block: BlockData, data: () => string, index: () => number) => any, process?: (block: BlockData, previous: string, index: number) => Promise<string>, init?: () => any }> = (_store, setStore) => ({
  frequency_analysis: {
    title: "Frequency Analysis",
    description: "Count the frequency of Monograms",
    component: (_block, data) => {
      return <FrequencyAnalysis text={data} />
    }
  },
  index_of_coincidence: {
    title: "Index of Coincidence",
    description: "Calculate the index of coinidence for the input text. Typical for English: 1.75",
    component: (block, data) => {
      return <IndexOfCoincidence text={data} block={block as IndexOfCoincidenceBlockData} />
    },
    async process(block, previous, index) {
      const ioc = await MonogramIndexOfCoincidence(previous);
      setStore("blocks", index, {
        ...block,
        data: {
          ioc
        }
      })

      return previous
    },
    init() {
      return {
        ioc: 0
      }
    }
  },
  caesar_cipher: {
    title: "Caesar Cipher",
    description: "Encode/Decode",
    component(_block, _data, index) {
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
      return DecodeCaesarCipher(previous, (block as CaesarCipherBlockData).data.steps)
    },
    init() {
      return {
        steps: 0
      }
    }
  },
  substitution_cipher: {
    title: "Substitution Cipher",
    description: "Encode/Decode",
    component(_block, data, index) {
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
        Object.entries((block as SubstitutionCipherBlockData).data.subsitution).map(([k, v]) => [k.charCodeAt(0), v.charCodeAt(0)])
      )
      return DecodeSubsitutionCipher(previous, subsitution_with_runes)
    },
  },
  format: {
    title: "Format",
    description: "Format Text",
    component(_block, _data, index) {
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
        CaseMode: (block as FormatBlockData).data.case,
        RemoveUnknown: (block as FormatBlockData).data.removeUnknown
      }

      return Format(previous, options)
    },
    init() {
      return {
        case: FormattingMode.UnchangedCaseFormatting,
        removeUnknown: false
      }
    }
  },
  output: {
    title: "Output",
    description: "Decoded Text",
    component(_block, data, _index) {
      return <Output text={data} />
    },
  },
  highlight: {
    title: "Highlight",
    description: "Highlight Text",
    component(_block, data, _index) {
      return <Highlight text={data} />
    },
  },
  polybius_cipher: {
    title: "Polybius Cipher",
    description: "Decode",
    component(_block, data, index) {
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
      return DecodePolybiusCipher(input, (block as PolybiusCipherBlockData).data.key)
    }
  }
})

export async function processData(store: Store, setStore: SetStoreFunction<Store>, setDataStack: Setter<string[]>) {
  const blockdata = getBlockData(store, setStore)
  let datastack = [
    store.text
  ]
  for (const [blockindex, block] of store.blocks.entries()) {
    const block_data = blockdata[block.type]
    if (block_data && block_data.process) {
      const result = await block_data.process(
        block,
        datastack.at(-1) ?? panic(),
        blockindex
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