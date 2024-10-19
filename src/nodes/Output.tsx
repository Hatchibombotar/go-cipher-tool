import { BlockPrimitive, WorkspaceNodeInfo } from "~/tools/Workspace/blocks";

export interface OutputBlockData extends BlockPrimitive {
  type: "output"
}

export function Output({ text }: { text: () => string; }) {
  return <div class="">
    <div class="">
      <p>{text()}</p>
    </div>
  </div>;
}
export const info: WorkspaceNodeInfo<OutputBlockData> = {
  title: "Output",
  description: "Encode/Decode",
  component: Output,
}

export default info