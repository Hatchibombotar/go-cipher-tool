import { createEffect, createSignal } from "solid-js";
import { MonogramIndexOfCoincidence } from "../../wailsjs/go/main/App";

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
