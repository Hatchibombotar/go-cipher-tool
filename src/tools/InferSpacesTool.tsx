import { createEffect, createSignal } from "solid-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "~/components/ui/textarea";

export function InferSpacesTool() {
    const [inputText, setInputText] = createSignal("hello")

    const [result, setResult] = createSignal(inputText())

    createEffect(async () => {
        setResult(await InferSpaces(inputText()))
    })

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter Encoded Text</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea value={inputText()} placeholder="Type your message here." onInput={(e) => setInputText(e.currentTarget.value)} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
                <button onClick={async () => {
                    setInputText(await InferSpaces(inputText()))
                }
                } class="py-1 px-2 bg-black text-white rounded-md">Apply to Input</button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <p class="break-all">{result()}</p>
            </CardContent>
        </Card>
    </div>
}