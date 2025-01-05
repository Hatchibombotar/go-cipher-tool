import { createEffect, createSignal, For, Index, onCleanup, onMount } from "solid-js";
import { InputNode } from "../nodes/InputNode";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    NumberField,
    NumberFieldDecrementTrigger,
    NumberFieldIncrementTrigger,
    NumberFieldInput
} from "~/components/ui/number-field"
import { Textarea } from "~/components/ui/textarea";
import challenge from "./challenge";

const expectedthings =
    "/".charCodeAt(0)
    + "|".charCodeAt(0)
    + "\\".charCodeAt(0)

export function Shuffle() {
    const columns = 21
    const [columnOrder, setColumnOrder] = createSignal<number[]>([])

    const [stringKey, setStringKey] = createSignal("")

    const rows = () => Math.ceil(challenge.length / columns)

    createEffect(() => {
        if (columnOrder().length != columns) {
            let currentOrder = columnOrder()
            for (const iString in new Array(columns).fill(null)) {
                const i = Number(iString)
                if (!currentOrder.includes(i)) {
                    currentOrder.push(i)
                }
            }
            currentOrder = currentOrder.filter(x => x < columns)
            setColumnOrder([...currentOrder])
        }
        setStringKey(JSON.stringify(columnOrder()))
    })

    const possibleColumnCounts = () => {
        const num = challenge.length
        const factors = [];

        for (let i = 1; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                factors.push(i);
                if (i !== num / i) { // To avoid adding the square root twice for perfect squares
                    factors.push(num / i);
                }
            }
        }

        return factors.sort((a, b) => a - b);
    }

    let container!: HTMLTableElement;

    const getResult = () => {
        let result = ""
        for (const rowS in new Array(rows()).fill(null)) {
            const row = Number(rowS)
            for (const col of columnOrder()) {
                result += challenge[(row * columns) + col] ?? ""
            }
        }
        return result
    }

    function copy() {
        const htmlContent = container.outerHTML

        const blob = new Blob([htmlContent], { type: "text/html" })
        const clipboardItem = new ClipboardItem({ "text/html": blob })

        navigator.clipboard.write([clipboardItem]).then(() => {
            console.log("Table with styling copied!")
        }).catch((err) => {
            console.error("Error copying table: ", err)
        })
    }

    function moveLeft(index: number) {
        if (index == 0) return

        const result = [
            ...columnOrder().slice(0, index - 1),
            columnOrder()[index],
            columnOrder()[index - 1],
            ...columnOrder().slice(index + 1, columnOrder().length)
        ]

        setColumnOrder(result)
    }

    function moveRight(index: number) {
        if (index == columnOrder().length - 1) return

        const result = [
            ...columnOrder().slice(0, Math.max(0, index)),
            columnOrder()[index + 1],
            columnOrder()[index],
            ...columnOrder().slice(index + 2, columnOrder().length)
        ]

        setColumnOrder(result)
    }

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <button onClick={copy} class="bg-black text-white rounded-md py-1 px-2 mt-4">Copy Table</button>
                <button onClick={() => setColumnOrder([])} class="bg-black text-white rounded-md py-1 px-2 mt-4 ml-1">Reset Order</button>


                <span class="font-semibold text-sm block">Key</span>
                <input type="text" class="border rounded h-8 block px-2 w-full" value={stringKey()} onInput={(e) => {
                    const val = JSON.parse(e.currentTarget.value) as number[]
                    const total = (prev: any, cur: any) => prev + cur
                    if (val.reduce(total) != columnOrder().reduce(total)) {
                        return
                    }

                    setColumnOrder(val)

                    
                }}></input>
            </CardContent>
        </Card>

        <table ref={container} class="custom-table stickyhead select-auto text-center">
            <thead>
                <tr class="text-center select-none">
                    <For each={columnOrder()}>{(columnNumber, columnIndex) =>
                        <th class="max-w-32">
                            <div class="grid grid-cols-2">
                                <button onClick={() => moveLeft(columnIndex())}>{"<"}</button>
                                <button onClick={() => moveRight(columnIndex())}>{">"}</button>
                            </div>
                            <span>{columnNumber}</span>
                        </th>
                    }</For>
                </tr>
            </thead>
            <tbody>
                <For each={new Array(rows())}>{(_, row) =>
                    <tr
                        class="text-center"
                    >
                        <For each={columnOrder()}>{(col, index) => {
                            const char = () => challenge[(row() * columns) + col]
                            // const isHighlighted = () => highlight().includes(char())
                            const isValid = () => {
                                const startofRow = row() * columns
                                const starti = Math.floor(index() / 3) * 3
                                console.log(starti)
                                const a = challenge[startofRow + columnOrder()[starti]]
                                const b = challenge[startofRow + columnOrder()[starti + 1]]
                                const c = challenge[startofRow + columnOrder()[starti + 2]]
                                if (a == undefined) return
                                if (b == undefined) return
                                if (c == undefined) return

                                const things = a.charCodeAt(0) + b.charCodeAt(0) + c.charCodeAt(0)
                                return expectedthings == things
                            }
                            return <td
                                // style={isHighlighted() ? `background: #fde047;` : ""}
                                classList={{
                                    "bg-green-400": isValid()
                                }}
                            >
                                {char()}
                            </td>
                        }}</For>
                    </tr>
                }</For>
            </tbody>
        </table>

        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <p class="break-all">{getResult()}</p>
            </CardContent>
        </Card>
    </div>
}