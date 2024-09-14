import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";
import { For, createSignal } from "solid-js";
import { alphabet, panic, corpus_data } from "../utils";
import { BlockData } from "~/tools/Workspace/blocks";

export interface SubstitutionCipherBlockData extends BlockData {
  type: "substitution_cipher",
  data: {
    subsitution: Record<string, string>
  }
}



export function SubstitutionCipher({ onChange, text }: { onChange: (subsitution: Record<string, string>) => void; text: () => string; }) {
  const [subsitution, setSubstitution] = createSignal<Record<string, string>>({});
  const [allowDuplicates, setAllowDuplicates] = createSignal(false);
  const [autoFill, setAutoFill] = createSignal(true);

  function fillRemaining(currentSubstitution: Record<string, string> = { ...subsitution() }) {
    let remaining_letters = [...alphabet].filter(
      (letter) => {
        return !Object.values(currentSubstitution).includes(letter);
      }
    );
    for (const char of alphabet) {
      if (currentSubstitution[char] == undefined) {
        currentSubstitution[char] = remaining_letters[0] ?? panic("cannot find letters to fill.");
        remaining_letters = remaining_letters.filter(l => l != remaining_letters[0]);

      } else {
        if (remaining_letters.includes(currentSubstitution[char])) {
          remaining_letters = remaining_letters.filter(l => l != currentSubstitution[char]);
        }
      }
    }
    setSubstitution(currentSubstitution);
    onChange(subsitution());
  }
  async function fillByFrequency() {
    const input_frequencies = await CountMonograms(text());
    const sorted_input = Object.entries(input_frequencies).sort(([, a], [, b]) => a - b);

    const corpus_frequencies = corpus_data.monograms;
    const sorted_corpus = Object.entries(corpus_frequencies).sort(([, a], [, b]) => a - b);

    const substitution: Record<string, string> = {};
    for (const [index, [expected_char]] of Object.entries(sorted_corpus)) {
      const [character] = sorted_input[Number(index)] ?? [];
      if (character == undefined) {
        break;
      }
      substitution[character] = expected_char;
    }

    fillRemaining();
    setSubstitution(substitution);
    onChange(subsitution());
  }

  function clear() {
    setSubstitution({});
    onChange(subsitution());
  }

  return <div>
    <div class="flex flex-row gap-1 flex-wrap">
      <For each={alphabet}>{(char) => <div class="flex flex-col items-center">
        <span>{char}</span>
        <input value={subsitution()[char] ?? ""} class="border rounded w-8 h-8 text-center" onKeyDown={(e) => {
          if (alphabet.includes(e.key)) {
            e.currentTarget.value = e.key;
            const newSubsitution = { ...subsitution() };

            if (!allowDuplicates() && Object.values(newSubsitution).includes(e.key)) {
              for (const [k, v] of Object.entries(newSubsitution)) {
                if (v == e.key) {
                  delete newSubsitution[k];
                }
              }
            }

            newSubsitution[char] = e.key;

            if (autoFill()) {
              fillRemaining(newSubsitution);
            }

            setSubstitution(newSubsitution);
            onChange(subsitution());
          } else if (e.key == "Tab") {
            return;
          } else if (e.key == "Backspace") {
            e.currentTarget.value = "";
            return;
          }
          e.preventDefault();
        }}>
        </input>
      </div>}</For>
    </div>
    <div class="mt-4 flex flex-wrap gap-2 gap-y-4 items-center">
      <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => fillRemaining()}>Fill Remaining</button>
      <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => fillByFrequency()}>Fill by Frequency</button>
      <button class="bg-black text-white rounded-md px-2 py-1" onClick={clear}>Clear</button>
      <Switch class="flex items-center gap-2" onChange={(isChecked) => setAllowDuplicates(isChecked)}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Allow Duplicates</SwitchLabel>
      </Switch>
      <Switch class="flex items-center gap-2" onChange={(isChecked) => setAutoFill(isChecked)} defaultChecked={autoFill()}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Auto Fill</SwitchLabel>
      </Switch>
    </div>
  </div>;
}
