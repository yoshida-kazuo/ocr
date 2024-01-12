export interface Errors {
    name?: string;
    email?: string;
    role_id?: string;
    is_login_prohibited?: string;
}
export interface User {
    id: number;
    role: {
        role: string;
    };
    name: string;
    email: string;
    role_id: number;
    deleted_at?: string;
    login_ban_at?: string;
    updated_at: string;
    created_at: string;
}
export interface Users {
    data: User[];
}
export interface Role {
    id: number;
    role: string;
}
export interface Auth {
    user: User;
}
export interface DashboardProps {
    auth: Auth;
    lang: string;
    timezone: string;
    requests?: string;
}
export interface EditProps {
    auth: Auth;
    mustVerifyEmail: boolean;
    status?: string;
    lang: string;
    timezone: string;
}
export interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}
export interface UpdatePasswordFormProps {
    className?: string;
}
export interface DeleteUserFormProps {
    className?: string;
}
export interface Activity {
    id: number;
    created_at: string;
    type: string;
    user?: User;
    message: string;
}
export interface Activities {
    data: Activity[];
}
export interface ActivityIndexProps {
    auth: Auth;
    lang: string;
    timezone: string;
    activities: Activities;
}
export interface UserManagerIndexProps {
    auth: Auth;
    lang: string;
    timezone: string;
    users: Users;
}
export interface UserManagerEditProps {
    auth: Auth;
    lang: string;
    timezone: string;
    user: User;
    roles: Role[];
    errors: Errors;
}
export interface AuthVerifyEmailProps {
    status?: string;
    lang: string;
    timezone: string;
    requests?: string;
}
export interface AuthResetPasswordProps {
    token: string;
    email: string;
    lang: string;
    timezone: string;
}
export interface AuthRegisterProps {
    lang: string;
    timezone: string;
}
export interface AuthConfirmPasswordProps {
    lang: string;
    timezone: string;
}
export interface AuthLoginProps {
    status?: string;
    canResetPassword: boolean;
    googleAuth: boolean;
    lang: string;
    timezone: string;
    errors: {
        email?: string;
        password?: string;
        google_auth?: string;
    };
}
export interface AuthForgotPasswordProps {
    status?: string;
    lang: string;
    timezone: string;
}
export interface HomeProps {
    auth: Auth;
    lang: string;
}
export interface ContactIndexProps {
    auth: Auth;
    lang: string;
    timezone: string;
    errors: {
        name?: string;
        email?: string;
        message?: string;
    };
}
