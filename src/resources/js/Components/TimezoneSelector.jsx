import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import Select from '@/Components/Select';
import { useTranslation } from 'react-i18next';

const TimezoneSelector = ({id='', name='', className='', defaultTimezone=''}) => {
    const { t } = useTranslation();
    const [timezones, setTimezones] = useState([]);
    const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone);
    const [isLoading, setIsLoading] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        axios.get(route('timezone'))
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
    }, []);

    const handleTimezoneChange = (event) => {
        setIsLoading(true);

        const oldTimezone = selectedTimezone;
        setSelectedTimezone(event.target.value);

        axios.put(route('timezone-put'), {timezone: event.target.value})
            .then(response => {
                router.visit(url);
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
