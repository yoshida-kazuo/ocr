
class Bee {

    get op() {
        return this._op;
    }

    set op(op) {
        this._op = op;
    }

    get paperLayout() {
        return this._paperLayout;
    }

    set paperLayout(paperLayout) {
        this._paperLayout = paperLayout;
    }

    get lineMinWidth() {
        return this._lineMinWidth;
    }

    set lineMinWidth(lineMinWidth) {
        this._lineMinWidth = lineMinWidth;
    }

    constructor(op = {}) {
        this.op = {
            start: function(canvasTo, canvasFrom) {},
            end: function(resuts, canvasTo, canvasFrom) {},
            ...op
        };
        this.paperLayout = {
            a4_p: [
                210,
                297
            ],
            a4_l: [
                297,
                210
            ]
        };
        this.lineMinWidth = 30;
    }

    cells(
        canvas,
        canvasTo = null,
        dpi = 300
    ) {
        if (! canvasTo instanceof HTMLCanvasElement) {
            canvasTo = canvas;
        }

        this.op.start(canvas, canvasTo);

        this.image = cv.imread(canvas);

        const size = this.image.size();

        let ratio = 1,
            layout = 'portrait';
        if (size.width > size.height) {
            layout = 'landscape';
        }

        const [pw,] = this.a4shape(layout, dpi);
        ratio = pw / size.width;
        if (ratio !== 1) {
            const dsize = new cv.Size(
                Math.round(size.width * ratio),
                Math.round(size.height * ratio)
            );
            cv.resize(this.image, this.image, dsize);
        }

        this.image = this.auto_rotate(this.image);
        this.image = this.trapezoid_correction(this.image);

        const img = new cv.Mat(),
            imgBinary = new cv.Mat();
        cv.cvtColor(
            this.image,
            img,
            cv.COLOR_BGR2GRAY
        );
        cv.threshold(
            img,
            imgBinary,
            215,
            255,
            cv.THRESH_BINARY
        );
        const imgInverse = new cv.Mat();
        cv.bitwise_not(imgBinary, imgInverse);
        img.delete();
        imgBinary.delete();

        const tmpImgH = new cv.Mat(
            1,
            this.lineMinWidth,
            cv.CV_8UC1,
            new cv.Scalar(1)
        );
        const tmpImgV = new cv.Mat(
                this.lineMinWidth,
                1,
                cv.CV_8UC1,
                new cv.Scalar(1)
            ),
            imgH = new cv.Mat(),
            imgV = new cv.Mat();
        cv.morphologyEx(
            imgInverse,
            imgH,
            cv.MORPH_OPEN,
            tmpImgH
        );
        cv.morphologyEx(
            imgInverse,
            imgV,
            cv.MORPH_OPEN,
            tmpImgV
        );
        tmpImgH.delete();
        tmpImgV.delete();
        imgInverse.delete();

        const imgMorph = new cv.Mat();
        cv.bitwise_or(
            imgH,
            imgV,
            imgMorph
        );

        const stats = new cv.Mat(),
            centroids = new cv.Mat(),
            labels = new cv.Mat(),
            connectivity = 8,
            ltype = cv.CV_32S,
            dstImgMorph = new cv.Mat();
        cv.bitwise_not(imgMorph, dstImgMorph);
        cv.connectedComponentsWithStats(
            dstImgMorph,
            labels,
            stats,
            centroids,
            connectivity,
            ltype
        );
        imgH.delete();
        imgV.delete();
        labels.delete();
        centroids.delete();
        imgMorph.delete();
        dstImgMorph.delete();

        cv.imshow(canvasTo, this.image);

        const areaThresh = 3333 * (dpi/300),
            statsList = [];
        for (let i = 2; i < stats.rows; i++) {
            const area = stats.intPtr(i, 4)[0];

            if (area >= areaThresh) {
                const x = stats.intPtr(i, 0)[0],
                    y = stats.intPtr(i, 1)[0],
                    w = stats.intPtr(i, 2)[0],
                    h = stats.intPtr(i, 3)[0];

                statsList.push([
                    x,
                    y,
                    w,
                    h,
                    area
                ]);
            }
        }

        stats.delete();
        this.image.delete();

        this.op.end(
            statsList,
            canvas,
            canvasTo
        );
    }

    sorted_contours(image) {
        const imageGray = new cv.Mat(),
            imageThresh = new cv.Mat();

        cv.cvtColor(
            image,
            imageGray,
            cv.COLOR_BGR2GRAY
        );
        cv.threshold(
            imageGray,
            imageThresh,
            50,
            255,
            cv.THRESH_BINARY | cv.THRESH_OTSU
        );

        const contours = new cv.MatVector(),
            hierarchy = new cv.Mat();
        cv.findContours(
            imageThresh,
            contours,
            hierarchy,
            cv.RETR_TREE,
            cv.CHAIN_APPROX_NONE
        );
        imageGray.delete();
        imageThresh.delete();
        hierarchy.delete();

        const sortedIndices = [];
        for (let i = 0; i < contours.size(); i++) {
            sortedIndices.push(i);
        }

        sortedIndices.sort(
            (a, b) => cv.contourArea(
                contours.get(b)
            ) - cv.contourArea(
                contours.get(a)
            )
        );

        return [
            contours,
            sortedIndices
        ];
    }

    a4shape(layout = 'portrait', dpi = null) {
        if (dpi === null) {
            dpi = this.dpi;
        }
        const paperLayout = this.paperLayout[`a4_${layout[0]}`];

        return paperLayout.map(
            (mm) => this.mm2pixcel(mm, dpi)
        );
    }

    mm2pixcel(mm, dpi = null) {
        if (dpi === null) {
            dpi = this.dpi;
        }

        return Math.round(
            (dpi * mm) / 25.4
        );
    }

    auto_rotate(image) {
        const [
            contours,
            sortedIndices
        ] = this.sorted_contours(image);

        for (let i = 0; i < sortedIndices.length; i++) {
            const idx = sortedIndices[i],
                contour = contours.get(idx),
                rect = cv.minAreaRect(contour),
                w = rect.size.width,
                h = rect.size.height;

            let a = rect.angle;

            if (w < 1000
                || Math.abs(a) === 90
                || a === 0
                || (!(a < -78 && a > -102) && !(a < 12 && a > -12) && !(a < 102 && a > 78) && !(a < 192 && a > 168))
            ) {
                continue;
            }

            a -= Math.round(a / 90) * 90;
            const size = image.size(),
                rw = size.width,
                rh = size.height,
                center = new cv.Point(rh / 2, rw / 2),
                M = cv.getRotationMatrix2D(
                    center,
                    a,
                    1
                );
            cv.warpAffine(
                image,
                image,
                M,
                image.size(),
                cv.INTER_LINEAR,
                cv.BORDER_CONSTANT,
                new cv.Scalar(255, 255, 255)
            );
            M.delete();

            const k = new cv.Mat(
                3,
                3,
                cv.CV_32FC1,
                new cv.Scalar(0)
            );
            k.floatPtr(0, 1)[0] = -1;
            k.floatPtr(1, 0)[0] = -1;
            k.floatPtr(1, 2)[0] = -1;
            k.floatPtr(2, 1)[0] = -1;
            k.floatPtr(1, 1)[0] = 5;
            cv.filter2D(
                image,
                image,
                -1,
                k
            );
            k.delete();

            break;
        }

        return image;
    }

    trapezoid_correction(image) {
        const [
            contours,
            sortedIndices
        ] = this.sorted_contours(image);

        for (let i = 0; i < sortedIndices.length; i++) {
            const idx = sortedIndices[i],
                contour = contours.get(idx),
                rect = cv.minAreaRect(contour),
                w = rect.size.width,
                h = rect.size.height,
                a = rect.angle;

            if (w < 1000 || a === 90) {
                continue;
            }

            const size = image.size(),
                rw = size.width,
                rh = size.height,
                c = new cv.Mat();
            cv.approxPolyDP(
                contour,
                c,
                0.1 * cv.arcLength(contour, true),
                true
            );

            const cArray = [];
            for (let i = 0; i < c.rows; i++) {
                cArray.push([
                    c.intPtr(i, 0).x,
                    c.intPtr(i, 0).y
                ]);
            }
            const sortedC = cArray.sort(
                (a, b) => a[0] + a[1] - b[0] - b[1]
            );
            c.delete();

            if (sortedC.length < 8) {
                break;
            }

            const d = [
                sortedC[0],
                [sortedC[1][0], sortedC[0][1]],
                [sortedC[0][0], sortedC[2][1]],
                [sortedC[1][0], sortedC[2][1]]
            ];

            const M = cv.getPerspectiveTransform(
                new cv.Mat(
                    d.map(
                        (p) => new cv.Point2f(p[0], p[1])
                    )
                ),
                new cv.Mat(
                    [rw, rh],
                    cv.CV_32FC2
                )
            );
            cv.warpPerspective(
                image,
                image,
                M,
                image.size(),
                cv.INTER_LINEAR,
                cv.BORDER_CONSTANT,
                new cv.Scalar(255, 255, 255)
            );

            M.delete();
        }

        return image;
    }
};

export default Bee;
