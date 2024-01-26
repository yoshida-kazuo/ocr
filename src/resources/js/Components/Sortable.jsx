import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import qs from 'qs';
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";

export default function Sortable({
    title,
    column,
    className='',
    ...props
}) {
    const location = usePage().props.ziggy;
    const [url, setUrl] = useState();
    const [icon, setIcon] = useState();
    const iconClassName="flex-shrink-0 w-5 h-5 transition duration-75 inline-block";
    const { url: currentUrl } = usePage();

    useEffect(() => {
        const query = qs.parse(
            new URL(`${location.url}${currentUrl}`).search, {
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

        setUrl(`${location.path}?${qs.stringify(query)}`);
    }, [column, location, currentUrl, iconClassName]);

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
