declare global {
    function ColumnarTransposition(arg1: string, arg2: number, arg3: Array<number>): Promise<string>;

    function CountMonograms(arg1: string): Promise<{ [key: string]: number }>;

    function DecodeCaesarCipher(arg1: string, arg2: number): Promise<string>;

    function DecodePolybiusCipher(arg1: string, arg2: string): Promise<string>;

    function DecodeSubsitutionCipher(arg1: string, arg2: { [key: number]: number }): Promise<string>;

    function Format(arg1: string, arg2: any): Promise<string>;

    function Greet(arg1: string): Promise<string>;

    function InferSpaces(arg1: string): Promise<string>;

    function MonogramIndexOfCoincidence(arg1: string): Promise<number>;
}

export default global