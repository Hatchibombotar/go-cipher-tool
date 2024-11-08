import { BlockPrimitive, WorkspaceNodeInfo } from "~/tools/Workspace/blocks";

export interface OutputBlockData extends BlockPrimitive {
  type: "output",
}

export function Output({ text }: { text: () => string; }) {
  return <div class="">
    <div class="">
      <textarea readOnly class="w-full h-96">{text()}</textarea>
    </div>
  </div>;
}
export const info: WorkspaceNodeInfo<OutputBlockData> = {
  title: "Output",
  description: "Encode/Decode",
  component: Output,
}

export default info