import { createEffect, createSignal, For } from "solid-js";
import { BlockPrimitive, WorkspaceNodeInfo, WorkspaceNodeProps } from "~/tools/Workspace/blocks";
import { corpusNGrams, corpusRaw, setCorpusNGrams } from "~/globalstate";

export interface NGramBlockData extends BlockPrimitive {
  type: "count_n_grams",
  ngrams: Record<string, number>
  data: {
    size: number,
  }
}

export function NGramAnalysis({ text, block, setter }: WorkspaceNodeProps<NGramBlockData>) {
  const [ngrams, setNGrams] = createSignal<Record<string, number>>({});
  const [ngramSize, setNGramSize] = createSignal(block.data.size ?? 2)

  createEffect(async () => {
    setter((block) => {
      block.data.size = ngramSize()
    })
    await initNGramsIfNotDone(ngramSize())

    setNGrams(await CountNGrams(text(), ngramSize()));
  });

  async function initNGramsIfNotDone(n: number) {
    n ??= 0
    n = Math.floor(n)
    if (!(n in corpusNGrams())) {
      const prev = corpusNGrams()
      prev[n] = await CountNGrams(corpusRaw(), n)
      setCorpusNGrams({ ...prev })
    }
    return true
  }

  const ngramTotal = () => Object.values(block.ngrams).reduce((prev, current) => prev + current, 0)

  return <div class="">
    <input type="number" class="border my-2 rounded w-8 h-8 text-center" min={1} value={ngramSize()} onInput={async (e) => setNGramSize(e.currentTarget.valueAsNumber)}></input>

    <div class="h-96 overflow-auto">
      <table class="ngram-table">
        <tbody>
          <tr>
            <th>ngram</th>
            <th>input (n)</th>
            <th>input (%)</th>
            <th>corpus (%)</th>
          </tr>
          <For each={Object.entries(block.ngrams).toSorted(([, a], [, b]) => b - a)}>{([k, v]) =>
            <tr>
              <td>{k}</td>
              <td>{v}</td>
              <td>{Math.round(v / ngramTotal() * 100 * 100) / 100}</td>
              <td>{((corpusNGrams() ?? {})[ngramSize()] ?? {})[k] ?? 0}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  </div>;
}

export default {
  title: "Count N Grams",
  description: "Encode/Decode",
  component: NGramAnalysis,
  init() {
    return {
      size: 2
    }
  },
  async process(block, previous, index, setter) {
    const ngrams = await CountNGrams(previous, block.data.size ?? 2)
    setter((block) => {
      block.ngrams = ngrams
    })
    return previous
  },
} as WorkspaceNodeInfo<NGramBlockData>