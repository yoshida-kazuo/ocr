import React from 'react';
import { SelectProps } from '@/Interfaces/Components';

const Select: React.FC<SelectProps> = ({
    options = [],
    value = '',
    onChange = () => {},
    id = '',
    name = '',
    className = ''
}) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`select w-full max-w-xs ${className}`}
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
};

export default Select;
