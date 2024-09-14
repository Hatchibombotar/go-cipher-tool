import { createEffect, createSignal, onMount } from "solid-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

import { Textarea } from "~/components/ui/textarea"

export function InputNode({ onChange, defaultValue }: { onChange: (text: string) => void, defaultValue: string }) {
    const [val, setVal] = createSignal(defaultValue)

    createEffect(() => {
        onChange(val())
    })
    return <div class="flex flex-col">
        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter Encoded Text</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea value={defaultValue} placeholder="Type your message here." onInput={(e) => setVal(e.currentTarget.value)} />
            </CardContent>
        </Card>
    </div>
}