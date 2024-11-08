import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { alphabet, panic, corpus_data } from "../utils";
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch";
import { corpusMonograms, corpusNGramsWithoutSpaces, corpusRaw, setCorpusNGramsWithoutSpaces } from "~/globalstate";
import { ChartData, ChartOptions } from "chart.js";
import { BarChart } from "~/components/ui/charts";

export function Substitutiton() {
    const [text, setText] = createSignal("MZDFP OCFFO YFQZY ZMXDE CTCWZ HOWCS OCYTX DSPCD WOEUC UUCNO PZDEW OKFZI ODEOC EFPZD EWOKE GDDOK OYNWC YTXKT OCDSZ GYFOE EXDUC UUCNO QPCHO SZXAW OFOTX KQYHO EFQNC FQZYE CFFPO QXAOD QCWCD XESGE FZXEI CDOPZ GEOCY TIQWW DOFGD YMZDF PIQFP UGFVY ZIQYN RGEFP ZIWZY NFPCF RZGDY OKXCK FCVOC YTPZI DOXCD VCUWK EIQMF KZGDD ZKCWX CQWSC YUOQF PZGNP FQFUO EFFZE OYTKZ GXKDO AZDFU KWOFF ODXKY OIMDQ OYTEQ YWQHO DAZZW IODOD OCWPO WAMGW CYTAD ZHQTO TXOIQ FPFPO EPQAA QYNAC AODEC WFPZG NPQCX YZFEG DOPZI XGSPC EEQEF CYSOF POKIQ WWADZ HQTOC WWQSC YEOOQ EFPCF FPOSD CFOEC WWWOM FFPOG YQFOT EFCFO EFZNO FPODC YTOCS PIOQN POTFP OECXO EGNNO EFQYN FPCFY ZFPQY NPCTU OOYFC VOYQM QYTQF XQNPF KGYWQ VOWKF PCFCY KZYOQ YFODO EFOTQ YEFOC WQYNF POSZY FOYFE ZMCEQ YNWOS DCFOI ZGWTF CVOFP OFDZG UWOFZ DOAWC SOFPO XIQFP CSCDO MGWWK SCWQU DCFOT IOQNP FZMDG UUWOZ DZFPO DYZYE OYEOC YTQYC YKSCE OFPOE OCWPC TUOOY DOAWC SOTFP CFEOO XEWQV OCYCI MGWWZ FZMFD ZGUWO MZDCM OIDQM WOECY TUZJO EZMCX XGYQF QZYIQ FPFPO SDCFO EQYEF ZDCNO FPOEO CWEPC HOUOO YDOXZ HOTAD OEGXC UWKFZ CWWZI KZGDS GEFZX EZMMQ SQCWE FZQYE AOSFF POXCY TFPCF NCHOX OCYZA AZDFG YQFKF ZOJCX QYOFP OSZYF OYFEQ FFZZV XOCWZ YNFQX OFZIZ DVFPD ZGNPF POXCW WUGFQ FEFPO TCDYO TOEFF PQYNF PODOQ EYZFP QYNXQ EEQYN CYTQX OCYYZ FPQYN YZFOH OYCEQ YNWOU GWWOF CYTIO VYZIF PCFCF WOCEF ZYOIC EWOMF ZYFPO MWZZD ZMFPO ICDOP ZGEOQ YODQY XKMDQ OYTEF OWWXO FPCFC PQYTG NOYFW OXCYP CTUOO YEOOY QYFPO HQSQY QFKZM FPOEP OTQYF POACE FYQNP FUGFQ CXXQY TOTFZ FPQYV FPCFQ ERGEF ESGFF WOUGF FMZWV EQYOD QYFCW VWQVO FPCFC UZGFE FDCYN ODECW WFPOF QXOCY TIQFP YZFPQ YNFZS ZYYOS FPQXF ZFPOS CDNZC YTYZI CKFZF DCSVP QXTZI YQFPQ YVIOS CYQNY ZDOQM YZFMZ DNOFF PONZE EQAQP ZAOFZ UOIQF PKZGC NCQYQ YFPDO OTCKE CYTWZ ZVMZD ICDTF ZTQES GEEQY NFPQE XKEFO DKIQF PKZGF POYXQ EEVCF OICDY O ")
    const [subsitution, setSubstitution] = createSignal<Record<string, string>>({});

    const [result, setResult] = createSignal("")
    const [inferSpaces, setInferSpaces] = createSignal(false)
    const [removeSpaces, setRemoveSpaces] = createSignal(true)

    const [textMonograms, setTextMonograms] = createSignal<Record<string, number>>({});
    const [resultMonograms, setResultMonograms] = createSignal<Record<string, number>>({});

    const closestMonogramsByPercent = () => {
        const total = formattedText().length
        return Object.fromEntries(
            Object.entries(textMonograms())
                .map(
                    ([k, v]) => [k, v / total]
                )
        )
    }
    const corpusMonogramsByPercent = () => {
        let total = 0
        for (const a of Object.values(corpusMonograms())) {
            total += a
        }
        return Object.fromEntries(
            Object.entries(corpusMonograms())
                .map(
                    ([k, v]) => [k, v / total]
                )
        )
    }
    createEffect(async () => {
        setTextMonograms(await CountMonograms(text()));
        setResultMonograms(await CountMonograms(result()));
    });

    onMount(async () => {
        setTextMonograms(await CountMonograms(text()));
        setResultMonograms(await CountMonograms(result()));
    });
    const chartData: () => ChartData = () => ({
        labels: alphabet,
        datasets: [
            {
                label: "Result",
                data: alphabet.map((letter) => resultMonograms()[letter]) ?? [],
                yAxisID: "y"
            },

            {
                label: "Corpus",
                data: alphabet.map((letter) => corpusMonograms()[letter]) ?? [],
                yAxisID: "y1"
            }
        ],
    });
    const chartOptions: ChartOptions = {
        animation: false,
        scales: {
            "x": {
                ticks: {
                    padding: 10,
                    autoSkip: false,
                    font: {
                        size: 12
                    },
                    maxRotation: 0,
                    minRotation: 0,
                }
            },

            y: {
                position: "left",
                ticks: {
                    font: {
                        size: 12
                    },
                    minRotation: 0
                }
            },
            y1: {
                position: "right",
                ticks: {
                    font: {
                        size: 12
                    },
                    minRotation: 0
                }
            }
        },
    };

    const [bigrams, setBigrams] = createSignal<Record<string, number>>({});
    const bigramTotal = () => Object.values(bigrams()).reduce((prev, current) => prev + current, 0)
    createEffect(countBigrams)

    async function countBigrams() {
        setBigrams(await CountNGrams(result(), 2))
    }

    const formattedText = () => {
        if (removeSpaces()) {
            return text().replace(/ /g, "")
        } else {
            return text()
        }
    }

    createEffect(substitute)

    const [resultText, setResultText] = createSignal("")

    async function substitute() {
        const subsitution_with_runes = Object.fromEntries(
            Object.entries(subsitution()).map(([k, v]) => [k.charCodeAt(0), v.charCodeAt(0)])
        )
        const decoded = await DecodeSubsitutionCipher(formattedText(), subsitution_with_runes)
        setResult(decoded)

        if (inferSpaces()) {
            const withspaces = await InferSpaces(decoded)
            setResultText(withspaces)
        } else {
            setResultText(decoded)
        }
        setResultMonograms(await CountMonograms(result()));
    }

    function fillRemaining(currentSubstitution: Record<string, string> = { ...subsitution() }) {
        let remaining_letters = [...alphabet].filter(
            (letter) => {
                return !Object.values(currentSubstitution).includes(letter);
            }
        );
        for (const char of alphabet) {
            if (currentSubstitution[char] == undefined) {
                currentSubstitution[char] = remaining_letters[0] ?? panic("cannot find letters to fill.");
                remaining_letters = remaining_letters.filter(l => l != remaining_letters[0]);

            } else {
                if (remaining_letters.includes(currentSubstitution[char])) {
                    remaining_letters = remaining_letters.filter(l => l != currentSubstitution[char]);
                }
            }
        }
        setSubstitution(currentSubstitution);
    }
    async function fillByFrequency() {
        const input_frequencies = await CountMonograms(text());
        const sorted_input = Object.entries(input_frequencies).sort(([, a], [, b]) => a - b);

        const corpus_frequencies = corpus_data.monograms;
        const sorted_corpus = Object.entries(corpus_frequencies).sort(([, a], [, b]) => a - b);

        const substitution: Record<string, string> = {};
        for (const [index, [expected_char]] of Object.entries(sorted_corpus)) {
            const [character] = sorted_input[Number(index)] ?? [];
            if (character == undefined) {
                break;
            }
            substitution[character] = expected_char;
        }

        fillRemaining();
        setSubstitution(substitution);
    }

    async function initNGramsIfNotDone(n: number) {
        n ??= 0
        n = Math.floor(n)
        if (!(n in corpusNGramsWithoutSpaces())) {
            const prev = corpusNGramsWithoutSpaces()
            prev[n] = await CountNGrams(corpusRaw().replace(/ /g, ""), n)
            setCorpusNGramsWithoutSpaces({ ...prev })
        }
        return true
    }

    function removeFromSubstitution(substitution: Record<string, string>, c: string) {
        if (!false && Object.values(substitution).includes(c)) {
            for (const [k, v] of Object.entries(substitution)) {
                if (v == c) {
                    delete substitution[k];
                }
            }
        }
        return subsitution
    }
    initNGramsIfNotDone(2)
    const corpusBigramTotal = () => Object.values(corpusNGramsWithoutSpaces()[2] ?? {}).reduce((prev, current) => prev + current, 0)

    return <div class="min-h-full flex gap-2 flex-col w-full">
        <div class="bg-white px-2 border rounded-lg">
            <p class="font-semibold text-sm mt-1">Input:</p>
            <textarea class="border-none w-full h-48 text-sm" value={text()} placeholder="Type your message here." onInput={(e) => {
                setText(e.currentTarget.value)
            }} ></textarea>

            <Switch class="flex items-center gap-2 my-2" onChange={(isChecked) => setRemoveSpaces(isChecked)} defaultChecked={removeSpaces()}>
                <SwitchControl>
                    <SwitchThumb />
                </SwitchControl>
                <SwitchLabel>Remove Spaces</SwitchLabel>
            </Switch>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div class="bg-white px-2 border rounded-lg">
                <p class="font-semibold text-sm mt-1">Substitute Monograms:</p>

                <div class="flex flex-row gap-1 flex-wrap">
                    <For each={alphabet}>{(char) => {
                        let input!: HTMLInputElement;
                        function set(to: string) {
                            input.value = to;
                            const newSubsitution = { ...subsitution() };

                            if (!false && Object.values(newSubsitution).includes(to)) {
                                for (const [k, v] of Object.entries(newSubsitution)) {
                                    if (v == to) {
                                        delete newSubsitution[k];
                                    }
                                }
                            }

                            newSubsitution[char] = to;

                            fillRemaining(newSubsitution);
                            setSubstitution(newSubsitution);
                        }

                        const closestMonogramsGuarenteed = () => {
                            const me = closestMonogramsByPercent()[char]
                            const orderedCloseness = Object.entries(corpusMonogramsByPercent()).sort(
                                ([k1, v1], [k2, v2]) => Math.abs(v1 - me) - Math.abs(v2 - me)
                            )
                            return orderedCloseness.map((([k, v]) => k)).slice(0, 5)
                        }
                        const closestMonograms = () => {
                            const me = closestMonogramsByPercent()[char]
                            const orderedCloseness = Object.entries(corpusMonogramsByPercent()).sort(
                                ([k1, v1], [k2, v2]) => Math.abs(v1 - me) - Math.abs(v2 - me)
                            )
                            return orderedCloseness.filter((([k, v]) => Math.abs(v - me) < 4 / 100)).map(([k, v]) => k)
                        }
                        return <div class="flex flex-col items-center">
                            <span>{char}</span>
                            <div class="group relative h-8">
                                <input ref={input} value={subsitution()[char] ?? ""} class="border rounded w-8 h-8 text-center" onKeyDown={(e) => {
                                    if (alphabet.includes(e.key)) {
                                        set(e.key)
                                    } else if (e.key == "Tab") {
                                        return;
                                    } else if (e.key == "Backspace") {
                                        e.currentTarget.value = "";
                                        return;
                                    }
                                    e.preventDefault();
                                }}>
                                </input>
                                <div class="hidden group-focus-within:!flex flex-wrap gap-1 w-48 absolute bg-neutral-50 p-1 mt-2 z-50 border">
                                    <For each={closestMonograms()}>{(suggested) =>
                                        <button
                                            onClick={() => {set(suggested)
                                                document.body.focus()
                                            }
                                            }
                                            class="bg-white cursor-pointer border rounded w-8 h-8 text-center flex items-center justify-center">
                                            {suggested}
                                        </button>
                                    }</For>
                                </div>
                            </div>
                        </div>
                    }}</For>
                </div>

                <div class="flex flex-row gap-1 my-2">
                    <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => fillRemaining()}>Fill Remaining</button>
                    <button class="bg-black text-white rounded-md px-2 py-1" onClick={() => fillByFrequency()}>Fill by Frequency</button>
                </div>

                <hr></hr>

                <p class="font-semibold text-sm mt-1">Substitute Bigrams:</p>

                <div class="h-96 overflow-auto grid grid-cols-2 gap-1">
                    <table class="ngram-table">
                        <tbody>
                            <tr>
                                <th class="px-3">bigram</th>
                                <th class="px-3">input (%)</th>
                            </tr>
                            <For each={Object.entries(bigrams()).toSorted(([, a], [, b]) => b - a)}>{([k, v]) => {
                                const [showEdit, setShowEdit] = createSignal(false)
                                const [val, setVal] = createSignal(k)
                                let input!: HTMLInputElement
                                return <tr>
                                    <td>
                                        <button class="relative" onClick={() => {
                                            setShowEdit(!showEdit())
                                            if (showEdit()) {
                                                input.focus()
                                                setVal("")
                                            }
                                        }}>
                                            <span>{k}</span>
                                            <div class="absolute border z-50" onClick={(e) => e.stopPropagation()} classList={{ "hidden": !showEdit() }}>
                                                <input
                                                    ref={input}
                                                    value={val()}
                                                    placeholder={k}
                                                    onInput={(e) => {
                                                        console.log(e)
                                                        if (e.target.value.length > 2) {
                                                            setVal(e.target.value.slice(0, 2))
                                                        } else {
                                                            setVal(e.target.value)
                                                        }
                                                        input.value = val()
                                                    }}
                                                    onKeyDown={async (e) => {
                                                        if (e.key == "Enter") {
                                                            const newSub = subsitution()
                                                            console.log(k, val())

                                                            // removeFromSubstitution(newSub, val()[0])
                                                            // removeFromSubstitution(newSub, val()[1])

                                                            // has to be what the things are set asx

                                                            for (const [key, value] of Object.entries(newSub)) {
                                                                if (value == val()[0]) {
                                                                    delete newSub[key]
                                                                }
                                                                if (value == val()[1]) {
                                                                    delete newSub[key]
                                                                }
                                                            }

                                                            for (const [key, value] of Object.entries(newSub)) {
                                                                if (value == k[0]) {
                                                                    newSub[key] = val()[0]
                                                                }
                                                                if (value == k[1]) {
                                                                    newSub[key] = val()[1]
                                                                }
                                                            }

                                                            // newSub[k[0]] = val()[0]
                                                            // newSub[k[1]] = val()[1]

                                                            setSubstitution({ ...newSub })

                                                            fillRemaining()
                                                            setShowEdit(false)
                                                            await countBigrams()
                                                            await substitute()
                                                        }
                                                    }}
                                                ></input>
                                            </div>
                                        </button>
                                    </td>
                                    <td>{Math.round(v / bigramTotal() * 100 * 100) / 100}</td>
                                </tr>
                            }}</For>
                        </tbody>
                    </table>

                    <table class="ngram-table">
                        <tbody>
                            <tr>
                                <th class="">bigram</th>
                                <th class="">input (%)</th>
                            </tr>
                            <For each={Object.entries(corpusNGramsWithoutSpaces()[2] ?? {}).toSorted(([, a], [, b]) => b - a)}>{([k, v]) =>
                                <tr>
                                    <td>{k}</td>
                                    <td>{Math.round(v / corpusBigramTotal() * 100 * 100) / 100}</td>
                                </tr>
                            }</For>
                        </tbody>
                    </table>
                </div>

            </div>
            <div class="bg-white px-2 border rounded-lg">
                <p class="font-semibold text-sm mt-1">Result:</p>
                <textarea readOnly class="w-full h-96 ">{resultText()}</textarea>

                <Switch class="flex items-center gap-2 my-2" onChange={(isChecked) => { setInferSpaces(isChecked); substitute() }} defaultChecked={false}>
                    <SwitchControl>
                        <SwitchThumb />
                    </SwitchControl>
                    <SwitchLabel>Infer Spaces</SwitchLabel>
                </Switch>

                <p class="font-semibold text-sm mt-1">Monogram Frequency:</p>
                <div class="h-96">
                    <BarChart data={chartData()} options={chartOptions} />
                </div>
            </div>
        </div>
    </div>
}