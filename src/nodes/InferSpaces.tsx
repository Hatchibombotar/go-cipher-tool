import { BlockData } from "~/tools/Workspace/blocks";

export interface InferSpacesBlockData extends BlockData {
  type: "infer_spaces"
}

export function InferSpacesNode() {
  return <div>
    {/* <FaSolidShuttleSpace/> */}
    <p class="text-sm text-neutral-800">There are no options avaliable for this block.</p>
  </div>
}
