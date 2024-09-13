import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

import { Textarea } from "~/components/ui/textarea"

export function InputNode({ onChange }: { onChange: (text: string) => void }) {
    return <div class="flex flex-col">
        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter Encoded Text</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea placeholder="Type your message here." onInput={(e) => onChange(e.currentTarget.value)} />
            </CardContent>
        </Card>
    </div>
}