import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import qs from 'qs';
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";

export default function Sortable({
    title,
    column,
    className='',
    ...props
}) {
    const pathname = window.location.pathname;
    const [url, setUrl] = useState();
    const [icon, setIcon] = useState();
    const iconClassName="flex-shrink-0 w-5 h-5 transition duration-75 inline-block";

    useEffect(() => {
        const query = qs.parse(
            window.location.search, {
                ignoreQueryPrefix: true
            }
        );

        if (query?.order?.[column]?.toLowerCase() === 'desc') {
            setIcon(<SortDescendingIcon className={iconClassName} />);
        }

        if (query?.order?.[column]?.toLowerCase() === 'asc') {
            query.order = {
                [column]: 'desc'
            };

            setIcon(<SortAscendingIcon className={iconClassName} />);
        } else {
            query.order = {
                [column]: 'asc'
            };
        }

        setUrl(`${pathname}?${qs.stringify(query)}`);
    }, [column, pathname, iconClassName]);

    return (
        <Link
            href={url}
            className={className}
            {...props}
        >
            {title} {icon}
        </Link>
    );
}
