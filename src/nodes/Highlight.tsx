import { createSignal } from "solid-js";
import { BlockPrimitive, WorkspaceNodeInfo, WorkspaceNodeProps } from "~/tools/Workspace/blocks";

export interface HighlightBlockData extends BlockPrimitive {
  type: "highlight"
}

function Highlight({ text }: WorkspaceNodeProps<HighlightBlockData>) {
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

export default {
  title: "Highlight",
  description: "Highlight text",
  component: Highlight
} as WorkspaceNodeInfo<HighlightBlockData>