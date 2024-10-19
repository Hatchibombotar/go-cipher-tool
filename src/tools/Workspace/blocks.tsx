import { FormatOptions, FormattingMode } from "../../gofunctiontypes";
import { SetStoreFunction, createStore } from "solid-js/store";
import { FormatNode, FormatBlockData } from "../../nodes/Format";
import { Highlight, HighlightBlockData } from "../../nodes/Highlight";
import { CaesarCipher, CaesarCipherBlockData } from "../../nodes/CaesarCipher";
import { Output, OutputBlockData } from "../../nodes/Output";
import { IndexOfCoincidence, IndexOfCoincidenceBlockData } from "../../nodes/IndexOfCoincidence";
import { FrequencyAnalysis, FrequencyAnalysisBlockData } from "../../nodes/FrequencyAnalysis";
import { SubstitutionCipher, SubstitutionCipherBlockData } from "../../nodes/SubstitutionCipher";
import { panic, assertError, Store } from "../../utils";
import { PolybiusCipher, PolybiusCipherBlockData } from "../../nodes/Polybius";
import { InferSpacesBlockData, InferSpacesNode } from "../../nodes/InferSpaces";
import { Setter } from "solid-js";
import { NGramAnalysis, NGramBlockData } from "~/nodes/NGramAnalysis";
import { AffineCipher, AffineCipherBlockData } from "~/nodes/AffineCipher";

export interface BlockData {
  type: BlockType,
  input?: number,
  data?: any,
  error?: Error,
}

export type Block = FrequencyAnalysisBlockData |
  CaesarCipherBlockData |
  SubstitutionCipherBlockData |
  FormatBlockData |
  OutputBlockData |
  PolybiusCipherBlockData |
  HighlightBlockData |
  IndexOfCoincidenceBlockData |
  InferSpacesBlockData |
  NGramBlockData |
  AffineCipherBlockData

export type BlockType = Block["type"]

export const getBlockData: (store: Store, setStore: SetStoreFunction<Store>) => Record<BlockData["type"], { title: string, description: string, component: (block: BlockData, data: () => string, index: () => number) => any, process?: (block: Block, previous: string, index: number) => Promise<string>, init?: () => any }> = (_store, setStore) => ({
  frequency_analysis: {
    title: "Frequency Analysis",
    description: "Count the frequency of Monograms",
    component: (_block, data) => {
      return <FrequencyAnalysis text={data} />
    }
  },
  count_n_grams: {
    title: "Count N Grams",
    description: "Count the frequency of NGrams",
    component: (block, data) => {
      return <NGramAnalysis block={block as NGramBlockData} text={data} />
    },
    init() {
      return {
        type: "count_n_grams",
        size: 2,
      } as NGramBlockData
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
      } as IndexOfCoincidenceBlockData)

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
    component(block, _data, index) {
      return <FormatNode defaultOptions={(block as FormatBlockData).data} onChange={(settings) => {
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
  infer_spaces: {
    title: "Infer Spaces",
    description: "Insert spaces into text without them by guessing based on the most probable words.",
    component(_block, _data, index) {
      return <InferSpacesNode />
    },
    process(block, previous) {
      return InferSpaces(previous)
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
  },
  affine_cipher: {

    title: "Affine Cipher",
    description: "Encode/Decode",
    component(block, _data, index) {
      return <AffineCipher block={block as AffineCipherBlockData} setBlockData={(data) => {
        setStore("blocks", index(), "data", data)
      }}
      />
    },
    async process(block, previous, index) {
      block as AffineCipherBlockData
      const data = (block as AffineCipherBlockData).data
      if (data.type == "encode") {
        return EncodeAffineCipher(previous, data.a, data.b)
      } else {
        if (data.auto_solve) {
          const [a, b] = await AttemptCrackAffineCipher(previous)
          setStore("blocks", index, "data", "a", a)
          setStore("blocks", index, "data", "b", b)
          return DecodeAffineCipher(previous, a, b)
        } else {
          return DecodeAffineCipher(previous, data.a, data.b)
        }
      }
      // return DecodeCaesarCipher(previous, (block as CaesarCipherBlockData).data.steps)
    },
    init() {
      return {
        a: 1,
        b: 0,
        type: "encode",
        auto_solve: true
      } as AffineCipherBlockData["data"]
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