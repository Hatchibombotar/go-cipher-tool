import { createSignal } from "solid-js";

export const [corpusMonograms, setCorpusMonograms] = createSignal<Record<string, number>>({})
export const [corpusNGrams, setCorpusNGrams] = createSignal<Record<number, Record<string, number>>>({})
export const [corpusRaw, setCorpusRaw] = createSignal<string>("")