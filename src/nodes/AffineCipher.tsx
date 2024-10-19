import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";
import { createEffect, createSignal, Show } from "solid-js";
import { BlockData } from "~/tools/Workspace/blocks";

export interface AffineCipherBlockData extends BlockData {
  type: "affine_cipher",
  data: {
    a: number,
    b: number,
    type: "decode" | "encode"
    auto_solve: boolean
  }
}


export function AffineCipher({ block, setBlockData }: { block: AffineCipherBlockData, setBlockData: (block: AffineCipherBlockData["data"]) => void }) {
  const [a, setA] = createSignal(block.data.a)
  const [b, setB] = createSignal(block.data.b)
  const [mode, setMode] = createSignal(block.data.type)
  const [autoSolve, setAutoSolve] = createSignal(block.data.auto_solve)


  function update() {
    if (autoSolve() && mode() == "decode") {
      if (block.data.a != a()) {
        setA(block.data.a)
      }
      if (block.data.a != b()) {
        setB(block.data.b)
      }
    }
    setBlockData({
      a: a(),
      b: b(),
      auto_solve: autoSolve(),
      type: mode()
    })
  }

  createEffect(update)

  return <div class="">
    <div class="bg-slate-200 w-min flex gap-1 p-1 rounded-md mb-4">
      <button class="px-2 py-1 rounded-md font-medium text-sm" classList={{ "bg-white": mode() == "encode" }} onClick={() => setMode("encode")}>Encode</button>
      <button class="px-2 py-1 rounded-md font-medium text-sm" classList={{ "bg-white": mode() == "decode" }} onClick={() => setMode("decode")}>Decode</button>
    </div>
    <div class="flex gap-3">
      <label class="whitespace-nowrap">
        <span class="mr-2">A:</span>
        <input type="number" class="border my-2 rounded w-12 h-8 px-1" disabled={mode() == "decode" && autoSolve()} min={1} max={25} step={2} value={a()} onInput={async (e) => setA(e.currentTarget.valueAsNumber ?? 1)}></input>
      </label>
      <label class="whitespace-nowrap">
        <span class="mr-2">B:</span>
        <input type="number" class="border my-2 rounded w-12 h-8 px-1" disabled={mode() == "decode" && autoSolve()} min={0} max={25} value={b()} onInput={async (e) => setB(e.currentTarget.valueAsNumber ?? 0)}></input>
      </label>
      <Show when={mode() == "decode"}>
        <Switch class="flex items-center gap-2" onChange={(isChecked) => setAutoSolve(isChecked)} defaultChecked={autoSolve()}>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Auto Solve</SwitchLabel>
        </Switch>
      </Show>
    </div>

  </div>
}
