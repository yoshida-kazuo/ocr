FROM php:8.3-apache

ENV APP_GROUP ubuntu
ENV APP_GROUP_ID 1000
ENV APP_USER ubuntu
ENV APP_USER_ID 1000

RUN apt update
RUN apt upgrade -y
RUN apt install -y libfreetype6-dev \
        zip \
        libzip-dev \
        libjpeg-dev \
        libmcrypt-dev \
        imagemagick \
        libmagickwand-dev \
        supervisor \
        poppler-utils \
        fonts-takao \
        python3-pip \
        ffmpeg \
        libsm6 \
        libxext6

RUN mkdir -p /usr/src/php/ext
WORKDIR /usr/src/php/ext

RUN pecl bundle xdebug
RUN pecl bundle igbinary
RUN pecl install igbinary
RUN pecl bundle redis
RUN pecl bundle mcrypt
RUN pecl bundle imagick
RUN docker-php-ext-configure redis \
        --enable-redis-igbinary \
        --enable-redis-lzf
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd
RUN docker-php-ext-install redis
RUN docker-php-ext-install xdebug
RUN docker-php-ext-install mcrypt
RUN docker-php-ext-install imagick
RUN docker-php-ext-install igbinary
RUN docker-php-ext-install opcache

RUN a2enmod rewrite
RUN find /etc -type f -path "*\/ImageMagick-*" -name "policy.xml" | xargs sed -i.orig -e 's/policy domain="coder" rights="none" pattern="PDF"/policy domain="coder" rights="read" pattern="PDF"/g'

COPY etc/apache/httpd-vhosts.conf /etc/apache2/sites-enabled/000-default.conf
COPY etc/php/app.ini /usr/local/etc/php/conf.d/app.ini
COPY etc/php/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
COPY etc/php/igbinary.ini /usr/local/etc/php/conf.d/igbinary.ini

WORKDIR /tmp
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && \
        bash n 18.17.1
RUN rm -rf /tmp/*

RUN chgrp www-data /var/www
RUN groupadd -g ${APP_GROUP_ID} ${APP_GROUP} \
    && useradd -s /bin/false -u ${APP_USER_ID} -g ${APP_GROUP_ID} -M ${APP_USER}

ENV APACHE_RUN_USER ubuntu
ENV APACHE_RUN_GROUP ubuntu

WORKDIR /var/www
