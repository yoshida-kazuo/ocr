import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';

export default function LangSelector({
    id = '',
    name = '',
    className = '',
    defaultLang = ''
}) {
    const { i18n } = useTranslation();
    const [langs, setLangs] = useState([]);
    const [selectedLang, setSelectedLang] = useState(defaultLang);

    useEffect(() => {
        axios.get(route('lang'))
            .then(response => {
                const lang = Object.entries(response.data.data)
                    .map(([key, label]) => ({
                        value: key,
                        label: label
                    }));

                setLangs(lang);
            })
            .catch(() => console.error('言語取得に失敗'));
    }, []);

    const handleLangChange = event => {
        const oldLang = selectedLang,
            newLang = event.target.value;
        setSelectedLang(newLang);

        axios.put(route('lang-put'), {lang: newLang})
            .then(() => {
                i18n.changeLanguage(newLang);
            })
            .catch(() => {
                console.error('言語設定に失敗');

                setSelectedLang(oldLang);
            });
    };

    return (
        <Select
            id={id}
            name={name}
            value={selectedLang}
            onChange={handleLangChange}
            options={langs}
            className={className}
        />
    );
}
