import React from 'react';
import { InputLabelProps } from '@/Interfaces/Components';

const InputLabel: React.FC<InputLabelProps> = ({
    value,
    className = '',
    children,
    ...props
}) => {
    return (
        <label {...props} className={`label ${className}`}>
            {value ? value : children}
        </label>
    );
};

export default InputLabel;
