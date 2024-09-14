import { BlockData } from "~/tools/Workspace/blocks";

export interface IndexOfCoincidenceBlockData extends BlockData {
  type: "index_of_coincidence",
  data: {
    ioc: number
  }
}

export function IndexOfCoincidence({ text, block }: { text: () => string, block: IndexOfCoincidenceBlockData }) {
  return <div class="">
    <div class="h-96">
      <p class="font-semibold text-lg">
        {block.data.ioc}
      </p>
    </div>
  </div>;
}
