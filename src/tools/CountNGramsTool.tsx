import { createEffect, createSignal, For, onMount } from "solid-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { corpusNGrams, corpusNGramsWithoutSpaces, corpusRaw, setCorpusNGrams, setCorpusNGramsWithoutSpaces } from "~/globalstate";
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from "~/components/ui/switch";
import { FormatOptions, FormattingMode } from "~/gofunctiontypes";
import { register } from "module";


export function CountNGramsTool() {
    const [inputText, setInputText] = createSignal("hello")
    const [size, setSize] = createSignal(2)
    const [includeSpaces, setIncludeSpaces] = createSignal(false)
    const [ngrams, setNGrams] = createSignal<Record<string, number>>({})

    onMount(() => {
        set(inputText(), size())
    })


    async function initNGramsIfNotDone(n: number) {
        n ??= 0
        n = Math.floor(n)
        if (includeSpaces()) {
            if (n in corpusNGrams()) return
            const prev = corpusNGrams()

            prev[n] = await CountNGrams(corpusRaw(), n)
            
            setCorpusNGrams({ ...prev })
        } else {
            if (n in corpusNGramsWithoutSpaces()) return
            const prev = corpusNGramsWithoutSpaces()

            const text = await Format(corpusRaw(), {
                CaseMode: FormattingMode.LowerCaseFormatting,
                RemoveUnknown: true
            } as FormatOptions)

            prev[n] = await CountNGrams(text, n)
            setCorpusNGramsWithoutSpaces({ ...prev })
        }
        return true
    }

    const corpusNGramData = () => includeSpaces() ? corpusNGrams()[size()] : corpusNGramsWithoutSpaces()[size()]

    async function set(text: string, size: number) {
        await initNGramsIfNotDone(size)
        setInputText(text)
        setSize(size)
        setNGrams(await CountNGrams(text, size))
    }

    async function setIncludeSpacesWithSideEffects(a: boolean) {
        setIncludeSpaces(a)
        set(inputText(), size())
    }

    const ngramTotal = () => Object.values(ngrams()).reduce((prev, current) => prev + current, 0)
    const sortedNGrams = () => Object.entries(ngrams()).toSorted(([, a], [, b]) => b - a)
    const sortedCorpusGrams = () => Object.entries(corpusNGramData() ?? {}).toSorted(([, a], [, b]) => b - a)
    const corpusNGramTotal = () => Object.values(corpusNGramData() ?? {}).reduce((prev, current) => prev + current, 0)

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter Encoded Text</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    value={inputText()}
                    placeholder="Type your message here."
                    onInput={(e) => set(e.currentTarget.value, size())}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-0 pt-6">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <label>
                    <span class="text-sm font-semibold mr-2">NGram Size</span>
                    <input
                        type="number"
                        class="border my-2 rounded w-8 h-8 text-center"
                        min={1}
                        value={size()}
                        onInput={(e) => set(inputText(), e.currentTarget.valueAsNumber)}
                    ></input>
                </label>

                <Switch
                    class="flex items-center gap-2"
                    onChange={(includeSpaces: boolean) => setIncludeSpacesWithSideEffects(includeSpaces)}
                    defaultChecked={includeSpaces()}
                >
                    <SwitchLabel>Include Spaces</SwitchLabel>
                    <SwitchControl>
                        <SwitchThumb />
                    </SwitchControl>
                </Switch>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-2 gap-8">
                    <div class="">
                        <p>Input Text</p>
                        <table class="ngram-table w-full">
                            <tbody>
                                <tr class="whitespace-nowrap">
                                    <th>ngram</th>
                                    <th>input (n)</th>
                                    <th>input (%)</th>
                                    <th>corpus (%)</th>
                                </tr>
                                <For each={sortedNGrams()}>{([k, v]) =>
                                    <tr>
                                        <td>{k}</td>
                                        <td>{v}</td>
                                        <td>{Math.round(v / ngramTotal() * 100 * 100) / 100}</td>
                                        <td>{Math.round(((corpusNGramData() ?? {})[k] ?? 0) / corpusNGramTotal() * 100 * 100) / 100}</td>
                                    </tr>
                                }</For>
                            </tbody>
                        </table>
                    </div>
                    <div class="">
                        <p>Corpus</p>
                        <table class="ngram-table w-full">
                            <tbody>
                                <tr class="whitespace-nowrap">
                                    <th>ngram</th>
                                    <th>corpus (%)</th>
                                    <th>corpus (%)</th>
                                </tr>
                                <For each={sortedCorpusGrams()}>{([k, v]) =>
                                    <tr>
                                        <td>{k}</td>
                                        <td>{Math.round(v / corpusNGramTotal() * 100 * 100) / 100}</td>
                                        <td>{Math.round(((corpusNGramData() ?? {})[k] ?? 0) / corpusNGramTotal() * 100 * 100) / 100}</td>
                                    </tr>
                                }</For>
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
}