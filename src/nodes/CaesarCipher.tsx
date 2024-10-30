import { Slider, SliderFill, SliderThumb, SliderTrack } from "~/components/ui/slider";
import { createSignal } from "solid-js";
import { BlockPrimitive, WorkspaceNodeInfo, WorkspaceNodeProps } from "~/tools/Workspace/blocks";

export interface CaesarCipherBlockData extends BlockPrimitive {
  type: "caesar_cipher",
  data: {
    steps: number
  }
}

export function CaesarCipher({ setter, block}: WorkspaceNodeProps<CaesarCipherBlockData>) {
  const [steps, setSteps] = createSignal(0)

  return <div class="">
    <div class="flex flex-col">
      <p class="ml-auto mr-0 mb-1">{steps()}</p>
      <Slider value={[steps()]} step={1} minValue={-26} maxValue={26} onChange={(e) => {
        setSteps(e[0])
        setter((block) => {
          block.data.steps = steps()
        })
      }}>
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    </div>
  </div>;
}

export default {
  title: "Caesar Cipher",
  description: "Encode/Decode",
  component: CaesarCipher,
  process: (block, previous) => {
    return DecodeCaesarCipher(previous, (block as CaesarCipherBlockData).data.steps)
  },
  init() {
    return {
      steps: 0
    }
  }
} as WorkspaceNodeInfo<CaesarCipherBlockData>