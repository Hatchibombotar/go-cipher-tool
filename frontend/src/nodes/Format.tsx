import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch"
import { createSignal } from "solid-js"
import { FormattingMode } from "~/models"

export type FormatNodeData = {
    type: "format",
    data: {
        case: FormattingMode,
        removeUnknown: boolean,
    }
}

type FormatNodeSettings = {
    case: FormattingMode
    removeUnknown: boolean
}
export function FormatNode({ onChange }: { onChange: (settings: FormatNodeSettings) => void }) {
    const [caseType, setCaseType] = createSignal<FormatNodeSettings["case"]>(FormattingMode.UnchangedCaseFormatting)
    const [removeUnknown, setRemoveUnknown] = createSignal(false)

    function change() {
        onChange({
            case: caseType(),
            removeUnknown: removeUnknown()
        })
    }

    return <div class="flex flex-col gap-2">
        <select
            class="border mb-2 rounded-md px-2 py-1 text-base"
            onChange={(e) => {
                setCaseType(Number(e.currentTarget.value) as FormattingMode)
                change()
            }}>
            <option value={FormattingMode.UnchangedCaseFormatting}>default</option>
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