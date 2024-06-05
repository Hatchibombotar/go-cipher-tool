import { F as FormControlDataSet, a as FormControlDescription, b as FormControlErrorMessage, c as FormControlDescriptionCommonProps, d as FormControlDescriptionOptions, e as FormControlDescriptionProps, f as FormControlDescriptionRenderProps, g as FormControlErrorMessageCommonProps, h as FormControlErrorMessageOptions, i as FormControlErrorMessageProps, j as FormControlErrorMessageRenderProps } from './form-control-error-message-7d91602e.js';
import { F as FormControlLabel, a as FormControlLabelCommonProps, b as FormControlLabelOptions, c as FormControlLabelProps, d as FormControlLabelRenderProps } from './form-control-label-fea2aaa3.js';
import { JSX, ValidComponent } from 'solid-js';
import { ElementOf, PolymorphicProps } from './polymorphic/index.js';
import { ValidationState } from '@kobalte/utils';

interface TextFieldInputOptions {
}
interface TextFieldInputCommonProps<T extends HTMLElement = HTMLElement> {
    id: string;
    onInput: JSX.EventHandlerUnion<T, InputEvent>;
    "aria-label": string | undefined;
    "aria-labelledby": string | undefined;
    "aria-describedby": string | undefined;
}
interface TextFieldInputRenderProps extends TextFieldInputCommonProps, FormControlDataSet {
    name: string;
    value: string | undefined;
    required: boolean | undefined;
    disabled: boolean | undefined;
    readonly: boolean | undefined;
    "aria-invalid": boolean | undefined;
    "aria-required": boolean | undefined;
    "aria-disabled": boolean | undefined;
    "aria-readonly": boolean | undefined;
}
type TextFieldInputProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldInputOptions & Partial<TextFieldInputCommonProps<ElementOf<T>>>;
declare function TextFieldInput<T extends ValidComponent = "input">(props: PolymorphicProps<T, TextFieldInputProps<T>>): JSX.Element;

interface TextFieldRootOptions {
    /** The controlled value of the text field. */
    value?: string;
    /**
     * The default value when initially rendered.
     * Useful when you do not need to control the value.
     */
    defaultValue?: string;
    /** Event handler called when the value of the text field changes. */
    onChange?: (value: string) => void;
    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;
    /**
     * The name of the text field, used when submitting an HTML form.
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
     */
    name?: string;
    /** Whether the text field should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;
    /** Whether the user must fill the text field before the owning form can be submitted. */
    required?: boolean;
    /** Whether the text field is disabled. */
    disabled?: boolean;
    /** Whether the text field is read only. */
    readOnly?: boolean;
}
interface TextFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
    id: string;
    ref: T | ((el: T) => void);
}
interface TextFieldRootRenderProps extends TextFieldRootCommonProps, FormControlDataSet {
    role: "group";
}
type TextFieldRootProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldRootOptions & Partial<TextFieldRootCommonProps<ElementOf<T>>>;
/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
declare function TextFieldRoot<T extends ValidComponent = "div">(props: PolymorphicProps<T, TextFieldRootProps<T>>): JSX.Element;

interface TextFieldTextAreaOptions {
    /** Whether the textarea should adjust its height when the value changes. */
    autoResize?: boolean;
    /** Whether the form should be submitted when the user presses the enter key. */
    submitOnEnter?: boolean;
}
interface TextFieldTextAreaCommonProps<T extends HTMLElement = HTMLElement> extends TextFieldInputCommonProps<T> {
    ref: T | ((el: T) => void);
    onKeyPress: JSX.EventHandlerUnion<T, KeyboardEvent>;
}
interface TextFieldTextAreaRenderProps extends TextFieldTextAreaCommonProps, TextFieldInputRenderProps {
    "aria-multiline": string | undefined;
}
type TextFieldTextAreaProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldTextAreaOptions & Partial<TextFieldTextAreaCommonProps<ElementOf<T>>>;
/**
 * The native html textarea of the textfield.
 */
declare function TextFieldTextArea<T extends ValidComponent = "textarea">(props: PolymorphicProps<T, TextFieldTextAreaProps<T>>): JSX.Element;

declare const TextField: typeof TextFieldRoot & {
    Description: typeof FormControlDescription;
    ErrorMessage: typeof FormControlErrorMessage;
    Input: typeof TextFieldInput;
    Label: typeof FormControlLabel;
    TextArea: typeof TextFieldTextArea;
};

declare const index_TextField: typeof TextField;
type index_TextFieldInputCommonProps<T extends HTMLElement = HTMLElement> = TextFieldInputCommonProps<T>;
type index_TextFieldInputOptions = TextFieldInputOptions;
type index_TextFieldInputProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldInputProps<T>;
type index_TextFieldInputRenderProps = TextFieldInputRenderProps;
type index_TextFieldRootCommonProps<T extends HTMLElement = HTMLElement> = TextFieldRootCommonProps<T>;
type index_TextFieldRootOptions = TextFieldRootOptions;
type index_TextFieldRootProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldRootProps<T>;
type index_TextFieldRootRenderProps = TextFieldRootRenderProps;
type index_TextFieldTextAreaCommonProps<T extends HTMLElement = HTMLElement> = TextFieldTextAreaCommonProps<T>;
type index_TextFieldTextAreaOptions = TextFieldTextAreaOptions;
type index_TextFieldTextAreaProps<T extends ValidComponent | HTMLElement = HTMLElement> = TextFieldTextAreaProps<T>;
type index_TextFieldTextAreaRenderProps = TextFieldTextAreaRenderProps;
declare namespace index {
  export {
    FormControlDescription as Description,
    FormControlErrorMessage as ErrorMessage,
    TextFieldInput as Input,
    FormControlLabel as Label,
    TextFieldRoot as Root,
    TextFieldTextArea as TextArea,
    index_TextField as TextField,
    FormControlDescriptionCommonProps as TextFieldDescriptionCommonProps,
    FormControlDescriptionOptions as TextFieldDescriptionOptions,
    FormControlDescriptionProps as TextFieldDescriptionProps,
    FormControlDescriptionRenderProps as TextFieldDescriptionRenderProps,
    FormControlErrorMessageCommonProps as TextFieldErrorMessageCommonProps,
    FormControlErrorMessageOptions as TextFieldErrorMessageOptions,
    FormControlErrorMessageProps as TextFieldErrorMessageProps,
    FormControlErrorMessageRenderProps as TextFieldErrorMessageRenderProps,
    index_TextFieldInputCommonProps as TextFieldInputCommonProps,
    index_TextFieldInputOptions as TextFieldInputOptions,
    index_TextFieldInputProps as TextFieldInputProps,
    index_TextFieldInputRenderProps as TextFieldInputRenderProps,
    FormControlLabelCommonProps as TextFieldLabelCommonProps,
    FormControlLabelOptions as TextFieldLabelOptions,
    FormControlLabelProps as TextFieldLabelProps,
    FormControlLabelRenderProps as TextFieldLabelRenderProps,
    index_TextFieldRootCommonProps as TextFieldRootCommonProps,
    index_TextFieldRootOptions as TextFieldRootOptions,
    index_TextFieldRootProps as TextFieldRootProps,
    index_TextFieldRootRenderProps as TextFieldRootRenderProps,
    index_TextFieldTextAreaCommonProps as TextFieldTextAreaCommonProps,
    index_TextFieldTextAreaOptions as TextFieldTextAreaOptions,
    index_TextFieldTextAreaProps as TextFieldTextAreaProps,
    index_TextFieldTextAreaRenderProps as TextFieldTextAreaRenderProps,
  };
}

export { TextFieldInputOptions as T, TextFieldInputCommonProps as a, TextFieldInputRenderProps as b, TextFieldInputProps as c, TextFieldRootOptions as d, TextFieldRootCommonProps as e, TextFieldRootRenderProps as f, TextFieldRootProps as g, TextFieldTextAreaOptions as h, index as i, TextFieldTextAreaCommonProps as j, TextFieldTextAreaRenderProps as k, TextFieldTextAreaProps as l, TextFieldInput as m, TextFieldRoot as n, TextFieldTextArea as o, TextField as p };
