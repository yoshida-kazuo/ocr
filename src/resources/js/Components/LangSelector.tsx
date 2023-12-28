import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';

const LangSelector = ({id='', name='', className='', defaultLang=''}) => {
    const { i18n } = useTranslation();
    const [langs, setLangs] = useState([]);
    const [selectedLang, setSelectedLang] = useState(defaultLang);

    useEffect(() => {
        axios.get(route('guest-lang'))
            .then(response => {
                setLangs(
                    Object.entries(response.data.data)
                        .map(([key, label]) => ({
                            value: key,
                            label: label
                        }))
                );
            })
            .catch(error => console.error('言語取得に失敗'));
    }, []);

    const handleLangChange = (event) => {
        const oldLang = selectedLang,
            newLang = event.target.value;
        setSelectedLang(newLang);

        axios.put(route('guest-lang-put'), {lang: newLang})
            .then(response => {
                i18n.changeLanguage(newLang);
            })
            .catch(error => {
                console.error('言語設定に失敗');

                setSelectedLang(oldLang);
            });
    };

    return (
        <Select
            name={name}
            value={selectedLang}
            onChange={handleLangChange}
            options={langs}
            className={className}
        />
    )
};

export default LangSelector;
