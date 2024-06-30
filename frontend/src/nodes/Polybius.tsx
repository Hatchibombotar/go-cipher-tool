import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";
import { For, createEffect, createSignal } from "solid-js";
import { CountMonograms } from "../../wailsjs/go/main/App";
import { alphabet, panic, corpus_data } from "../utils";
import { BlockData } from "~/blocks";

export interface PolybiusCipherBlockData extends BlockData {
  type: "polybius_cipher",
  data: {
    key: string
  }
}

export function PolybiusCipher({ onChange, text }: { onChange: (key: string[]) => void; text: () => string; }) {
  const [allowDuplicates, setAllowDuplicates] = createSignal(false);
  const [autoFill, setAutoFill] = createSignal(true);

  const [key, setKey] = createSignal<string[]>("abcdefghiklmnopqrstuvwxyz".split(""))
  const [skipLetter, setSkippedLetter] = createSignal("j")

  function fillRemaining(currentKey: string[] = [...key()]) {
    if (skipLetter() == "") {
      setSkippedLetter("j")
    }
    let remaining_letters = [...alphabet].filter(
      (letter) => {
        return !currentKey.includes(letter) && letter != skipLetter()
      }
    );
    for (const index in alphabet) {
      if (currentKey[index] == " ") {
        currentKey[index] = remaining_letters[0] ?? panic("cannot find letters to fill.");
        remaining_letters = remaining_letters.filter(l => l != remaining_letters[0]);
      } else {
        if (remaining_letters.includes(currentKey[index])) {
          remaining_letters = remaining_letters.filter(l => l != currentKey[index]);
        }
      }
    }
    setKey(currentKey);
    onChange(key());
  }

  createEffect(() => {
    onChange(key())
  })

  function clear() {
    setSkippedLetter("")
    setKey(new Array(25).fill(" "))
  }

  return <div>
    <table class="custom-polybius-table">
      <tbody>
        <tr>
          <th></th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
        </tr>
        {
          (() => new Array(5).fill(null).map(
            (_, row) => <tr>
              <th>{row + 1}</th>
              {
                new Array(5).fill(null).map(
                  (_, col) => <td>
                    <input type="text" value={key()[row * 5 + col]} onKeyDown={(e) => {
                      if (alphabet.includes(e.key)) {
                        const index = row * 5 + col
                        e.currentTarget.value = e.key;
                        const newKey = [...key()]

                        if (!allowDuplicates() && newKey.includes(e.key)) {
                          for (const [k, v] of Object.entries(newKey)) {
                            if (v == e.key) {
                              newKey[Number(k)] = " "
                            }
                          }
                        }

                        newKey[index] = e.key;

                        if (autoFill()) {
                          fillRemaining(newKey);
                        }

                        setKey(newKey);
                        onChange(key());
                      } else if (e.key == "Tab") {
                        return;
                      } else if (e.key == "Backspace") {
                        e.currentTarget.value = "";
                        return;
                      }
                      e.preventDefault();
                    }}></input>
                  </td>
                )
              }
            </tr>
          ))()
        }
      </tbody>
    </table>
    <label class="mt-2 block">
      <span>Skip Letter:</span>
      <input type="text" class="border mx-2 rounded w-8 h-8 text-center" value={skipLetter()} onKeyDown={
        (e) => {
          if (alphabet.includes(e.key)) {

            setSkippedLetter(e.key)
            if (autoFill()) {
              fillRemaining()
            }
          } else if (e.key == "Tab") {
            return;
          } else if (e.key == "Backspace") {
            e.currentTarget.value = "";
            return;
          }
          e.preventDefault();
        }
      }></input>
    </label>

    <div class="mt-4 flex flex-wrap gap-2 gap-y-4 items-center">
      <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => fillRemaining()}>Fill Remaining</button>
      <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => null}>Fill by IoC</button>
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
