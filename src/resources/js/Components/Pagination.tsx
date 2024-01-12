import React from 'react';
import { Link } from '@inertiajs/react';
import { PaginationProps } from '@/Interfaces/Components';

const Pagination: React.FC<PaginationProps> = ({
    items
}) => {
    return (
        <div className="join">
            {items.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || ''}
                    className={
                        `join-item btn btn-sm${! link.url ? ' btn-disabled' : ''}${link.active ? ' btn-active' : ''}`
                    }
                >
                    <span dangerouslySetInnerHTML={{ __html: decodeURI(link.label) }} />
                </Link>
            ))}
        </div>
    );
};

export default Pagination;
