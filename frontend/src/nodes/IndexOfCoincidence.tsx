import { createEffect, createSignal } from "solid-js";
import { MonogramIndexOfCoincidence } from "../../wailsjs/go/main/App";
import { BlockData } from "~/blocks";

export interface IndexOfCoincidenceBlockData extends BlockData {
  type: "index_of_coincidence"
}

export function IndexOfCoincidence({ text }: { text: () => string; }) {
  const [ioc, setIoc] = createSignal(0);
  createEffect(async () => {
    setIoc(
      await MonogramIndexOfCoincidence(text())
    );
  });

  return <div class="">
    <div class="h-96">
      <p class="font-semibold text-lg">
        {ioc()}
      </p>
    </div>
  </div>;
}
