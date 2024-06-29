// TODO: this shouldn't be hardcoded
export const corpus_data = { "length": 29106, "monograms": { "a": 2205, "b": 478, "c": 818, "d": 1203, "e": 3780, "f": 580, "g": 539, "h": 1722, "i": 2181, "j": 24, "k": 236, "l": 1126, "m": 687, "n": 1939, "o": 2280, "p": 486, "q": 24, "r": 1737, "s": 1672, "t": 2956, "u": 818, "v": 351, "w": 614, "x": 37, "y": 613, "z": 0 } };

export function panic(err: Error | string = "error"): never {
  throw err
}

export function assertError(err: any) {
  if (typeof err == "string") {
    return new Error(err)
  } else if (err instanceof Error) {
    return err
  } else {
    console.error(err)
    return new Error("Unexpected error type, view error in console.", {
      cause: err
    })
  }
}

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
