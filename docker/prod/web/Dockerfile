ARG APP_BUILD_IMAGE

FROM ${APP_BUILD_IMAGE}

ARG APP_BUILD_ENV
ARG APP_NODE_VERSION
ARG APP_GROUP
ARG APP_GROUP_ID
ARG APP_USER
ENV APP_USER=${APP_USER}
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

RUN apt update && \
        apt upgrade -y && \
        apt install -y bc \
                libfreetype6-dev \
                zip \
                libzip-dev \
                libjpeg-dev \
                libmcrypt-dev \
                imagemagick \
                libmagickwand-dev \
                supervisor \
                poppler-utils \
                python3-venv \
                python3-pip \
                ffmpeg \
                libsm6 \
                libxext6 \
                gettext-base \
                pdftk \
                cron \
                jq \
                gnupg \
                apt-transport-https \
                lsb-release && \
        apt install -y fonts-arphic-ukai \
                fonts-arphic-uming \
                fonts-ipafont-mincho \
                fonts-ipafont-gothic \
                fonts-unfonts-core \
                fonts-liberation \
                fonts-dejavu \
                fonts-texgyre \
                fonts-noto-cjk-extra \
                fonts-takao \
                swig

RUN mkdir -p /usr/src/php/ext
WORKDIR /usr/src/php/ext

RUN pecl bundle igbinary && \
        pecl install igbinary && \
        pecl bundle redis && \
        pecl bundle mcrypt && \
        pecl bundle imagick && \
        docker-php-ext-configure redis \
                --enable-redis-igbinary \
                --enable-redis-lzf && \
        docker-php-ext-install pdo_mysql && \
        docker-php-ext-install zip && \
        docker-php-ext-install gd && \
        docker-php-ext-install redis && \
        docker-php-ext-install mcrypt && \
        docker-php-ext-install imagick && \
        docker-php-ext-install opcache

RUN a2enmod rewrite && \
        find /etc -type f -path "*/ImageMagick-*" -name "policy.xml" -exec sed -i.orig 's/policy domain="coder" rights="none" pattern="PDF"/policy domain="coder" rights="read|write" pattern="PDF"/g' {} + && \
        find /etc -type f -path "*/ImageMagick-*" -name "policy.xml" -exec sed -i.orig 's/<policy domain="resource" name="memory" value="256MiB"\/>/<policy domain="resource" name="memory" value="1GiB"\/>/g' {} + && \
        find /etc -type f -path "*/ImageMagick-*" -name "policy.xml" -exec sed -i.orig 's/<policy domain="resource" name="map" value="512MiB"\/>/<policy domain="resource" name="map" value="2GiB"\/>/g' {} +

WORKDIR /tmp
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
        curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && \
        bash n ${APP_NODE_VERSION} && \
        npm install npm@latest -g && \
        rm -rf /tmp/*

RUN groupadd -g ${APP_GROUP_ID} ${APP_GROUP} && \
        useradd -s /bin/false -u ${APP_USER_ID} -g ${APP_GROUP_ID} -M ${APP_USER}

ENV APACHE_RUN_USER ${APP_USER}
ENV APACHE_RUN_GROUP ${APP_GROUP}

WORKDIR /etc/cron.d
RUN echo "* * * * * cd ${APP_SERVER_PATH} && /usr/local/bin/php -d memory_limit=-1 artisan schedule:run" > laravel && \
        chmod 0644 ./laravel && \
        crontab -u ${APP_USER} laravel

RUN rm -rf /opt/data/.venv
WORKDIR /opt/data
RUN sed -i '/Components:/ s/$/ contrib/' /etc/apt/sources.list.d/debian.sources
ENV USE_NNPACK 0
RUN python3 -m venv /opt/data/.venv
RUN /opt/data/.venv/bin/python -m pip install --upgrade pip
ENV PATH /opt/data/.venv/bin:$PATH
ENV LD_LIBRARY_PATH /opt/data/.venv/lib:$LD_LIBRARY_PATH
RUN pip install fire
RUN pip install opencv-python \
        opencv-contrib-python \
        easyocr \
        PyMuPDF \
        paddlepaddle \
        paddleocr

RUN echo "deb https://notesalexp.org/tesseract-ocr5/$(lsb_release -cs)/ $(lsb_release -cs) main" \
                | tee /etc/apt/sources.list.d/notesalexp.list > /dev/null
RUN curl -s https://notesalexp.org/debian/alexp_key.asc | apt-key add - && \
        apt update && \
        apt install -y tesseract-ocr \
                libtesseract-dev && \
        apt clean && \
        rm -rf /var/lib/apt/lists/*
RUN mkdir /opt/data/cache
ENV HF_HOME /opt/data/cache
RUN usermod -d /opt/data ${APP_USER}
RUN mkdir /opt/data/.EasyOCR
RUN chown ${APP_USER} /opt/data /opt/data/cache /opt/data/.EasyOCR

WORKDIR /tmp
COPY etc/apache/httpd-vhosts.conf /tmp/000-default.conf.template
RUN envsubst < /tmp/000-default.conf.template > /etc/apache2/sites-enabled/000-default.conf
COPY etc/php/app.ini /tmp/app.ini.template
RUN envsubst < /tmp/app.ini.template > /usr/local/etc/php/conf.d/app.ini
COPY etc/php/xdebug.ini /tmp/docker-php-ext-xdebug.ini.template
RUN envsubst < /tmp/docker-php-ext-xdebug.ini.template > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
COPY etc/php/igbinary.ini /tmp/igbinary.ini.template
RUN envsubst < /tmp/igbinary.ini.template > /usr/local/etc/php/conf.d/igbinary.ini
COPY etc/supervisor/conf.d/worker.conf /tmp/worker.conf.template
RUN envsubst < /tmp/worker.conf.template > /etc/supervisor/conf.d/worker.conf
RUN rm -rf /tmp/*

WORKDIR ${APP_SERVER_PATH}

CMD ["/usr/bin/supervisord", "-n"]
