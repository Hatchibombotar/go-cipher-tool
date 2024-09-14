import { BlockData } from "~/tools/Workspace/blocks";

export interface OutputBlockData extends BlockData {
  type: "output"
}

export function Output({ text }: { text: () => string; }) {
  return <div class="">
    <div class="">
      <p>{text()}</p>
    </div>
  </div>;
}
