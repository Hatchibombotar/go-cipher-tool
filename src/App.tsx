import { createSignal, For, onMount, Show } from "solid-js";
import { Workspace } from "./tools/Workspace/Workspace";
import { Transposition } from "./tools/Transposition";
import { InferSpacesTool } from "./tools/InferSpacesTool";
import { setCorpusMonograms, setCorpusRaw } from "./globalstate";
import { CountNGramsTool } from "./tools/CountNGramsTool";
import { FullAnalysis } from "./tools/FullAnalysis";
import { Substitutiton } from "./tools/Substitution";
import { Vigenere } from "./tools/Vigenere";
import { Shuffle } from "./tools/Shuffle";

declare let Ready: any

const tabs = ["workspace", "transposition", "infer-spaces", "count-n-grams", "full-analysis", "substitution", "vigenere", "shuffle"] as const

function App() {
  const [tab, setTab] = createSignal<typeof tabs[number]>("workspace")
  const [loadingMessage, setLoadingMessage] = createSignal<string | null>("Loading")


  async function load() {
    setLoadingMessage("waiting for go module")

    // wait for go module to load
    let interval;
    await new Promise<any>((resolve, reject) => {
      interval = setInterval(() => {
        if (typeof Ready != "undefined") {
          resolve(true)
        }
      }, 10)
    },)
    clearInterval(interval)

    setLoadingMessage("analysing corpus")

    const corpus = await GetRawCorpus()
    const corpusmonograms = await CountMonograms(corpus)

    setCorpusRaw(corpus)
    setCorpusMonograms(corpusmonograms)

    setLoadingMessage(null)
  }
  onMount(async () => {
    await load().catch(err => {
      setLoadingMessage("an error occured. refresh?")
    })
  })
  return (
    <div class="min-h-screen">
      <div class="mx-6 mt-3 group">
        <h1 class="group text-lg font-medium">
          <span>cipher-tool/</span>
          <span>{tab()}</span>
        </h1>
        <div class="flex gap-1 text-base">
          <span class="">tools:</span>
          <For each={tabs}>{(thistab) =>
            <button onClick={() => setTab(thistab)} classList={{ "underline": tab() == thistab }} class="hover:underline cursor-pointer">{thistab}</button>
          }</For>
        </div>
      </div>
      <hr class="mx-6 mt-2"></hr>
      <Show when={loadingMessage()}>
        <div class="bg-slate-50 p-4 flex items-center justify-center flex-col min-h-96">
          <h1 class="text-lg font-semibold">Loading...</h1>
          <p class="">{loadingMessage()}</p>
        </div>
      </Show>
      <Show when={!loadingMessage()}>
        <div class="bg-slate-50 p-4 flex">
          <Show when={tab() == "workspace"}>
            <Workspace />
          </Show>
          <Show when={tab() == "transposition"}>
            <Transposition />
          </Show>
          <Show when={tab() == "infer-spaces"}>
            <InferSpacesTool />
          </Show>
          <Show when={tab() == "count-n-grams"}>
            <CountNGramsTool />
          </Show>
          <Show when={tab() == "full-analysis"}>
            <FullAnalysis />
          </Show>
          <Show when={tab() == "substitution"}>
            <Substitutiton />
          </Show>
          <Show when={tab() == "vigenere"}>
            <Vigenere />
          </Show>
          <Show when={tab() == "shuffle"}>
            <Shuffle />
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default App;