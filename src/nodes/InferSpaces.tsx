import { BlockPrimitive, WorkspaceNodeInfo } from "~/tools/Workspace/blocks";

export interface InferSpacesBlockData extends BlockPrimitive {
  type: "infer_spaces"
}

function InferSpacesNode() {
  return <div>
    <p class="text-sm text-neutral-800">There are no options avaliable for this block.</p>
  </div>
}

export default {
  title: "Infer Spaces",
  description: "Insert spaces into text without them by guessing based on the most probable string of words.",
  component: InferSpacesNode,
  process: async (_block, previous) => {
    return InferSpaces(previous)
  }
} as WorkspaceNodeInfo<InferSpacesBlockData>