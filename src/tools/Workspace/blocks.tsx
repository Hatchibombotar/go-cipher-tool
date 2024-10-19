import { produce, SetStoreFunction } from "solid-js/store";
import { panic, assertError } from "../../utils";
import { JSX, Setter } from "solid-js";

import AffineNode, { AffineCipherBlockData } from "~/nodes/AffineCipher";
import OutputNode, { OutputBlockData } from "~/nodes/Output";
import CaesarCipherNode, { CaesarCipherBlockData } from "~/nodes/CaesarCipher";
import FrequencyAnalysisNode, { FrequencyAnalysisBlockData } from "~/nodes/FrequencyAnalysis";
import NGramAnalysisNode, { NGramBlockData } from "~/nodes/NGramAnalysis";
import IndexOfCoincidence, { IndexOfCoincidenceBlockData } from "~/nodes/IndexOfCoincidence";
import SubstitutionCipher, { SubstitutionCipherBlockData } from "~/nodes/SubstitutionCipher";
import FormatNode, { FormatBlockData } from "~/nodes/Format";
import PolybiusNode, { PolybiusCipherBlockData } from "~/nodes/Polybius";
import Highlight, { HighlightBlockData } from "~/nodes/Highlight";
import InferSpaces, { InferSpacesBlockData } from "~/nodes/InferSpaces";

export const nodeRecord = {
  output: OutputNode,
  affine_cipher: AffineNode,
  caesar_cipher: CaesarCipherNode,
  frequency_analysis: FrequencyAnalysisNode,
  count_n_grams: NGramAnalysisNode,
  index_of_coincidence: IndexOfCoincidence,
  substitution_cipher: SubstitutionCipher,
  format: FormatNode,
  polybius_cipher: PolybiusNode,
  highlight: Highlight,
  infer_spaces: InferSpaces
}

export type Block =
  (
    OutputBlockData |
    AffineCipherBlockData |
    CaesarCipherBlockData |
    FrequencyAnalysisBlockData |
    NGramBlockData |
    IndexOfCoincidenceBlockData |
    SubstitutionCipherBlockData | 
    FormatBlockData |
    PolybiusCipherBlockData |
    HighlightBlockData |
    InferSpacesBlockData
  ) & BlockPrimitive

export type Store = {
  text: string,
  blocks: Block[],
}


// TODO: extend block or block data?
export type WorkspaceNodeInfo<T extends BlockPrimitive> = {
  title: string,
  description: string,
  component: (props: WorkspaceNodeProps<T>) => JSX.Element,
  process?: (block: T, previous: string, index: number, setter: (func: (block: T) => void) => void ) => Promise<string>,
  init?: () => T["data"] // TODO: should this be just to T?
}

export type WorkspaceNodeProps<T extends BlockPrimitive> = {
  block: T,
  setter: (func: (block: T) => void) => void,
  text: () => string
}

export interface BlockPrimitive {
  // type: BlockType,
  input?: number,
  data?: any,
  error?: Error,
}


export type BlockType = (keyof typeof nodeRecord)

export async function processData(store: Store, setStore: SetStoreFunction<Store>, setDataStack: Setter<string[]>) {
  let datastack = [
    store.text
  ]
  for (const [blockindex, block] of store.blocks.entries()) {
    const block_data = nodeRecord[block.type]
    if (block_data == null || block_data.process == null) {
      setStore("blocks", blockindex, {
        ...block,
        input: datastack.length - 1
      })
      continue
    }
    
    const result = await block_data.process(
      block as any,
      datastack.at(-1) ?? panic(),
      blockindex,
      (state) => setStore("blocks", blockindex, produce(state as any))
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
    setStore("blocks", blockindex, {
      ...block,
      input: datastack.length - 1
    })
  }
  console.log(JSON.stringify(store, null, 4))
  console.log(datastack)
  setDataStack(datastack)
}