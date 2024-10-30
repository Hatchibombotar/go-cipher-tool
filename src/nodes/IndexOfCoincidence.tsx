import { BlockPrimitive, WorkspaceNodeInfo, WorkspaceNodeProps } from "~/tools/Workspace/blocks";

export interface IndexOfCoincidenceBlockData extends BlockPrimitive {
  type: "index_of_coincidence",
  data: {
    ioc: number
  }
}

function IndexOfCoincidence({ block }: WorkspaceNodeProps<IndexOfCoincidenceBlockData>) {
  return <div class="">
    <div class="h-96">
      <p class="font-semibold text-lg">
        {block.data.ioc}
      </p>
    </div>
  </div>;
}

export default {
  title: "Index of Coincidence",
  description: "Calculate the index of coinidence for the input text. Typical for English: 1.75",
  component: IndexOfCoincidence,
  process: async (block, previous, _, setter) => {
    const ioc = await MonogramIndexOfCoincidence(previous)
    setter((state) => {
      state.data.ioc = ioc
    })
    return previous
  },
  init() {
    return {
      ioc: 0
    }
  }
} as WorkspaceNodeInfo<IndexOfCoincidenceBlockData>