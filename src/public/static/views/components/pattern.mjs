/**
 * 実装時仕様に合わせ諸々変更する事
 */
const tpl = {
    params: {
        //
    },
    pdf: null,
    current: 1,
    areas: {},
    areaThreshold: 15,
    /** @todo テンプレ登録、調査データ登録時の倍率考え実装すること */
    rate: 0.25,
    resetAreas: () => {
        tpl.areas = {};
    },
    onBeforePDFClick: () => {},
    onAFterPDFClick: () => {},
    onBeforeSetArea: () => {},
    onAfterSetArea: () => {},
    onDragstartSetArea: () => {},
    onDragstopSetArea: () => {},
    onResizecreateSetArea: () => {},
    onResizestartSetArea: () => {},
    onResizestopSetArea: () => {},
    onContextmenu: () => {},
    pageHandler: function(page) {
        const scale = 4,
            viewport = page.getViewport({
                scale: scale
            }),
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.className = `page-${tpl.current}`;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.addEventListener('click', tpl.clickHandler);
        canvas.addEventListener('contextmenu', tpl.onContextmenu);

        context.width = viewport.width;
        context.height = viewport.height;

        document.querySelector('#pdf-view')
            .appendChild(canvas);

        renderTask = page.render({
            canvasContext: context,
            viewport: viewport
        });

        renderTask.promise.then(function() {
            if (tpl.current < tpl.pdf.numPages) {
                tpl.pdf.getPage(++tpl.current).then(tpl.pageHandler, tpl.errorHander);
            }
        });
    },
    errorHander: function(reason) {
        console.error(reason);
    },
    clickHandler: function(ev) {
        ev.preventDefault();

        const elmTpl = document.querySelector('#pdf-tpl .pdf-draw'),
            layer = document.createElement('div'),
            canvas = this.cloneNode(true),
            context = canvas.getContext('2d'),
            rate = tpl.rate;

        let footerHeight = 0;

        if (typeof tpl.onBeforePDFClick === 'function') {
            tpl.onBeforePDFClick(ev);
        }

        canvas.width = canvas.width * rate;
        canvas.height = canvas.height * rate;
        context.scale(rate, rate);
        context.drawImage(this, 0, 0);

        elmTpl.innerHTML = null;
        elmTpl.appendChild(canvas);

        if (document.querySelector('.footer')) {
            footerHeight = document.querySelector('.footer').offsetHeight;
        }

        document.querySelector('#pdf-tpl').style.paddingBottom =
            `${footerHeight}px`;

        if (typeof tpl.onAFterPDFClick === 'function') {
            tpl.onAFterPDFClick(layer, canvas);
        }
    },
    areaSetupHandler: function(ev) {
        const self = this;

        if (typeof tpl.onBeforeSetArea === 'function') {
            tpl.onBeforeSetArea(ev, self);
        }

        if (! ev.target.classList.contains('pdf-draw-layer')) {
            return false;
        }

        let tx = ev.offsetX,
            ty = ev.offsetY,
            width = 0,
            height = 0;

        let target = document.createElement('div');
        target.className ='area-select';
        target.style.left = `${tx}px`;
        target.style.top = `${ty}px`;

        document.querySelector('.pdf-draw-layer')
            .appendChild(target);

        onMouseMove = (ev) => {
            width = ev.offsetX - tx;
            height = ev.offsetY - ty;

            if (width < 0) {
                width = tx - ev.offsetX;
                target.style.left = `${ev.offsetX}px`;
            }
            if (height < 0) {
                height = ty - ev.offsetY;
                target.style.top = `${ev.offsetY}px`;
            }

            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
        };

        onMouseUp = (ev) => {
            if (target.offsetWidth < tpl.areaThreshold
                || target.offsetHeight < tpl.areaThreshold
            ) {
                target.remove();
                target = null;
            } else {
                $(target).draggable({
                        containment: 'parent',
                        start: tpl.onDragstartSetArea,
                        stop: tpl.onDragstopSetArea
                    })
                    .resizable({
                        containment: 'parent',
                        handles: 'all',
                        stop: tpl.onResizestopSetArea
                    });
            }

            if (typeof tpl.onAfterSetArea === 'function') {
                tpl.onAfterSetArea(ev, self, target);
            }

            this.removeEventListener('mousemove', onMouseMove);
            this.removeEventListener('mouseup', onMouseUp);
            this.removeEventListener('mouseout', onMouseUp);
        };

        this.addEventListener('mousemove', onMouseMove);
        this.addEventListener('mouseup', onMouseUp);
        this.addEventListener('mouseout', onMouseUp);
    }
};

/**
 * これはサンプル
 * 仕様に合わせて実装する事
 * 文言はバックエンドから取得する
 */
(($) => {

    tpl.onContextmenu = function(ev) {
        const elm = ev.target;

        ev.preventDefault();

        if (elm.dataset.active) {
            delete elm.dataset.active;
        } else {
            elm.dataset.active = 'on';
        }

        if (ev.type === 'contextmenu') {
            return false;
        }
    };
    tpl.onAFterPDFClick = function(layer, canvas) {
        layer.className = 'pdf-draw-layer';

        if (! document.querySelector(`#pdf-draw-wrap .${layer.className}`)) {

            layer.style.width = `${canvas.width}px`;
            layer.style.height = `${canvas.height}px`;
            $(layer).draggable({
                    start: tpl.onDragstartSetArea,
                    stop: tpl.onDragstopSetArea
                })
                .resizable({
                    aspectRatio: true,
                    create: tpl.onResizestartSetArea,
                    start: tpl.onResizestartSetArea,
                    stop: tpl.onResizestopSetArea
                });

            document.querySelector('#pdf-draw-wrap')
                .appendChild(layer);

            document.querySelector('.pdf-draw')
                .style.width = `${canvas.width}px`;

        }
    };
    tpl.onDragstopSetArea = function(ev, ui) {
        tpl.params.setArea = {
            top: this.offsetTop,
            left: this.offsetLeft,
            width: this.offsetWidth,
            height: this.offsetHeight
        };
    };
    tpl.onResizecreateSetArea = tpl.onDragstopSetArea;
    tpl.onResizestartSetArea = tpl.onResizecreateSetArea;
    tpl.onResizestopSetArea = function(ev, ui) {
        const canvas = document.querySelector('.pdf-draw canvas'),
            width = tpl.params.setArea.width;

        tpl.params.setArea.width = this.offsetWidth;
        tpl.params.setArea.height = this.offsetHeight;

        const rate = tpl.params.setArea.width / width;

        document.querySelectorAll('.area-select')
            .forEach(elm => {
                elm.style.top = `${elm.offsetTop * rate}px`;
                elm.style.left = `${elm.offsetLeft * rate}px`;
                elm.style.width = `${elm.offsetWidth * rate}px`;
                elm.style.height = `${elm.offsetHeight * rate}px`;
            });
    };

    window.onload = () => {

        /** Events */
        document.querySelector('#pdf-load input[type="file"]')
            .onchange = function(ev) {

            const file = ev.target.files[0],
                fileReader = new FileReader();

            fileReader.onload = function() {
                let typedarray = new Uint8Array(this.result);

                const loadingTask = pdfjsLib.getDocument({
                    data: typedarray,
                    cMapUrl: tpl.params.cMapUrl,
                    cMapPacked: tpl.params.cMapPacked
                });

                loadingTask.promise.then(pdf => {
                    tpl.pdf = pdf;
                    tpl.current = 1;

                    document.querySelector('#pdf-view')
                        .innerHTML = null;

                    pdf.getPage(tpl.current).then(tpl.pageHandler, tpl.errorHander);
                });

            };

            if (typeof file === 'object') {
                fileReader.readAsArrayBuffer(file);
            }
        };

        /** jq test code */
        $.fn.api.settings.successTest = function(response) {
            return response.status
                .toLowerCase() === 'ok';
        };

        $('.pdf-area-select select').api({
            on: 'change',
            action: 'pattern-template',
            method: 'post',
            data: {
                // semantic-ui selectのvalue値セットされるタイミング
            },
            stateContext: '.ui.fluid.dropdown.selection',
            beforeSend: function(settings) {
                if (document.querySelector('.pdf-draw-layer')) {
                    document.querySelector('.pdf-draw-layer')
                        .remove();
                }

                settings.data.pattern =  $('.pdf-area-select select')
                    .dropdown('get value');

                if (! settings.data.pattern) {
                    return false;
                }

                return settings;
            },
            onSuccess: res => {

                document.querySelector(`#pdf-view .${
                        document.querySelector('.pdf-draw canvas')
                            .className
                    }`).click();

                $.each(res.data, (k, v) => {
                    let rate = 1 / v.scale,
                        top = v.points[0].y / rate,
                        left = v.points[0].x / rate,
                        width = v.points[1].x / rate - left,
                        height = v.points[1].y / rate - top;

                    document.querySelector('.pdf-draw-layer')
                        .appendChild(
                            $('<a>', {
                                class: 'area-select ocr-check-result',
                                style: `top:${
                                    top}px;left:${
                                    left}px;width:${
                                    width}px;height:${
                                    height}px;position:absolute;`,
                                text: k
                            }).get(0)
                        );
                });
            },
            onFailure: res => {
                window.alert('エラーあり');
            }
        });

        document.querySelector('.btn-register:not([disabled])')
            .addEventListener('click', function(ev) {
                const self = this;

                ev.preventDefault();

                if (! document.querySelector('#pdf-view [data-active="on"]')) {
                    window.alert('②の対応をしてください');

                    return false;
                }

                self.disabled = true;

                setTimeout(() => {$.api({
                    on: 'now',
                    action: 'pattern-register',
                    method: 'post',
                    stateContext: '.btn-register',
                    beforeSend: function(settings) {
                        let rate = tpl.params.setArea.width / (
                            document.querySelector('#pdf-view [data-active="on"]')
                                .width * tpl.rate
                        );

                        settings.data = {
                            ...{
                                rate: rate ? rate : 1,
                                imageRate: tpl.rate,
                                select: Array.prototype.map
                                    .call(
                                        document.querySelectorAll('#pdf-view [data-active="on"]'),
                                        elm => {
                                            return elm.className;
                                        }
                                    ),
                                pattern: $('.pdf-area-select select')
                                    .dropdown('get value'),
                                files: Array.prototype.map
                                    .call(
                                        document.querySelectorAll('#pdf-view [data-active="on"]'),
                                        elm => {
                                            const o = {
                                                //
                                            };

                                            o[elm.className] = elm.toDataURL('image/png')
                                                .replace(/data:image\/[^;]+;base64,/, '');

                                            return o;
                                        }
                                    ),
                                filename: document.querySelector('#pdf-load [type="file"]').files
                                    .item(0).name
                            },
                            ...[tpl.params.setArea].map(v => {
                                    const rate = 1 / tpl.rate;

                                    return {
                                        top: v.top * rate,
                                        left: v.left * rate,
                                        width: v.width * rate,
                                        height: v.height * rate
                                    };
                                })
                                .shift()
                        };

                        return settings;
                    },
                    onSuccess: res => {
                        tpl.params.res = res;

                        document.querySelector('.form-pattern-check')
                            .innerHTML = null;

                        $.each(tpl.params.res.data, function(k, v) {
                            $('.form-pattern-check').append(
                                $('#skel').clone(true).children().each(function() {
                                    const self = this;

                                    $(self).find('[name="surveys[point_number]"]')
                                        .val(v['surveys[point_number]'].text);
                                    $(self).find('[name="surveys[kbm]"]')
                                        .val(v['surveys[kbm]'].text);
                                    $(self).find('[name="surveys[survey_date]"]')
                                        .val(v['surveys[survey_date]'].text);
                                    $(self).find('[name="surveys[final_depth]"]')
                                        .val(v['surveys[final_depth]'].text);
                                    $(self).find('[name="surveys[address]"]')
                                        .val(v['surveys[address]'].text);

                                    if (v.data) {
                                        for (let i = 0; i < v.data['survey_numbers[d]'].length; i++) {
                                            $(self).find('table tbody').append(
                                                $(self).find('table tbody tr:last-child').clone(true).each(function() {
                                                    $(this).find('[name^="survey_numbers[d]"]').val(
                                                        v.data['survey_numbers[d]'][i].text
                                                    );
                                                    $(this).find('[name^="survey_numbers[n]"]').val(
                                                        v.data['survey_numbers[n]'][i].text
                                                    );
                                                    $(this).find('[name^="survey_numbers[soil]"]').val(
                                                        v.data['survey_numbers[soil]'][i].text
                                                    );
                                                })
                                            );
                                        }

                                        $(self).find('table tbody tr:first-child').remove();
                                    }
                                })
                            );
                        });

                    },
                    onFailure: res => {
                        window.alert('エラーあり');
                    },
                    onComplete: res => {
                        self.disabled = false;
                    }
                })}, 53);

            }
        );

    };

})(jQuery);
