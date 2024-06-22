import { Slider, SliderFill, SliderThumb, SliderTrack } from "~/components/ui/slider";
import { createSignal } from "solid-js";

export type CaesarCipherNodeData = {
  type: "caesar_cipher",
  data: {
    steps: number
  }
}

export function CaesarCipher({ onChange }: { onChange: (steps: number) => void; }) {
  const [steps, setSteps] = createSignal(0);
  return <div class="">
    <div class="flex flex-col">
      <p class="ml-auto mr-0 mb-1">{steps()}</p>
      <Slider defaultValue={[0]} step={1} minValue={-26} maxValue={26} onChange={(e) => {
        onChange(e[0]);
        setSteps(e[0]);
      }}>
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    </div>
  </div>;
}
