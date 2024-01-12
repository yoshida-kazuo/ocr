import React, {
    ReactNode
} from 'react';

export interface User {
    name: string;
    email: string;
}
export interface SideMenu {
    route: string;
    label: string;
    icon?: JSX.Element;
}
export interface NavbarProps {
    user: User;
    lang: string;
    timezone: string;
}
export interface UserProps {
    user: User;
    header: ReactNode;
    children: ReactNode;
    lang: string;
    timezone: string;
}
