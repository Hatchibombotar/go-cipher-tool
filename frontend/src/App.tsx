import { createSignal, Show } from "solid-js";
import { Workspace } from "./Workspace";
import { Transposition } from "./Transposition";
import { WiRefresh } from 'solid-icons/wi'
function App() {
  const [tab, setTab] = createSignal<"workspace" | "transposition">("workspace")
  return (
    <div class="min-h-screen">
      <div class="h-10 bg-slate-300 flex gap-2 px-2">
        <div class="flex items-center justify-center font-bold mx-3 mt-1 text-sm">
          <p>Cipher Tool</p>
        </div>
        <button onClick={() => setTab("workspace")} class="bg-slate-200 mt-2 px-4 text-center text-sm font-semibold rounded-t-lg" classList={{"!bg-slate-50": tab() == "workspace"}}>Cipher Workspace</button>
        <button onClick={() => setTab("transposition")} class="bg-slate-200 mt-2 px-4 text-center text-sm font-semibold rounded-t-lg" classList={{"!bg-slate-50": tab() == "transposition"}}>Transposition</button>
        <button class="ml-auto h-full aspect-square" onClick={() => window.location.reload()}>
          <WiRefresh class="h-8 w-8"/>
        </button>
      </div>
      <div class="bg-slate-50 p-4 flex">
        <Show when={tab() == "workspace"}>
          <Workspace/>
        </Show>
        <Show when={tab() == "transposition"}>
          <Transposition/>
        </Show>
      </div>
    </div>
  );
}

export default App;