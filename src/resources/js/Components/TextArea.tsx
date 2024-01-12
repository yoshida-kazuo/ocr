import React, {
    forwardRef,
    useEffect,
    useRef,
    TextareaHTMLAttributes
} from 'react';
import { TextAreaProps } from '@/Interfaces/Components';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    className = '',
    isFocused = false,
    ...props
}, ref) => {
    const textareaRef = ref || useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isFocused && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isFocused, textareaRef]);

    return (
        <textarea
            {...props}
            className={`textarea textarea-bordered textarea-md w-full ${className}`}
            ref={textareaRef}
        />
    );
});

export default TextArea;
