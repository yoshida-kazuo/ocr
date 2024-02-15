import os
import pathlib import Path
import cv2 as cv
import numpy as np
import json
import subprocess

class Ocr:

    _file_path = None
    _output_dir = None
    _image = None
    _line_width = None
    _line_min_width = None

    @property
    def file_path(self) -> str:
        return self._file_path

    @file_path.setter
    def file_path(self, value: str):
        if not isinstance(value, str):
            raise ValueError(f"file_path must be a string {value}")

        if not os.path.exists(value):
            raise FileNotFoundError(f"file_path not found {value}")

        self._file_path = value

    @property
    def output_dir(self) -> str:
        return self._output_dir

    @output_dir.setter
    def output_dir(self, value: str):
        if not isinstance(value, str):
            raise ValueError('output_dir must be a string')

        if not os.path.exists(value):
            raise NotADirectoryError("output_dir not found {value}")

        self._output_dir = value

    @property
    def image(self) -> object:
        return self._image

    @image.setter
    def image(self, value: object):
        if not isinstance(value, np.ndarray):
            raise ValueError('image must be a np.ndarray')

        self._image = value

    @property
    def line_min_width(self) -> int:
        return self._line_min_width

    @line_min_width.setter
    def line_min_width(self, value: int):
        if not isinstance(value, int):
            raise ValueError('line_min_width must be a integer')

        self._line_min_width = value

    @property
    def line_width(self) -> int:
        return self._line_width

    @line_width.setter
    def line_width(self, value: int):
        if not isinstance(value, int):
            raise ValueError('line_width must be a integer')

        self._line_width = value

    @property
    def dpi(self) -> int:
        return self._dpi

    @dpi.setter
    def dpi(self, value: int):
        if not isinstance(value, int):
            raise ValueError('dpi must be a int')

        self._dpi = value

    @property
    def paper_layout(self) -> dict:
        return self._paper_layout

    @paper_layout.setter
    def paper_layout(self, value):
        if not isinstance(value, dict):
            raise ValueError('paper_layout must be a dict')

        self._paper_layout = value

    @property
    def layout(self) -> str:
        return self._layout

    @layout.setter
    def layout(self, value: str):
        if not isinstance(value, str):
            raise ValueError('layout must be a str')

        self._layout = value

    @property
    def output_file(self) -> str:
        return self._output_file

    @output_file.setter
    def output_file(self, value):
        if not isinstance(value, str):
            raise ValueError('output_file must be a str')

        self._output_file = value

    @property
    def output_json_file(self) -> str:
        return self._output_json_file

    @output_json_file.setter
    def output_json_file(self, value):
        if not isinstance(value, str):
            raise ValueError('output_json_file must be a str')

        self._output_json_file = value

    def __init__(self) -> None:
        self.paper_layout = {
            'a4_p': [
                210,
                297
            ],
            'a4_l': [
                297,
                210
            ]
        }
        self.dpi = 300
        self.line_min_width = 30

    def write(self,
              file_path: str,
              image: object=None) -> None:
        if image is None:
            image = self.image

        cv.imwrite(file_path, image)

    def cells(self,
              file_path: str=None,
              output_dir: str=None,
              output_file: str='output.jpg',
              output_json_file: str='output.json',
              dpi: int=None) -> None:
        """
        罫線から座標を取得する\n
        * サイズ補正（dpiに基づく）
        * 傾き補正
        * 歪み補正
        * 罫線取得
        * OCR解析\n
        For example, docker-compose exec --user=1000 web python3 /var/www/storage/app/bin/opencv/main.py image cells --file_path=/var/www/storage/app/bin/opencv/ocr-11--.jpg --dpi=288 --output_file=001.jpg --output_json_file=001.json --output_dir=/var/www/storage/app/bin/opencv
        """

        if isinstance(file_path, str):
            self.file_path = file_path
        if isinstance(output_dir, str):
            self.output_dir = output_dir
        elif not isinstance(self.output_dir, str):
            self.output_dir = os.path.dirname(self.file_path)

        if isinstance(output_file, str):
            self.output_file = output_file
        if isinstance(output_json_file, str):
            self.output_json_file = output_json_file
        if not isinstance(dpi, int):
            dpi = self.dpi

        output_file_path = f"{self.output_dir}/{self.output_file}"
        output_json_file_path = f"{self.output_dir}/{self.output_json_file}"

        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir, exist_ok=True)
        if not os.path.exists(output_json_file):
            Path(output_json_file_path).touch()

        self.image = cv.imread(self.file_path)
        h, w = self.image.shape[:2]
        ratio = 1
        self.layout = 'portrait'
        if w > h:
            self.layout = 'landscape'

        p_w, _ = self.a4shape(layout=self.layout, dpi=dpi)
        ratio = p_w / w
        if ratio != 1:
            self.image = cv.resize(self.image, (int(w * ratio), int(h * ratio)))
        del p_w, ratio

        self.image = self.auto_rotate(self.image)
        self.image = self.trapezoid_correction(self.image)
        self.write(output_file_path, self.image)

        tessdata = []
        # tessdata: list= self.ocr(file_path=output_file_path,
        #                     lang='jpn_seishin+jpn',
        #                     dpi=288)

        img = cv.cvtColor(self.image, cv.COLOR_BGR2GRAY)
        _, img_bin = cv.threshold(img, 215, 255, cv.THRESH_BINARY)
        img =~ img_bin
        del img_bin

        tmp_img_h = np.ones((1, self.line_min_width), np.uint8)
        tmp_img_v = np.ones((self.line_min_width, 1), np.uint8)
        img_h = cv.morphologyEx(img, cv.MORPH_OPEN, tmp_img_h)
        img_v = cv.morphologyEx(img, cv.MORPH_OPEN, tmp_img_v)
        img = img_h | img_v
        del tmp_img_h, tmp_img_v, img_h, img_v

        if isinstance(self.line_width, int):
            params = np.ones((self.line_width, self.line_width), np.uint8)
            img = cv.dilate(img, params, iterations=1)

        _, _, stats, _ = cv.connectedComponentsWithStats(~img,
                                                         connectivity=8,
                                                         ltype=cv.CV_32S)
        area_thresh = 3333
        lines = []
        for idx, (x, y, w, h, area) in enumerate(stats[2:], start=2):
            if (area < area_thresh):
                continue
            x = int(x)
            y = int(y)
            w = int(w)
            h = int(h)

            lines.append([
                x, y,
                x+w, y,
                x+w, y+h,
                x, y+h
            ])

            crop_file_path = f'{output_dir}/langs/{idx}.png'
            txt_file_path = f'{output_dir}/langs/{idx}.gt.txt'
            crop_image = self.image[y:y+h, x:x+w]
            self.write(crop_file_path, crop_image)
            del crop_image

            ocr = self.ocr(crop_file_path, 'jpn_seishin', 288)
            ocr_text = ''.join([r['t'] for r in ocr])
            with open(txt_file_path, 'w') as file:
                file.write(ocr_text)

        del stats, img

        with open(output_json_file_path, 'w') as json_file:
            json_file.write(json.dumps({
                'lines': lines,
                'words': tessdata
                }))

    def _sorted_contours(self,
                         image: object) -> list:
        image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        _, b = cv.threshold(image_gray, 50, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)
        contours, _ = cv.findContours(b, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)

        return [
            contours,
            sorted(range(len(contours)),
                   key=lambda i: cv.contourArea(contours[i]),
                   reverse=True)
        ]

    def a4shape(self,
                layout: str='portrait',
                dpi: int=None) -> list:
        if not isinstance(dpi, int):
            dpi = self.dpi

        paper_layout = self.paper_layout[f"a4_{layout[0]}"]

        return [self.mm2pixcel(mm, dpi) for mm in paper_layout]

    def mm2pixcel(self,
                  mm: int,
                  dpi: int=None) -> int:
        if not isinstance(dpi, int):
            dpi = self.dpi

        return int(dpi * mm / 25.4)

    def auto_rotate(self,
                    image: object) -> object:
        contours, sorted_indices = self._sorted_contours(image)

        for _, idx in enumerate(sorted_indices):
            contour = contours[idx]
            rect = cv.minAreaRect(contour)
            box = cv.boxPoints(rect)
            w = rect[1][0]
            h = rect[1][1]
            a = rect[2]

            if w < 1000 or a == 90 or a == 0 or a < 0.09:
                continue

            if w > h:
                a -= 90

            r_h, r_w = image.shape[:2]
            m = cv.getRotationMatrix2D((r_h / 2, r_w / 2), a, 1)
            image = cv.warpAffine(image, m, (r_w, r_h), borderValue=(255,255,255))
            # k = np.array([[0, -1, 0],
            #               [-1, 5, -1],
            #               [0, -1, 0]], dtype=np.float32)
            # image = cv.filter2D(image, -1, k)
            break

        return image

    def trapezoid_correction(self,
                             image: object) -> object:
        contours, sorted_indices = self._sorted_contours(image)

        for _, idx in enumerate(sorted_indices):
            contour = contours[idx]
            rect = cv.minAreaRect(contour)
            box = cv.boxPoints(rect)
            box = np.int0(box)
            w = rect[1][0]
            h = rect[1][1]
            a = rect[2]

            if w < 1000 or a == 90:
                continue

            h, w = image.shape[:2]
            c = cv.approxPolyDP(contour, 0.1 * cv.arcLength(contour, True), True)
            c = np.array(sorted(c, key=lambda x: x[0][0] + x[0][1]))
            if c.size < 8:
                break

            d = np.array([c[0][0], [c[1][0][0], c[0][0][1]], [c[0][0][0], c[2][0][1]], [c[1][0][0], c[2][0][1]]])
            M = cv.getPerspectiveTransform(c.astype(np.float32), d.astype(np.float32))
            image = cv.warpPerspective(image, M, (w, h), flags=cv.INTER_LINEAR, borderValue=(255,255,255))

        return image

    def ocr(self,
            file_path: str,
            lang: str='jpn',
            dpi: int=300,
            tessdata_dir: str='../../ocr/tesseract/langs',
            user_words_dir: str='../../ocr/tesseract/words.txt') -> list:
        tessconf = ' '.join([
            file_path,
            'stdout',
            f'-l {lang}',
            '--psm 11',
            '-c tessedit_create_tsv=1',
            f'--tessdata-dir {tessdata_dir}',
            f'--user-words {user_words_dir}',
            f'--dpi {dpi}'
        ])
        tsv2json = ' '.join([
            'jq -rRs \'split("\n")[1:-1]|',
            'map([split("\t")[]|split(",")]|',
            'select(.[10]?[0] != "-1")|',
            '{"x":.[6]?[0],"y":.[7]?[0],"w":.[8]?[0],"h":.[9]?[0],"cnf":.[10]?[0],"txt":.[11]?[0]})\''
        ])
        result = subprocess.run(f'tesseract {tessconf} | {tsv2json}', shell=True, capture_output=True, text=True)
        tessdata = []
        for data in json.loads(result.stdout):
            x = int(data['x'])
            y = int(data['y'])
            w = int(data['w'])
            h = int(data['h'])

            tessdata.append({
                'polygon': [
                    x, y,
                    x+w, y,
                    x+w, y+h,
                    x, y+h
                ],
                'c': float(data['cnf']),
                't': data['txt']
            })
        del tessconf, tsv2json, result

        return tessdata

