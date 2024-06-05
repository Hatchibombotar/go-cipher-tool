import * as solid_js from 'solid-js';
import { Accessor, ValidComponent } from 'solid-js';
import { ElementOf, PolymorphicProps } from './polymorphic/index.js';
import { ValidationState } from '@kobalte/utils';

interface FormControlDataSet {
    "data-valid": string | undefined;
    "data-invalid": string | undefined;
    "data-required": string | undefined;
    "data-disabled": string | undefined;
    "data-readonly": string | undefined;
}
interface FormControlContextValue {
    name: Accessor<string>;
    dataset: Accessor<FormControlDataSet>;
    validationState: Accessor<ValidationState | undefined>;
    isRequired: Accessor<boolean | undefined>;
    isDisabled: Accessor<boolean | undefined>;
    isReadOnly: Accessor<boolean | undefined>;
    labelId: Accessor<string | undefined>;
    fieldId: Accessor<string | undefined>;
    descriptionId: Accessor<string | undefined>;
    errorMessageId: Accessor<string | undefined>;
    getAriaLabelledBy: (fieldId: string | undefined, fieldAriaLabel: string | undefined, fieldAriaLabelledBy: string | undefined) => string | undefined;
    getAriaDescribedBy: (fieldAriaDescribedBy: string | undefined) => string | undefined;
    generateId: (part: string) => string;
    registerLabel: (id: string) => () => void;
    registerField: (id: string) => () => void;
    registerDescription: (id: string) => () => void;
    registerErrorMessage: (id: string) => () => void;
}
declare const FormControlContext: solid_js.Context<FormControlContextValue | undefined>;
declare function useFormControlContext(): FormControlContextValue;

interface FormControlDescriptionOptions {
}
interface FormControlDescriptionCommonProps<T extends HTMLElement = HTMLElement> {
    id: string;
}
interface FormControlDescriptionRenderProps extends FormControlDescriptionCommonProps, FormControlDataSet {
}
type FormControlDescriptionProps<T extends ValidComponent | HTMLElement = HTMLElement> = FormControlDescriptionOptions & Partial<FormControlDescriptionCommonProps<ElementOf<T>>>;
/**
 * The description that gives the user more information on the form control.
 */
declare function FormControlDescription<T extends ValidComponent = "div">(props: PolymorphicProps<T, FormControlDescriptionProps<T>>): solid_js.JSX.Element;

interface FormControlErrorMessageOptions {
    /**
     * Used to force mounting when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;
}
interface FormControlErrorMessageCommonProps<T extends HTMLElement = HTMLElement> {
    id: string;
}
interface FormControlErrorMessageRenderProps extends FormControlErrorMessageCommonProps, FormControlDataSet {
}
type FormControlErrorMessageProps<T extends ValidComponent | HTMLElement = HTMLElement> = FormControlErrorMessageOptions & Partial<FormControlErrorMessageCommonProps<ElementOf<T>>>;
/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
declare function FormControlErrorMessage<T extends ValidComponent = "div">(props: PolymorphicProps<T, FormControlErrorMessageProps<T>>): solid_js.JSX.Element;

export { FormControlDataSet as F, FormControlDescription as a, FormControlErrorMessage as b, FormControlDescriptionCommonProps as c, FormControlDescriptionOptions as d, FormControlDescriptionProps as e, FormControlDescriptionRenderProps as f, FormControlErrorMessageCommonProps as g, FormControlErrorMessageOptions as h, FormControlErrorMessageProps as i, FormControlErrorMessageRenderProps as j, FormControlContextValue as k, FormControlContext as l, useFormControlContext as u };
