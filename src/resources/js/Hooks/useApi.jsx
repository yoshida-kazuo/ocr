import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react'

const useApi = () => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});

    const api = (url, { method, data = {}, params =  {}}) => {
        setErrors({});

        return axios({
            url,
            method,
            data: method.toLowerCase() === 'get' ? null : data,
            params: method.toLowerCase() === 'get' ? data : params,
        }).catch((error) => {
            switch(error.response.status) {
                case 401:
                    router.visit(route('login'));
                    break;
                case 403:
                    setErrors({"_other_": t('You do not have execution permission.')});
                    break;
                case 422:
                    setErrors(error.response.data.errors);
                    break;
                default:
                    setErrors({"_other_": t('An error has occurred. Please try reloading.')});
            }

            throw error;
        });
    };

    const post = (url, data = {}) => {
        return api(url, { method: 'post', ...data });
    };

    const get = (url, params = {}) => {
        return api(url, { method: 'get', ...params });
    };

    return { api, post, get, errors };
};

export default useApi;
