import React, { forwardRef, useEffect, useRef } from 'react';
import { TextInputProps } from '@/Interfaces/Components';

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
    type = 'text',
    className = '',
    isFocused = false,
    ...props
}, ref) => {
    const inputRef = ref || useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused, inputRef]);

    return (
        <input
            {...props}
            type={type}
            className={`input input-bordered w-full ${className}`}
            ref={inputRef}
        />
    );
});

export default TextInput;
