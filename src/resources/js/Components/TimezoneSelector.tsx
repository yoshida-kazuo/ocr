import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';
import { TimezoneSelectorProps } from '@/Interfaces/Components';

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
    id = '',
    name = '',
    className = '',
    defaultTimezone = ''
}) => {
    const { t } = useTranslation();
    const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(defaultTimezone);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        axios.get<{ data: { [key: string]: string } }>(route('timezone'))
            .then(response => {
                setTimezones(
                    Object.entries(response.data.data)
                        .map(([key, label]) => ({
                            value: key,
                            label: label
                        }))
                );
            })
            .catch(error => console.error(t('Failed to retrieve a list of time zones.')));
    }, [t]);

    const handleTimezoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setIsLoading(true);

        const oldTimezone = selectedTimezone;
        setSelectedTimezone(event.target.value);

        axios.put(route('timezone-put'), {timezone: event.target.value})
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.error(t('Failed to set the time zone'));
                setSelectedTimezone(oldTimezone);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Select
            id={id}
            name={name}
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            options={timezones}
            className={className}
            disabled={isLoading}
        />
    );
};

export default TimezoneSelector;
