import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '@/Components/Select';

const TimezoneSelector = ({id='', name='', className='', defaultTimezone=''}) => {
    const [timezones, setTimezones] = useState([]);
    const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone);

    useEffect(() => {
        axios.get(route('guest-timezone'))
            .then(response => {
                setTimezones(
                    Object.entries(response.data.data)
                        .map(([key, label]) => ({
                            value: key,
                            label: label
                        }))
                );
            })
            .catch(error => console.error('タイムゾーンの取得に失敗'));
    }, []);

    const handleTimezoneChange = (event) => {
        const oldTimezone = selectedTimezone;
        setSelectedTimezone(event.target.value);

        axios.put(route('guest-timezone-put'), {timezone: event.target.value})
            .then(response => {
                //
            })
            .catch(error => {
                console.error('タイムゾーンの設定に失敗');

                setSelectedTimezone(oldTimezone);
            });
    };

    return (
        <Select
            name={name}
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            options={timezones}
            className={className}
        />
    );
};

export default TimezoneSelector;
