import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function LangSelector({
    id = '',
    name = '',
    className = '',
    defaultLang = '',
}) {
    const { t } = useTranslation();
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
            .catch((e) => console.error(t('Failed to retrieve language.')));
    }, []);

    useEffect(() => {
        i18n.changeLanguage(selectedLang);
    }, [selectedLang, i18n]);

    const handleLangChange = event => {
        const oldLang = selectedLang,
            newLang = event.target.value;

        axios.put(route('lang-put'), {lang: newLang})
            .then(() => setSelectedLang(newLang))
            .catch(() => {
                console.error(t('Failed to configure language settings.'));

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
