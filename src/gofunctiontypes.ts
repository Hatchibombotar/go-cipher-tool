export type FormatOptions = {
	CaseMode:      FormattingMode
	RemoveUnknown: boolean
}

export const enum FormattingMode {
    UnchangedCaseFormatting = 0,
	UpperCaseFormatting,
	LowerCaseFormatting,
	SentenceCaseFormatting,
}