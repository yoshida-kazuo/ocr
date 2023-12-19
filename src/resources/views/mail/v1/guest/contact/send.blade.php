<x-mail::message>
# @lang('Your inquiry has been received')

@lang('We apologize for the inconvenience, but please be advised that it may take a few days before we can get back to you.')

@lang('If you do not receive a response, we kindly ask that you contact us again, although we regret the inconvenience this may cause.')

## @lang('Inquiry Information')

@lang('Name') : {{ $name }}

@lang('Email') : {{ $email }}

<br>
@lang('Contact')

{{ $message }}

</x-mail::message>
