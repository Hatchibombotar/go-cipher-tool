export type FormatOptions = {
	CaseMode:      FormattingMode
	RemoveUnknown: boolean
}

export enum FormattingMode {
    UnchangedCaseFormatting = 0,
	UpperCaseFormatting,
	LowerCaseFormatting,
	SentenceCaseFormatting,
}