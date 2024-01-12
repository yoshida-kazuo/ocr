import React, {
    ReactNode,
    ButtonHTMLAttributes,
    ChangeEvent,
    TextareaHTMLAttributes,
    InputHTMLAttributes
} from 'react';
import { InertiaLinkProps } from '@inertiajs/react';

export interface ApplicationProps {
    className?: string;
}
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    //
}
export interface DangerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: React.ReactNode;
}
export interface InputErrorProps {
    message?: string;
    className?: string;
}
export interface InputLabelProps {
    value?: string;
    className?: string;
    children?: React.ReactNode;
    htmlFor?: string;
}
export interface LangSelectorProps {
    id?: string;
    name?: string;
    className?: string;
    defaultLang?: string;
}
export interface LangOption {
    value: string;
    label: string;
}
export interface ModalProps {
    children: ReactNode;
    show?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose?: () => void;
}
export interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
    className?: string;
    children: ReactNode;
}
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
export interface PaginationItems {
    links: PaginationLink[];
}
export interface PaginationProps {
    items: PaginationItems;
}
export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: ReactNode;
}
export interface ResponsiveNavLinkProps extends NavLinkProps {
    active?: boolean;
    className?: string;
    children: ReactNode;
}
export interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: ReactNode;
}
export interface SelectOption {
    value: string;
    label: string;
}
export interface SelectProps {
    options?: SelectOption[];
    value?: string;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
    id?: string;
    name?: string;
    className?: string;
}
export interface SortableProps extends InertiaLinkProps {
    title: string;
    column: string;
    className?: string;
}
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    isFocused?: boolean;
}
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    type?: string;
    className?: string;
    isFocused?: boolean;
}
export interface TimezoneSelectorProps {
    id?: string;
    name?: string;
    className?: string;
    defaultTimezone?: string;
}
export interface TimezoneOption {
    value: string;
    label: string;
}
export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}
