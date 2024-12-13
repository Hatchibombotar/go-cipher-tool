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

export function Transposition() {
    const [inputText, setInputText] = createSignal("JDEFO IOLWI LONUO NGPYU LAORS MSSTE AETHG IOGTI UHSOL DHUSN YOEDU HATTE TCEDA HIIAL TSETR FTERM AIOMS EOTIT HPOVE RIECE DNBAC HRNOP NKFIE TNSRO SNVIE TAIEL WRESN RSIEL TOPYA EORRP THCHW IIAEB HVENN AEUBE OLLTO AERCT EDNGA IBTEE EWNHL ITENS THEII KECNW AASUN SMTAT EHMII EASHD OMACM SIOIS NDURE FTEIN HRVSI GETAI NSTOF LOWOL IGECN REPOF ITTEE PHROT NIROS EANLS DHTST AHWSC EAOTN UNIIG OFNTU DHENT EQIRN UYHUG TOHAN OIMTU EHSRO SEMWH AAEDN GTAON HTAIR ALBRA SSINA AYPLR IKRTN EOSUS NMTAE BHVEI VELED HTSTA HWSGE AODOR OFHRE BEDTS HEATR IAFES IEULL FLFNC OERPE DYTCM UNOMI AIOCT NBTWS EENHE ETMOH FBTOL WILON UONGP TILEH STEAN TRDTI NIHKE ILWWL EUSBB YRAKB EIGHO NTSCP HEIES VEROR HNETE XFWWT EEKTH ESEOS EMRSO EDLWM DWNEO BTEVU IETAL NULMN AYAGD OCETR CTHAK EIHEC PRNER UDNAH TETHC DEEOA DCANI NRMIP OSTAT EHYUI LOWLI DTFNH CNTEO ETINN STRST EEIGA INMSE PEISL EOULD THTSW AHTOU EHGTI GHMHH VETAB EGOEN IGNBN OUION TWDRF SEIHW SMEAI SNGSI SMTHO EIGMP NIOTN TRASE INHHT DTIEA TNHEI TPRSE HAIAS HWSOK DTCEO ERAHA BUTHO TEIUA STTOO FINME PLYMO ETHYR OGSHU HEOSN DEOEP ATXNO THDNA NRDTO OSHEE SFLOW OLTAT HHTOG TTUHO TNAIS TRLCU AOCUS NLINA VOHIG ARNCR EOUID TYWNM OEQIR NUISI TEWHO TECNM OARPR YAKRB NEODS CRIIC LTSER HAATT HSITE TAIOU TNHRE SEFRE DERTI THOSE IANFN CADII LFIUL FCTTA TYHRG RSOEM NIOET NDNOE IUERL RAIRI LEFEH SASIM IIOBT NAMUW SCLRG HAETA NRHHS UDIBG TNDEA IOCUT CRTME SOTAP EHTRA STHPH RASEE OFRTN OHVLU EAAIN ATONT ENDHE PLIWO CWSTY AOLOW ALHMO SITTG ATAEH FIFET HWSIE ANEGU LAEIH IWTSE THLSE HMANE YAEPH VLNED ANTSL LOESM OFOET EORHM EAUAV LBETE LIMFO MSRTE IBHLR RATAY ANCKK ODWPR ONIEO TCTHA REELS ODDFR ELRSA EADOC NTLIO NAMTE NSHIU ACERN TIWOH SUDLL LAOHM TWIOA OFPYF IDEHS BSNDT ATFND OUHSA MICPI NYAGO MGHUI TBECO JTHTH TAEOL DCUHV ACAEH EEDIV MRORO ELSTH ESEAE OSMUC METOB SLLYE IGHEN TBOSA OKTAE VFCAU BULET AINHV GOSTB AEFRS DOOEI MMTEB UTAOT EREHT AUESS RMIIE ASHDC QAAUR DFIEO HMIRI TOLDW UHVBE AEEIT ENNNE YESLM ARABR SIGTS NOITO GFNYH ELTLW RVOEA UDPLE ATOFR STEOL HCLCI OETNO HETTC TTHIY EEASR WASTH LOEIK TRSHT UYABE SOURW LHVED ABEAL ENETD TREOI NEHSE TSEDO LADTL NHTHE ATRSL TEUIG RINPC WULEO DAEBH VENOW ELETA NRHTE NSHIU ACERN VLATA UINTW OIOLC EUDRA NLTIY AEBHV ENDAE ANEOU GRSTA TSREY UTGBP RAPEH SHRIT ESWSW KAOTT ARHKN THIGE HDERO ILNDS AEETO LCRTW EAERN TMEOU HIVCG ETVON OTNFO IGRAK RBNUT ESPSP CALEI LTOSY HEHSE WODBS WETEE CCRAU UATML EATHD TEADT CRALO FBECU SEORI RGEFO RWSBS AEIDA HNSHM ECETD FROEA DHEUT ISREN URTEN SHIIS TTSRN ETAGH TEWAH ATDTN EHRBB EOEYN VRIET GASIT OENIN DDUTE BRMMB EEETA TRHNB OKOOS EEAWR CULLT AYTLE SONOO SSNIN FIGIC NCLAT AMOUI CLAIS DREIH NWTOO SIPSB EAILG NTAKI MESNS SEEHT HTAEO LDWUW NTHAT EHLEW OSRYA ORFAR FFIOG TTROE FRTNU HRNVE IETGA SITOM IINGT ASHEI YAVLH ERUGB OHHSR TIOEN TLIHT EFEHT OIGTL HPRMT EAETL NNYPI LSOIG ISNHE ETILC OCANN HCSND EAPRA PEHSV NLEEE DNGAI TAPEO SLOIN LFCRE RACAI NITOL OFOOK RADTW ROERI HANYU RGOTO GHHUT TESSH EDESI LPCLA EUTOS IINAE JOMNY NMYIG HLDAO IYETW BSIHS HSEAR RY")
    const [columns, setColumns] = createSignal(5)
    const [columnOrder, setColumnOrder] = createSignal<number[]>([])

    const formattedInput = () => inputText().toLowerCase().replace(/ /g, "").replace(/\n/g, "")
    const rows = () => Math.ceil(formattedInput().length / columns())

    createEffect(() => {
        if (columnOrder().length != columns()) {
            let currentOrder = columnOrder()
            for (const iString in new Array(columns()).fill(null)) {
                const i = Number(iString)
                if (!currentOrder.includes(i)) {
                    currentOrder.push(i)
                }
            }
            currentOrder = currentOrder.filter(x => x < columns())
            setColumnOrder([...currentOrder])
        }
    })

    const possibleColumnCounts = () => {
        const num = formattedInput().length
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

    const [highlight, setHighlight] = createSignal("")

    const getResult = () => {
        let result = ""
        for (const rowS in new Array(rows()).fill(null)) {
            const row = Number(rowS)
            for (const col of columnOrder()) {
                result += formattedInput()[(row * columns()) + col] ?? ""
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
        <InputNode defaultValue="" onChange={(t) => setInputText(t)} />
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <label>
                    <span class="font-semibold text-sm">Columns</span>
                    <NumberField class="w-36" value={columns()} onChange={(v) => setColumns(Number(v))}>
                        <div class="relative">
                            <NumberFieldInput />
                            <NumberFieldIncrementTrigger />
                            <NumberFieldDecrementTrigger />
                        </div>
                    </NumberField>
                </label>

                <p class="font-semibold text-sm">Suggested Columns</p>

                <div class="flex flex-row gap-1">
                    <For each={possibleColumnCounts()}>{(number) =>
                        <button
                            class="bg-white cursor-pointer border rounded w-8 h-8 text-center flex items-center justify-center text-sm"
                            onClick={() => setColumns(number)}
                        >
                            {String(number)}
                            </button>
                    }</For>
                </div>
                <label>
                    <span class="font-semibold text-sm">Highlight</span>
                    <Textarea value={highlight()} placeholder="" onInput={(e) => setHighlight(e.currentTarget.value)} />
                </label>
                <button onClick={copy} class="bg-black text-white rounded-md py-1 px-2 mt-4">Copy Table</button>
                <button onClick={() => setColumnOrder([])} class="bg-black text-white rounded-md py-1 px-2 mt-4 ml-1">Reset Order</button>
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
                            const char = () => formattedInput()[(row() * columns()) + col]
                            const isHighlighted = () => highlight().includes(char())
                            return <td
                                style={isHighlighted() ? `background: #fde047;` : ""}
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