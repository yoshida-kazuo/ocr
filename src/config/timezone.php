<?php

$fn = function(): array {
    $allTimezones = DateTimeZone::listIdentifiers();
    $timezones = [];

    foreach ($allTimezones as $timezone) {
        $dateTimeZone = new DateTimeZone($timezone);
        $dateTime = new DateTime("now", $dateTimeZone);
        $timeOffset = $dateTimeZone->getOffset($dateTime);

        $offsetPrefix = $timeOffset < 0 ? '-' : '+';
        $offsetFormatted = gmdate('G:i', abs($timeOffset));

        $timezones[] = [
            'key'       => $timezone,
            'label'     => $timezone . ' ' . $offsetPrefix . $offsetFormatted,
            'offset'    => $timeOffset
        ];
    }

    usort($timezones, function($a, $b) {
        return $a['offset'] - $b['offset'];
    });

    $sortedTimezones = [];
    foreach ($timezones as $timezone) {
        $sortedTimezones[$timezone['key']] = $timezone['label'];
    }

    return $sortedTimezones;
};

return $fn();
