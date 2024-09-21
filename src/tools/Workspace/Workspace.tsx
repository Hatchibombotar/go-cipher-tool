import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { For, createEffect, createSignal, ErrorBoundary, Show } from "solid-js";
import { FormattingMode } from "../../gofunctiontypes";
import { createStore } from "solid-js/store";
import { FaSolidAngleUp, FaSolidXmark, FaSolidAngleDown, FaSolidExclamation } from 'solid-icons/fa'
import { Store } from "../../utils";
import { Block, BlockType, getBlockData, processData } from "./blocks";
import { InputNode } from "../../nodes/InputNode";

const example_workspace_caesar: Store = {
    text: "Hello, World!",
    blocks: [
        {
            type: "format",
            data: {
                case: FormattingMode.LowerCaseFormatting,
                removeUnknown: false,
            }
        },
        {
            type: "frequency_analysis"
        },
        {
            type: "caesar_cipher",
            data: {
                steps: 0
            }
        },
        {
            type: "frequency_analysis",
        },
        {
            type: "format",
            data: {
                case: FormattingMode.SentenceCaseFormatting,
                removeUnknown: false
            }
        },
        {
            type: "output",
        }
    ],
}
const example_workspace_substitution: Store = {
    "text": "Hello, World!",
    "blocks": [
        {
            type: "substitution_cipher",
            data: {
                subsitution: {}
            }
        },
        {
            "type": "output"
        }
    ]
}

const example_workspace_shift: Store = {
    "text": "Hello, World!",
    "blocks": [
        {
            type: "caesar_cipher",
            data: {
                steps: 2
            }
        },
        {
            "type": "output"
        }
    ]
}

export function Workspace() {
    const [store, setStore] = createStore<Store>(example_workspace_caesar)

    const [dataStack, setDataStack] = createSignal<string[]>([])

    let processDebounceTimer: number | null;

    const blockdata = getBlockData(store, setStore)
    createEffect(() => {
        // This is really disgusting, there should be another way of doing this.
        JSON.stringify(store.text)
        JSON.stringify(store.blocks)

        if (processDebounceTimer) clearTimeout(processDebounceTimer)
        processDebounceTimer = setTimeout(() => {
            processData(store, setStore, setDataStack)
            processDebounceTimer = null
        }, 100) as unknown as number
    })

    processData(store, setStore, setDataStack)

    function confirmClear() {
        if (confirm("Remove all blocks from the workspace? This cannot be un-done.")) {
            setStore("blocks", [])
        }
    }
    return <div class="">
        {/* <WorkspaceSave /> */}
        <div class="mb-4 -mt-1 flex gap-2">
            {/* <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md" onClick={() => setSaveMenuOpen(true)}>Save Workspace</button> */}
            {/* <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md">Load Workspace</button> */}
            <button class="hover:bg-neutral-200 font-semibold text-sm px-2 py-1 rounded-md" onClick={confirmClear}>Clear Workspace</button>
        </div>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <InputNode defaultValue={store.text} onChange={(text) => setStore("text", text)} />
            <For each={store.blocks}>{(node, blockIndex) => {
                const data = () => dataStack().at(node.input ?? 0) ?? ""

                if (node.type in blockdata) {
                    const thisblock = blockdata[node.type]
                    return <Card>
                        <CardHeader>
                            <div class="flex gap-1">
                                <CardTitle>{thisblock.title}</CardTitle>
                                <div class="ml-auto flex gap-1">
                                    <Show when={node.error}>
                                        <div class="p-1 bg-red-300 hover:bg-red-400 rounded-sm group relative">
                                            <div class="hidden group-hover:block absolute top-full mt-1 left-0">
                                                <p class="w-36 bg-neutral-200 rounded px-2 py-1">{
                                                    node.error?.message
                                                }</p>
                                            </div>
                                            <FaSolidExclamation> </FaSolidExclamation>
                                        </div>
                                    </Show>
                                    <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                                        const oldIndex = blockIndex()
                                        const newIndex = Math.max(oldIndex - 1, 0)
                                        const new_store_data = store.blocks.filter((_, index) => index != oldIndex)
                                        new_store_data.splice(newIndex, 0, node)
                                        setStore("blocks", new_store_data)
                                    }}>
                                        <FaSolidAngleUp> </FaSolidAngleUp>
                                    </button>
                                    <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                                        const oldIndex = blockIndex()
                                        const newIndex = Math.min(oldIndex + 1, store.blocks.length - 1)
                                        const new_store_data = store.blocks.filter((_, index) => index != oldIndex)
                                        new_store_data.splice(newIndex, 0, node)
                                        setStore("blocks", new_store_data)
                                    }}>
                                        <FaSolidAngleDown></FaSolidAngleDown>
                                    </button>
                                    <button type="button" class="p-1 hover:bg-slate-200 rounded-sm" onClick={() => {
                                        setStore("blocks", store.blocks.filter((_, index) => index != blockIndex()))
                                    }}>
                                        <FaSolidXmark />
                                    </button>
                                </div>
                            </div>
                            <CardDescription>{thisblock.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ErrorBoundary fallback={(err, reset) => {
                                createEffect(
                                    () => {
                                        // store;
                                        // reset()
                                    }
                                )
                                return <div>
                                    <p>Error: {err.message}</p>
                                    <button class="bg-red-400 rounded px-2 py-1 mt-2" onClick={reset}>Reset</button>
                                </div>
                            }}>
                                {thisblock.component(node, data, blockIndex)}
                            </ErrorBoundary>
                        </CardContent>
                    </Card>
                }
            }}
            </For>

            <Card class="p-4">
                <div class="mt-2 mb-3">
                    <CardTitle>More Blocks:</CardTitle>
                </div>
                <div class="flex flex-row flex-wrap gap-2 h-min">
                <For each={Object.entries(blockdata)}>{([type, data]) =>
                    <button type="button" class="group relative" onClick={() => {
                        const object: Partial<Block> = {
                            type: type as BlockType,
                        }
                        if (data.init) {
                            (object as any).data = data.init()
                        }
                        setStore("blocks", store.blocks.length, object)
                    }}>
                        <div class="border hover:bg-slate-100 cursor-pointer rounded-lg h-12 flex items-center justify-center">
                            <span class="mx-2 text-sm">
                                {data.title}
                            </span>
                        </div>
                        {/* <div class="hidden group-hover:flex group-focus:flex pt-3 absolute left-full ml-2 top-0 border z-20 bg-slate-200 p-2 rounded-lg h-12 w-auto">
                            <p class="text-sm whitespace-nowrap font-semibold">{data.title}</p>
                        </div> */}
                    </button>
                }</For>
                </div>
            </Card>
        </div>
    </div>
}

const [saveMenuOpen, setSaveMenuOpen] = createSignal(false)
function WorkspaceSave() {
    return <div>
        <Dialog open={saveMenuOpen()} defaultOpen={saveMenuOpen()} onOpenChange={(s) => setSaveMenuOpen(s)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Workspace</DialogTitle>
                    <DialogDescription class="flex flex-col gap-2 pt-2">
                        <span>New Workspace</span>
                        <div class="flex gap-2 w-full">
                            <input class="border py-2 px-2 rounded-md w-full text-black" type="text" placeholder="Untitled Workspace"></input>
                            <button class="text-white bg-black rounded-md px-4 py-2">Save</button>
                        </div>
                        <span>Existing Workspaces</span>
                        <div class="border py-2 px-2 rounded-md hover:bg-neutral-100 cursor-pointer">
                            <span class="text-black">
                                Untitled Workspace
                            </span>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
}