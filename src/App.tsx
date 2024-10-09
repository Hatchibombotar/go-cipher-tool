import { createContext, createSignal, onMount, Show } from "solid-js";
import { Workspace } from "./tools/Workspace/Workspace";
import { Transposition } from "./tools/Transposition";
import { InferSpacesTool } from "./tools/InferSpacesTool";
import { setCorpusMonograms, setCorpusRaw } from "./globalstate";

declare let Ready: any

function App() {
  const [tab, setTab] = createSignal<"workspace" | "transposition" | "infer-spaces">("workspace")
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
          <button onClick={() => setTab("workspace")} classList={{ "underline": tab() == "workspace" }} class="hover:underline cursor-pointer">workspace</button>
          <button onClick={() => setTab("transposition")} classList={{ "underline": tab() == "transposition" }} class="hover:underline cursor-pointer">transposition</button>
          <button onClick={() => setTab("infer-spaces")} classList={{ "underline": tab() == "infer-spaces" }} class="hover:underline cursor-pointer">infer-spaces</button>
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
        </div>
      </Show>
    </div>
  )
}

export default App;