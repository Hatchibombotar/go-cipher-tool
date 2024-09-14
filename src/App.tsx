import { createSignal, Show } from "solid-js";
import { Workspace } from "./tools/Workspace/Workspace";
import { Transposition } from "./tools/Transposition";
import { InferSpacesTool } from "./tools/InferSpacesTool";

function App() {
  const [tab, setTab] = createSignal<"workspace" | "transposition" | "infer-spaces">("workspace")
  return (
    <div class="min-h-screen">
      <div class="mx-6 mt-3 group">
        <h1 class="group text-lg font-medium">
          <span>cipher-tool/</span>
          <span>{tab()}</span>
        </h1>
        <div class="flex gap-1 text-base">
          <span class="">tools:</span>
          <button onClick={() => setTab("workspace")} classList={{"underline": tab() == "workspace"}} class="hover:underline cursor-pointer">workspace</button>
          <button onClick={() => setTab("transposition")} classList={{"underline": tab() == "transposition"}} class="hover:underline cursor-pointer">transposition</button>
          <button onClick={() => setTab("infer-spaces")} classList={{"underline": tab() == "infer-spaces"}} class="hover:underline cursor-pointer">infer-spaces</button>
        </div>
      </div>
      <hr class="mx-6 mt-2"></hr>
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
    </div>
  );
}

export default App;