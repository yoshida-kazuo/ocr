ARG APP_BUILD_IMAGE

FROM ${APP_BUILD_IMAGE}

ARG APP_BUILD_ENV
ARG APP_NODE_VERSION
ARG APP_GROUP
ARG APP_GROUP_ID
ARG APP_USER
ARG APP_USER_ID
ARG APP_SERVER_PATH
ENV APP_SERVER_PATH=${APP_SERVER_PATH}
ARG APP_SERVER_DOCUMENT_PATH
ENV APP_SERVER_DOCUMENT_PATH=${APP_SERVER_DOCUMENT_PATH}
ARG APP_PHP_MEMORY
ENV APP_PHP_MEMORY=${APP_PHP_MEMORY}
ARG APP_XDEBUG_CLIENT_HOST
ENV APP_XDEBUG_CLIENT_HOST=${APP_XDEBUG_CLIENT_HOST}
ARG APP_XDEBUG_CLIENT_PORT
ENV APP_XDEBUG_CLIENT_PORT=${APP_XDEBUG_CLIENT_PORT}

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
        libxext6 \
        gettext-base

RUN mkdir -p /usr/src/php/ext
WORKDIR /usr/src/php/ext

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
RUN docker-php-ext-install mcrypt
RUN docker-php-ext-install imagick
RUN docker-php-ext-install igbinary
RUN docker-php-ext-install opcache

RUN a2enmod rewrite
RUN find /etc -type f -path "*\/ImageMagick-*" -name "policy.xml" | xargs sed -i.orig -e 's/policy domain="coder" rights="none" pattern="PDF"/policy domain="coder" rights="read" pattern="PDF"/g'

WORKDIR /tmp
COPY etc/apache/httpd-vhosts.conf /tmp/000-default.conf.template
RUN envsubst < /tmp/000-default.conf.template > /etc/apache2/sites-enabled/000-default.conf
COPY etc/php/app.ini /tmp/app.ini.template
RUN envsubst < /tmp/app.ini.template > /usr/local/etc/php/conf.d/app.ini
COPY etc/php/igbinary.ini /tmp/igbinary.ini.template
RUN envsubst < /tmp/igbinary.ini.template > /usr/local/etc/php/conf.d/igbinary.ini
COPY etc/supervisor/conf.d/worker.conf /tmp/worker.conf.template
RUN envsubst < /tmp/worker.conf.template > /etc/supervisor/conf.d/worker.conf

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && \
        bash n ${APP_NODE_VERSION}
RUN npm install npm@latest -g
RUN rm -rf /tmp/*
RUN rm -rf /var/lib/apt/lists/*

WORKDIR ${APP_SERVER_PATH}

RUN groupadd -g ${APP_GROUP_ID} ${APP_GROUP}
RUN useradd -s /bin/false -u ${APP_USER_ID} -g ${APP_GROUP_ID} -M ${APP_USER}

ENV APACHE_RUN_USER ${APP_USER}
ENV APACHE_RUN_GROUP ${APP_GROUP}

CMD ["/usr/bin/supervisord", "-n"]
