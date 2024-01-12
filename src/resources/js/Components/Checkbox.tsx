import React from 'react';
import { CheckboxProps } from '@/Interfaces/Components';

const Checkbox: React.FC<CheckboxProps> = ({
    className='',
    ...props
}) => {
    return (
        <input
            {...props}
            type="checkbox"
            className={`checkbox ${className}`}
        />
    );
};

export default Checkbox;
