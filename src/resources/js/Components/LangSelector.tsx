import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { LangSelectorProps, LangOption } from '@/Interfaces/Components';

const LangSelector: React.FC<LangSelectorProps> = ({
    id = '',
    name = '',
    className = '',
    defaultLang = '',
}) => {
    const { t } = useTranslation();
    const [langs, setLangs] = useState<LangOption[]>([]);
    const [selectedLang, setSelectedLang] = useState<string>(defaultLang);

    useEffect(() => {
        axios.get<{ data: { [key: string]: string } }>(route('lang'))
            .then(response => {
                const langOptions: LangOption[] = Object.entries(response.data.data)
                    .map(([key, label]) => ({
                        value: key,
                        label: label
                    }));

                setLangs(langOptions);
            })
            .catch((e) => console.error(t('Failed to retrieve language.')));
    }, [t]);

    useEffect(() => {
        i18n.changeLanguage(selectedLang);
    }, [selectedLang])

    const handleLangChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const oldLang = selectedLang;
        const newLang = event.target.value;

        axios.put(route('lang-put'), { lang: newLang })
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
};

export default LangSelector;
