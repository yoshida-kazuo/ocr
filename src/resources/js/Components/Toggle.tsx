import React from 'react';
import { ToggleProps } from '@/Interfaces/Components';

const Toggle: React.FC<ToggleProps> = ({
    className = '',
    ...props
}) => {
    return (
        <input
            {...props}
            type="checkbox"
            className={`toggle ${className}`}
        />
    );
};

export default Toggle;
