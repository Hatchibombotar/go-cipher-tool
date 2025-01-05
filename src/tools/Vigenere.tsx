import { createEffect, createSignal, For, Index, onCleanup, onMount, Show } from "solid-js";
import { InputNode } from "../nodes/InputNode";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    NumberField,
    NumberFieldDecrementTrigger,
    NumberFieldIncrementTrigger,
    NumberFieldInput
} from "~/components/ui/number-field"
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";
import { FaSolidChevronLeft, FaSolidChevronRight } from 'solid-icons/fa'
import { IoStatsChart } from 'solid-icons/io'
type ColData = {
    shift: number,
    checked: boolean
}
export function Vigenere() {
    const [inputText, setInputText] = createSignal("MYMLZ VUKCM LFSHM QHIBW PQCZB LWQEI KPHWX TLGGZ BLZHM ILTTE AJMGQ EHAFH ROEZN CLLTX JFILV RYWBL KZATQ VQDOL ZUIZE LRTWC QPKTH TWWAZ MYMYM WTRFL GACKE ILMKZ BXDLR RFLAH WOMYL ZWCMI VNSWF WLZUT LRTGP EFPVA YKADB SMYMB LLCIO BSUIN MYMZV VOIGG ZQLKI OPPYK WUELG BCZAQ SJZOB RUDYH VYSZM PMGQL MZWCP RVRWD WGMIJ PBEOU ZVEVR LGSEM BHBKP XELCJ ZWXWE YMPIJ KPCEP UOFQI YMBSX IXGZZ QTOLA RRXWF EUETW PNVOV LRSKM YVFVU WMEKH ZWSVJ XZLRT IZVGT ILLKI BMXBJ RJDXU LQZSQ MIAFE KQUTR VYWKL HRNML MDWHA LGISS FBXCQ YZNMG PXQYO HHHRO WEAVL XLQQE RLZHR RICFZ OWEAG CZWFV YZQYW VMSHI TVHZW KMILF VFUBF RKKML GEIDU AEZKP EIFZB SFBAV GEAVV ISMUT CFXOM XBHHL TSMIN ZYWDB XJAAK VISEL GFBDQ ZMIVP KJQCD YEYOK AWYVB THEED FPFSS LZRWZ QYTGT PNIVF DJGIM ONCHD BWPZK FZWFF INPZK KWUOM TVQLA QXZZG XEBXZ RKKGW WPWCQ RACGJ YPKBS DQWLV BDNTP PAVGT WGMVK ZUNHL TSMIC CZGOH HOWDN WNTCE PPVSJ PLJEP OVZVT ZGEHZ WQEOC CXFNI SIFZG HDDCJ NEAVO TXEVK VWWAL DJTMZ WCTXY FIDVE IQMCR YIGOJ QIOFQ RRZBZ UVAJC IQWWL KVEAM ERRVS TJURM LZHVZ ELLRV NPZKU SFUHS AIAEF BQJXJ VFSBD LNBZL KMPWX JVRAS PSILE AVVIS IQKVW JWAJX LKKQT DAQLZ VTHPD SPEPB DCICT HXGUG ZNFEC GQLFD RUWSQ HKIWF VZHES PJSWE UIHIC DRJAJ WCEUM AQIVJ ZNKBW PWGTI JAWCJ NEAVL XLQQE RTMWM NCDIV KIELC KHZAV MNUPK VTNLH KJDDS BSABS XWIBZ YUCMH ZOIBU LMZKQ CMVZG ZKSMM QEMYM NFRFF ITLHH GGSTM MXYTN RQWSQ YHJPK FNBPE ULFWK LROMY WVLIZ TTFHW UWMOJ FMVDT YXJVM USQRJ BSTMM UZVGJ SWFHZ ZZJXM MCEYC CWLQL JOPPW ZIBZR FNSJW WSWMW XWBPW SPVTG JDRTT PGXBW ZJVZA WLKII QEPFC AOFGY WYZOC QCWGV ZPMPG KCLZH JOQEB JAPQI KKVAF NXJID LLUTE LCKHZ WJYVZ OLRZT FRFVF KLUMX BTGJB GFGVZ CFKQS OBZEV IKPMV RZGFH FPBTM ZACZX FZTXA FYGBE HZUPR MPVGA LXEOQ ZGJQC HLKTV LZHCR WFEUJ TQSTT SVLRH JAZGF ZLLCU NVAUK EIIRB CMBTR FTCMD GJDVO MFMCR MPVSJ KXGCI DBKCP EMQEY SAVIM")
    const [keyLength, setKeyLength] = createSignal(16)
    const [colData, setColData] = createSignal<ColData[]>([])

    createEffect(() => {
        if (colData().length > keyLength()) {
            setColData([...colData().slice(0, keyLength())])
        }
        if (colData().length != keyLength()) {
            let currentShifts = colData()
            for (const iString in new Array(keyLength()).fill(null)) {
                const i = Number(iString)
                if (i >= colData().length) {
                    currentShifts.push({
                        shift: 0,
                        checked: false
                    })
                }
            }
            setColData([...currentShifts])
        }
    })

    const formattedInput = () => inputText().toLowerCase().replace(/ /g, "").replace(/\n/g, "")
    const rows = () => Math.ceil(formattedInput().length / keyLength())

    let container!: HTMLTableElement;

    const [highlight, setHighlight] = createSignal("")

    const getResult = () => {
        let result = ""
        return result
    }
    const [spacedresult, setSpacedResult] = createSignal("")
    createEffect(generateResult)
    async function generateResult() {
        let result = ""
        for (let row = 0; row < rows(); row++) {
            for (const col in colData()) {
                const data = colData()[col]
                if (!onlyShowSelected() || data.checked) {
                    const char = formattedInput()[(row * keyLength()) + Number(col)]
                    if (char == null) {
                        continue
                    }
                    const newchar = await DecodeCaesarCipher(char, data.shift)
                    result += newchar
                } else {
                    result += " "
                }
            }
            result += "\n"
        }
        if (inferSpaces()) {
            setSpacedResult(await InferSpaces(result))
        } else {
            setSpacedResult(result)
        }
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
        const current = colData()
        current[index].shift += 1
        current[index].shift = current[index].shift % 26
        current[index] = { ...current[index] }
        setColData([...current])
        updateString()
    }

    function moveRight(index: number) {
        const current = colData()
        current[index].shift -= 1
        current[index].shift = current[index].shift % 26
        current[index] = { ...current[index] }
        setColData([...current])
        updateString()
    }

    function setChecked(index: number, isChecked: boolean) {
        const current = colData()
        current[index].checked = isChecked
        setColData([...current])
    }

    function cipherShiftToCharacter(c: number) {
        return String.fromCharCode("a".charCodeAt(0) + (-c + 26) % 26)
    }

    function characterToCipherShift(c: string) {
        return -(c.charCodeAt(0) - "a".charCodeAt(0))
    }

    const [stringKey, setStringKey] = createSignal("")

    function onStringKeyChange(value: string) {
        const current = colData()
        let splitstring = value.split("")
        for (let i = 0; i < keyLength(); i++) {
            if (colData()[i] == null || splitstring[i] == null) {
                continue
            }
            current[i].shift = characterToCipherShift(splitstring[i])
            current[i] = { ...current[i] }
        }
        setStringKey(value)
        setColData([...current])
    }

    createEffect(() => {
        let splitstring = stringKey().split("")
        for (let i = 0; i < keyLength(); i++) {
            if (colData()[i] == null || splitstring[i] == null) {
                continue
            }
            const col = colData()[i]
            if (cipherShiftToCharacter(col.shift) != stringKey()[i]) {
                splitstring[i] = cipherShiftToCharacter(col.shift)
            }
        }
        if (splitstring.join("") !== stringKey()) {
            setStringKey(splitstring.join(""))
        }
    })

    function updateString() {
        let str = ""
        for (let i = 0; i < keyLength(); i++) {
            if (colData()[i] == null) {
                break
            }
            const col = colData()[i]
            if (cipherShiftToCharacter(col.shift) != stringKey()[i]) {
                str += cipherShiftToCharacter(col.shift)
            }
        }
        if (str !== stringKey()) {
            setStringKey(str)
        }
    }

    const [onlyShowSelected, setOnlyShowSelected] = createSignal(false)
    const [inferSpaces, setInferSpaces] = createSignal(false)

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <InputNode defaultValue={inputText()} onChange={(t) => setInputText(t)} />
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <label>
                    <span class="font-semibold text-sm">Key Length</span>
                    <NumberField class="w-36" value={keyLength()} onChange={(v) => setKeyLength(Number(v))}>
                        <div class="relative">
                            <NumberFieldInput />
                            <NumberFieldIncrementTrigger />
                            <NumberFieldDecrementTrigger />
                        </div>
                    </NumberField>
                </label>
                <label>
                    <span class="font-semibold text-sm">Key</span>
                    <input type="text" class="border rounded h-8 block px-2" value={stringKey()} onInput={(e) => onStringKeyChange(e.currentTarget.value)}></input>
                </label>

                {/* <p class="font-semibold text-sm">Suggested Columns</p> */}

                {/* <div class="flex flex-row gap-1">
                    <For each={possibleColumnCounts()}>{(number) =>
                        <button
                            class="bg-white cursor-pointer border rounded w-8 h-8 text-center flex items-center justify-center text-sm"
                            onClick={() => setKeyLength(number)}
                        >
                            {String(number)}
                        </button>
                    }</For>
                </div> */}
                <label>
                    <span class="font-semibold text-sm">Highlight</span>
                    <Textarea value={highlight()} placeholder="" onInput={(e) => setHighlight(e.currentTarget.value)} />
                </label>
                <button onClick={copy} class="bg-black text-white rounded-md py-1 px-2 mt-4">Copy Table</button>
            </CardContent>
        </Card>

        <table ref={container} class="custom-table stickyhead select-auto text-center">
            <thead>
                <tr class="text-center select-none">
                    <For each={colData()}>{(col, columnIndex) =>
                        <th class="max-w-32 text-center">
                            <p>{columnIndex()}</p>
                            <p>{cipherShiftToCharacter(col.shift)}({col.shift})</p>
                            <div class="grid grid-cols-2">
                                <button class="flex items-center justify-center" onClick={() => moveLeft(columnIndex())}><FaSolidChevronLeft /></button>
                                <button class="flex items-center justify-center" onClick={() => moveRight(columnIndex())}><FaSolidChevronRight /></button>
                            </div>
                            <IoStatsChart/>
                            <Show when={onlyShowSelected()}>
                                <div class="w-full flex items-center justify-center">
                                    <Checkbox class="cursor-pointer" defaultChecked={col.checked} onChange={(checked) => setChecked(columnIndex(), checked)} />
                                </div>
                            </Show>
                            {/* <p class="underline cursor-pointer">analysis</p> */}
                        </th>
                    }</For>
                </tr>
            </thead>
            <tbody>
                <For each={new Array(rows())}>{(_, row) =>
                    <tr
                        class="text-center"
                    >
                        <For each={colData()}>{(col, index) => {
                            const char = () => formattedInput()[(row() * keyLength()) + index()]
                            const isHighlighted = () => highlight().includes(char())

                            const [a, seta] = createSignal(char())

                            createEffect(async () => {
                                if (char == null) {
                                    return
                                }
                                const c = await DecodeCaesarCipher(char(), col.shift)
                                seta(c)
                            })

                            return <td
                                style={isHighlighted() ? `background: #fde047;` : ""}
                            >
                                {a()}
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
            <Switch class="flex items-center gap-2 my-2 mx-5" onChange={(isChecked) => setOnlyShowSelected(isChecked)} defaultChecked={onlyShowSelected()}>
                <SwitchControl>
                    <SwitchThumb />
                </SwitchControl>
                <SwitchLabel>Only Show Selected Columns</SwitchLabel>
            </Switch>
            <Switch class="flex items-center gap-2 my-2 mx-5" onChange={(isChecked) => setInferSpaces(isChecked)} defaultChecked={inferSpaces()}>
                <SwitchControl>
                    <SwitchThumb />
                </SwitchControl>
                <SwitchLabel>Infer Spaces</SwitchLabel>
            </Switch>
            <CardContent>
                <textarea readOnly class="w-full h-96 font-mono">{spacedresult()}</textarea>
            </CardContent>
            <CardContent>
                <p class="break-all">{getResult()}</p>
            </CardContent>
        </Card>
    </div>
}

