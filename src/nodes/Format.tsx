import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch"
import { createSignal } from "solid-js"
import { FormatOptions, FormattingMode } from "~/gofunctiontypes"
import { BlockPrimitive, WorkspaceNodeInfo, WorkspaceNodeProps } from "~/tools/Workspace/blocks"

export interface FormatBlockData extends BlockPrimitive {
    type: "format",
    data: FormatNodeSettings
}

type FormatNodeSettings = {
    case: FormattingMode
    removeUnknown: boolean
}

function FormatNode({ block, setter }: WorkspaceNodeProps<FormatBlockData>) {
    const [caseType, setCaseType] = createSignal<FormatNodeSettings["case"]>(block.data.case)
    const [removeUnknown, setRemoveUnknown] = createSignal(block.data.removeUnknown)

    function change() {
        setter((state) => {
            state.data.case = caseType()
            state.data.removeUnknown = removeUnknown()
        })
    }

    return <div class="flex flex-col gap-2">
        <select
            class="border mb-2 rounded-md px-2 py-1 text-base"
            value={block.data.case}
            onChange={(e) => {
                setCaseType(Number(e.currentTarget.value) as FormattingMode)
                change()
            }}>
            <option value={FormattingMode.UnchangedCaseFormatting}>unchanged</option>
            <option value={FormattingMode.SentenceCaseFormatting}>Sentence case.</option>
            <option value={FormattingMode.UpperCaseFormatting}>UPPER CASE</option>
            <option value={FormattingMode.LowerCaseFormatting}>lower case</option>
        </select>
        <Switch class="flex items-center gap-2" onChange={
            (isChecked) => {
                setRemoveUnknown(isChecked)
                change()
            }}
            defaultChecked={removeUnknown()}
        >
            <SwitchControl>
                <SwitchThumb />
            </SwitchControl>
            <SwitchLabel>Remove Non-Alpha</SwitchLabel>
        </Switch>
    </div>
}

export default {
    title: "Format",
    description: "Format Text",
    component: FormatNode,
    process: async (block, previous,) => {
        const options: FormatOptions = {
            CaseMode: block.data.case,
            RemoveUnknown: block.data.removeUnknown
        }
        return Format(previous, options)
    },
    init() {
        return {
            case: FormattingMode.UnchangedCaseFormatting,
            removeUnknown: false
        }
    }
} as WorkspaceNodeInfo<FormatBlockData>