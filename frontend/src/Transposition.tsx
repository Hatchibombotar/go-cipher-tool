import { createSignal, For, onCleanup, onMount } from "solid-js";
import { InputNode } from "./nodes/InputNode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { createSwapy } from 'swapy'
import {
    NumberField,
    NumberFieldDecrementTrigger,
    NumberFieldIncrementTrigger,
    NumberFieldInput
} from "~/components/ui/number-field"

export function Transposition() {
    const [inputText, setInputText] = createSignal("JDEFO IOLWI LONUO NGPYU LAORS MSSTE AETHG IOGTI UHSOL DHUSN YOEDU HATTE TCEDA HIIAL TSETR FTERM AIOMS EOTIT HPOVE RIECE DNBAC HRNOP NKFIE TNSRO SNVIE TAIEL WRESN RSIEL TOPYA EORRP THCHW IIAEB HVENN AEUBE OLLTO AERCT EDNGA IBTEE EWNHL ITENS THEII KECNW AASUN SMTAT EHMII EASHD OMACM SIOIS NDURE FTEIN HRVSI GETAI NSTOF LOWOL IGECN REPOF ITTEE PHROT NIROS EANLS DHTST AHWSC EAOTN UNIIG OFNTU DHENT EQIRN UYHUG TOHAN OIMTU EHSRO SEMWH AAEDN GTAON HTAIR ALBRA SSINA AYPLR IKRTN EOSUS NMTAE BHVEI VELED HTSTA HWSGE AODOR OFHRE BEDTS HEATR IAFES IEULL FLFNC OERPE DYTCM UNOMI AIOCT NBTWS EENHE ETMOH FBTOL WILON UONGP TILEH STEAN TRDTI NIHKE ILWWL EUSBB YRAKB EIGHO NTSCP HEIES VEROR HNETE XFWWT EEKTH ESEOS EMRSO EDLWM DWNEO BTEVU IETAL NULMN AYAGD OCETR CTHAK EIHEC PRNER UDNAH TETHC DEEOA DCANI NRMIP OSTAT EHYUI LOWLI DTFNH CNTEO ETINN STRST EEIGA INMSE PEISL EOULD THTSW AHTOU EHGTI GHMHH VETAB EGOEN IGNBN OUION TWDRF SEIHW SMEAI SNGSI SMTHO EIGMP NIOTN TRASE INHHT DTIEA TNHEI TPRSE HAIAS HWSOK DTCEO ERAHA BUTHO TEIUA STTOO FINME PLYMO ETHYR OGSHU HEOSN DEOEP ATXNO THDNA NRDTO OSHEE SFLOW OLTAT HHTOG TTUHO TNAIS TRLCU AOCUS NLINA VOHIG ARNCR EOUID TYWNM OEQIR NUISI TEWHO TECNM OARPR YAKRB NEODS CRIIC LTSER HAATT HSITE TAIOU TNHRE SEFRE DERTI THOSE IANFN CADII LFIUL FCTTA TYHRG RSOEM NIOET NDNOE IUERL RAIRI LEFEH SASIM IIOBT NAMUW SCLRG HAETA NRHHS UDIBG TNDEA IOCUT CRTME SOTAP EHTRA STHPH RASEE OFRTN OHVLU EAAIN ATONT ENDHE PLIWO CWSTY AOLOW ALHMO SITTG ATAEH FIFET HWSIE ANEGU LAEIH IWTSE THLSE HMANE YAEPH VLNED ANTSL LOESM OFOET EORHM EAUAV LBETE LIMFO MSRTE IBHLR RATAY ANCKK ODWPR ONIEO TCTHA REELS ODDFR ELRSA EADOC NTLIO NAMTE NSHIU ACERN TIWOH SUDLL LAOHM TWIOA OFPYF IDEHS BSNDT ATFND OUHSA MICPI NYAGO MGHUI TBECO JTHTH TAEOL DCUHV ACAEH EEDIV MRORO ELSTH ESEAE OSMUC METOB SLLYE IGHEN TBOSA OKTAE VFCAU BULET AINHV GOSTB AEFRS DOOEI MMTEB UTAOT EREHT AUESS RMIIE ASHDC QAAUR DFIEO HMIRI TOLDW UHVBE AEEIT ENNNE YESLM ARABR SIGTS NOITO GFNYH ELTLW RVOEA UDPLE ATOFR STEOL HCLCI OETNO HETTC TTHIY EEASR WASTH LOEIK TRSHT UYABE SOURW LHVED ABEAL ENETD TREOI NEHSE TSEDO LADTL NHTHE ATRSL TEUIG RINPC WULEO DAEBH VENOW ELETA NRHTE NSHIU ACERN VLATA UINTW OIOLC EUDRA NLTIY AEBHV ENDAE ANEOU GRSTA TSREY UTGBP RAPEH SHRIT ESWSW KAOTT ARHKN THIGE HDERO ILNDS AEETO LCRTW EAERN TMEOU HIVCG ETVON OTNFO IGRAK RBNUT ESPSP CALEI LTOSY HEHSE WODBS WETEE CCRAU UATML EATHD TEADT CRALO FBECU SEORI RGEFO RWSBS AEIDA HNSHM ECETD FROEA DHEUT ISREN URTEN SHIIS TTSRN ETAGH TEWAH ATDTN EHRBB EOEYN VRIET GASIT OENIN DDUTE BRMMB EEETA TRHNB OKOOS EEAWR CULLT AYTLE SONOO SSNIN FIGIC NCLAT AMOUI CLAIS DREIH NWTOO SIPSB EAILG NTAKI MESNS SEEHT HTAEO LDWUW NTHAT EHLEW OSRYA ORFAR FFIOG TTROE FRTNU HRNVE IETGA SITOM IINGT ASHEI YAVLH ERUGB OHHSR TIOEN TLIHT EFEHT OIGTL HPRMT EAETL NNYPI LSOIG ISNHE ETILC OCANN HCSND EAPRA PEHSV NLEEE DNGAI TAPEO SLOIN LFCRE RACAI NITOL OFOOK RADTW ROERI HANYU RGOTO GHHUT TESSH EDESI LPCLA EUTOS IINAE JOMNY NMYIG HLDAO IYETW BSIHS HSEAR RY")
    const [columns, setColumns] = createSignal(30)
    const [columnOrder, setColumnOrder] = createSignal<number[]>([])

    const formattedInput = () => inputText().toLowerCase().replace(/ /g, "")
    const rows = () => Math.ceil(formattedInput().length / columns())

    let container!: HTMLDivElement;
    let swapy: ReturnType<typeof createSwapy>

    const [result, setResult] = createSignal("")

    const getResult = () => {
        let result = ""
        console.log(new Array(rows()))
        for (const rowS in new Array(rows()).fill(null)) {
            const row = Number(rowS)
            for (const col of columnOrder()) {
                result += formattedInput()[(row * columns()) + col] ?? ""
            }
        }
        console.log("result", result)
        return result
    }

    onMount(() => {
        swapy = createSwapy(container, {
            continuousMode: true,
            animation: "none"
        })
        swapy.onSwap((e) => {
            setColumnOrder(e.data.array.map(({ item }) => Number(item)))
            setResult(getResult())
        })
    })

    onCleanup(() => {
        swapy.enable(false)
        // swapy.cleanup()
    })

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <InputNode onChange={(t) => setInputText(t)} />
        <Card>
            <CardHeader class="pb-2 pt-5">
                <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
                <label>
                    <span class="font-semibold text-sm">Columns</span>
                    <NumberField class="w-36" defaultValue={30} onChange={(v) => setColumns(Number(v))}>
                        <div class="relative">
                            <NumberFieldInput />
                            <NumberFieldIncrementTrigger />
                            <NumberFieldDecrementTrigger />
                        </div>
                    </NumberField>
                </label>
            </CardContent>
        </Card>

        <div ref={container} class="grid gap-1 grid-rows-1 grid-flow-col w-full">
            <For each={new Array(columns())}>{(_, col) => {
                const [rowDrag, setRowDragging] = createSignal(false)
                document.addEventListener("mouseup", () => setRowDragging(false))
                return <div class="w-max h-auto" data-swapy-slot={col()}>
                    <div
                        onMouseDown={() => setRowDragging(true)}
                        class="bg-white h-full text-center border border-neutral-200 shadow-sm rounded w-auto px-2"
                        classList={{ "outline outline-offset-1": rowDrag() }}
                        data-swapy-item={col()}
                    >
                        <p class="text-sm" data-swapy-exclude>{col()}</p>
                        <div data-swapy-exclude>
                            <For each={new Array(rows())}>{(_, row) =>
                                <p>{formattedInput()[(row() * columns()) + col()]}</p>
                            }</For>
                        </div>
                    </div>
                </div>
            }}</For>
        </div>

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