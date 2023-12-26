import React, { ChangeEvent } from 'react';

const Select = ({
    options = [],
    value = '',
    onChange = event => {},
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
            className={className}
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )
};

export default Select;
