import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import qs from 'qs';
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";
import { SortableProps } from '@/Interfaces/Components';

const Sortable: React.FC<SortableProps> = ({
    title,
    column,
    className = '',
    ...props
}) => {
    const pathname = window.location.pathname;
    const [url, setUrl] = useState<string>('');
    const [icon, setIcon] = useState<ReactNode>(null);
    const iconClassName = "flex-shrink-0 w-5 h-5 transition duration-75 inline-block";

    useEffect(() => {
        const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        let newIcon: ReactNode = null;

        if (query?.order?.[column]?.toLowerCase() === 'desc') {
            newIcon = <SortDescendingIcon className={iconClassName} />;
        }

        if (query?.order?.[column]?.toLowerCase() === 'asc') {
            query.order = { [column]: 'desc' };
            newIcon = <SortAscendingIcon className={iconClassName} />;
        } else {
            query.order = { [column]: 'asc' };
        }

        setIcon(newIcon);
        setUrl(`${pathname}?${qs.stringify(query)}`);
    }, [column, pathname, iconClassName]);

    return (
        <Link href={url} className={className} {...props}>
            {title} {icon}
        </Link>
    );
};

export default Sortable;
