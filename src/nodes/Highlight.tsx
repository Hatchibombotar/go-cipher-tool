import { createSignal } from "solid-js";
import { BlockData } from "~/tools/Workspace/blocks";

export interface HighlightBlockData extends BlockData {
  type: "highlight"
}

export function Highlight({ text }: { text: () => string; }) {
  const [highlighted, setHighlighted] = createSignal("");
  return <div class="">
    <input class="border" value={highlighted()} onInput={(e) => setHighlighted(e.currentTarget.value)}></input>
    <div class="">
      <p class="overflow-hidden max-w-full break-all">{(
        () => {
          return [...text()].map(
            (char) => {
              return <span
                classList={{ "bg-yellow-500": highlighted().includes(char) }}
              >{char}</span>;
            }
          );
        }
      )()}</p>
    </div>
  </div>;
}
