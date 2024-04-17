import os
import shutil
from pathlib import Path
import cv2 as cv
import numpy as np
import json
import subprocess
from PIL import Image
from multiprocessing import Process
import fitz
import easyocr
from paddleocr import PaddleOCR

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

    def image_correction(self,
              file_path: str=None,
              output_dir: str=None,
              output_file: str='output.png',
              dpi: int=None) -> None:
        """
        画像補正を行うメソッド

        Args:
            file_path (str, optional): 入力画像ファイルのパス。デフォルトはNone。
            output_dir (str, optional): 出力ディレクトリのパス。デフォルトはNone。
            output_file (str, optional): 出力ファイル名。デフォルトは'output.png'。
            dpi (int, optional): 出力画像の解像度。デフォルトはNone。

        Returns:
            None
        """

        if isinstance(file_path, str):
            self.file_path = file_path
        if isinstance(output_dir, str):
            self.output_dir = output_dir
        elif not isinstance(self.output_dir, str):
            self.output_dir = os.path.dirname(self.file_path)

        if isinstance(output_file, str):
            self.output_file = output_file
        if not isinstance(dpi, int):
            dpi = self.dpi

        output_file_path = f"{self.output_dir}/{self.output_file}"

        self.image = cv.imread(self.file_path)
        h, w = self.image.shape[:2]
        ratio = 1
        self.layout = 'portrait'
        if w > h:
            self.layout = 'landscape'

        p_w, _ = self._a4shape(layout=self.layout, dpi=dpi)
        ratio = p_w / w
        if ratio != 1:
            self.image = cv.resize(self.image, dsize=None, fx=ratio, fy=ratio)
        del p_w, ratio

        self.image = self._auto_rotate(self.image)
        self.image = self._trapezoid_correction(self.image)
        cv.imwrite(output_file_path, self.image)

    def _sorted_contours(self,
                         image: object) -> list:
        """
        画像の輪郭をソートして返すメソッド

        Args:
            image (object): 入力画像データ

        Returns:
            list: ソートされた輪郭のリスト
        """

        image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        _, b = cv.threshold(image_gray, 50, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)
        contours, _ = cv.findContours(b, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)

        return [
            contours,
            sorted(range(len(contours)),
                   key=lambda i: cv.contourArea(contours[i]),
                   reverse=True)
        ]

    def _a4shape(self,
                layout: str='portrait',
                dpi: int=None) -> list:
        """
        A4用紙のサイズを取得するメソッド

        Args:
            layout (str, optional): ページのレイアウト。'portrait' または 'landscape'。デフォルトは'portrait'。
            dpi (int, optional): 解像度（DPI）。デフォルトはNone。

        Returns:
            list: A4用紙の幅と高さのリスト
        """

        if not isinstance(dpi, int):
            dpi = self.dpi

        paper_layout = self.paper_layout[f"a4_{layout[0]}"]

        return [self._mm2pixel(mm, dpi) for mm in paper_layout]

    def _mm2pixel(self,
                  mm: int,
                  dpi: int=None) -> int:
        """
        ミリメートルをピクセルに変換するメソッド

        Args:
            mm (int): ミリメートル単位の長さ
            dpi (int, optional): 解像度（DPI）。デフォルトはNone。

        Returns:
            int: ピクセル単位の長さ
        """

        if not isinstance(dpi, int):
            dpi = self.dpi

        return int(dpi * mm / 25.4)

    def _auto_rotate(self,
                    image: object) -> object:
        """
        画像を自動的に回転させるメソッド

        Args:
            image (object): 入力画像データ

        Returns:
            object: 回転後の画像データ
        """

        contours, sorted_indices = self._sorted_contours(image)

        for _, idx in enumerate(sorted_indices):
            contour = contours[idx]
            rect = cv.minAreaRect(contour)
            w = rect[1][0]
            h = rect[1][1]
            a = rect[2]

            if w < 1000 or abs(a) == 90 or a == 0 \
                    or (not (-78 < a < -102) and not (-12 < a < 12) and not (78 < a < 102) and not (168 < a < 192)):
                continue

            a -= round(a / 90, 1) * 90
            r_h, r_w = image.shape[:2]
            m = cv.getRotationMatrix2D((r_h / 2, r_w / 2), a, 1)
            image = cv.warpAffine(image, m, (r_w, r_h), borderValue=(255,255,255))
            # k = np.array([[0, -1, 0],
            #               [-1, 5, -1],
            #               [0, -1, 0]], dtype=np.float32)
            # image = cv.filter2D(image, -1, k)
            break

        return image

    def _trapezoid_correction(self,
                             image: object) -> object:
        """
        台形補正を行うメソッド

        Args:
            image (object): 入力画像データ

        Returns:
            object: 補正後の画像データ
        """

        contours, sorted_indices = self._sorted_contours(image)

        for _, idx in enumerate(sorted_indices):
            contour = contours[idx]
            rect = cv.minAreaRect(contour)
            box = cv.boxPoints(rect)
            box = np.int0(box)
            w = rect[1][0]
            h = rect[1][1]
            a = rect[2]

            if w < 1000 or abs(a) == 90 or a == 0:
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
            lang: str='jpn_custom',
            dpi: int=300,
            config_path: str='/opt/data/src/ocr/tesseract/jpn_custom.conf',
            tessdata_dir: str='/opt/data/src/ocr/tesseract/langs',
            user_words_path: str='/opt/data/src/ocr/tesseract/words.txt') -> list:
        """
        OCR（Optical Character Recognition）を実行するメソッド

        Args:
            file_path (str): OCRを実行する画像ファイルのパス
            lang (str, optional): 使用する言語。デフォルトは'jpn_custom'。
            dpi (int, optional): 解像度（DPI）。デフォルトは300。
            config_path (str, optional): Tesseractの設定ファイルのパス。デフォルトは'/opt/data/src/ocr/tesseract/jpn_custom.conf'。
            tessdata_dir (str, optional): Tesseractの言語データのディレクトリパス。デフォルトは'/opt/data/src/ocr/tesseract/langs'。
            user_words_path (str, optional): ユーザー定義単語ファイルのパス。デフォルトは'/opt/data/src/ocr/tesseract/words.txt'。

        Returns:
            list: OCR結果のリスト
        """

        tessconf = ' '.join([
            file_path,
            'stdout',
            '-l', lang,
            '--psm', '11',
            '-c', 'tessedit_create_tsv=1',
            '--tessdata-dir', tessdata_dir,
            '--user-words', user_words_path,
            '--dpi', str(dpi),
            config_path
        ])
        tsv2json = ' '.join([
            'jq -rRs \'split("\n")[1:-1]|',
            'map([split("\t")[]|split(",")]|',
            'select(.[10]?[0] != "-1")|',
            '{"x":.[6]?[0],"y":.[7]?[0],"w":.[8]?[0],"h":.[9]?[0],"cnf":.[10]?[0],"txt":.[11]?[0]})\''
        ])
        result = subprocess.run(f'tesseract {tessconf} | {tsv2json}', shell=True, capture_output=True, text=True)
        tessdata = {
            'status': 'succeeded',
            'analyzeResult': {
                'pages': [
                    {
                        'unit': 'pixel',
                        'lines': [],
                        'words': [],
                    }
                ]
            }
        }
        for data in json.loads(result.stdout):
            x = int(data['x'])
            y = int(data['y'])
            w = int(data['w'])
            h = int(data['h'])

            tessdata['analyzeResult']['pages'][0]['words'].append({
                'polygon': [
                    x, y,
                    x+w, y,
                    x+w, y+h,
                    x, y+h
                ],
                'confidence': float(data['cnf'])  / 100,
                'content': data['txt']
            })
        del tessconf, tsv2json, result

        return json.dumps(tessdata, ensure_ascii=False)

    def text_detection(self,
                        image_path: str):
        """
        画像内のテキスト領域を検出するメソッド

        Args:
            image_path (str): 画像ファイルのパス

        Returns:
            str: 検出されたテキスト領域の情報を含むJSON形式の文字列
        """

        image = cv.imread(image_path)
        gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

        mser = cv.MSER_create()
        regions, _ = mser.detectRegions(gray)

        bounding_boxes = [cv.boundingRect(region) for region in regions]
        merged_rectangles = self._merge_adjacent_rectangles(bounding_boxes)

        json_rectangles = []
        for rect in merged_rectangles:
            x, y, w, h = rect
            if (w > h and h < 12) or (h > w and w < 12):
                continue

            cv.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
            overlay = image.copy()
            cv.fillPoly(overlay, [np.array([(x, y), (x + w, y), (x + w, y + h), (x, y + h)])], (0, 0, 255, 128))
            cv.addWeighted(overlay, 0.5, image, 0.5, 0, image)

            json_rectangles.append({
                'x': x,
                'y': y,
                'width': w,
                'height': h
            })

        output_path = os.path.splitext(image_path)[0] + "_text_detected.jpg"
        cv.imwrite(output_path, image)

        return json.dumps(json_rectangles)

    def _is_bbox_overlapped(self,
                           bbox1,
                           bbox2,
                           threshold=33):
        """
        2つのバウンディングボックスが重なっているかどうかを判定するメソッド

        Args:
            bbox1: バウンディングボックス1
            bbox2: バウンディングボックス2
            threshold (int, optional): 重なりの閾値。デフォルトは33。

        Returns:
            bool: バウンディングボックスが重なっている場合はTrue、それ以外の場合はFalse
        """

        x1, y1, w1, h1 = bbox1
        x2, y2, w2, h2 = bbox2

        w1 += threshold
        x1 -= threshold
        w2 += threshold
        x2 -= threshold

        return (x1 < x2 + w2 and x2 < x1 + w1) and (y1 < y2 + h2 and y2 < y1 + h1)

    def _merge_adjacent_rectangles(self,
                                  rectangles):
        """
        隣接する矩形を結合するメソッド

        Args:
            rectangles (list): 矩形のリスト

        Returns:
            list: 結合された矩形のリスト
        """

        merged_rectangles = []

        for i, rect in enumerate(rectangles):
            is_merged = False

            for merged_rect in merged_rectangles:
                if self._is_bbox_overlapped(rect, merged_rect):
                    x = min(rect[0], merged_rect[0])
                    y = min(rect[1], merged_rect[1])
                    w = max(rect[0] + rect[2], merged_rect[0] + merged_rect[2]) - x
                    h = max(rect[1] + rect[3], merged_rect[1] + merged_rect[3]) - y
                    merged_rectangles[merged_rectangles.index(merged_rect)] = (x, y, w, h)
                    is_merged = True
                    break

            if not is_merged:
                merged_rectangles.append(rect)

        if len(merged_rectangles) < len(rectangles):
            return self._merge_adjacent_rectangles(merged_rectangles)
        else:
            return merged_rectangles

    def line_detection(self,
                       image_path: str):
        """
        画像内の直線領域を検出するメソッド

        Args:
            image_path (str): 画像ファイルのパス

        Returns:
            str: 検出された直線領域の情報を含むJSON形式の文字列
        """

        image = cv.imread(image_path)
        img_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

        _, img_bin = cv.threshold(img_gray, 215, 255, cv.THRESH_BINARY)
        img = ~img_bin
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

        _, _, stats, _ = cv.connectedComponentsWithStats(~img, connectivity=8, ltype=cv.CV_32S)
        area_min_thresh = 3333 * (self.dpi / 300)
        area_max_thresh = 99999 * (self.dpi / 300)
        lines = []

        for idx, (x, y, w, h, area) in enumerate(stats[2:], start=2):
            if (area < area_min_thresh or area > area_max_thresh):
                continue
            x = int(x)
            y = int(y)
            w = int(w)
            h = int(h)

            cv.rectangle(image, (x, y), (x+w, y+h), (0, 0, 255), 2)
            lines.append({
                'x': x,
                'y': y,
                'width': w,
                'height': h
            })

        output_path = os.path.splitext(image_path)[0] + "_area_detected.jpg"
        cv.imwrite(output_path, image)

        return json.dumps(lines)

    def analyze(self,
                image_path: str,
                engine: str="tesseract",
                layout: bool=True,
                lang: str="jpn_custom"):
        """
        画像を解析してテキストを抽出するメソッド

        Args:
            image_path (str): 画像ファイルのパス
            engine (str): 解析に使用するエンジン デフォルトは"tesseract"。
            lang (str, optional): 使用する言語。デフォルトは"jpn_custom"。

        Returns:
            str: 解析結果のJSON形式の文字列
        """

        if engine == "easyocr":
            self.easyocrReader = easyocr.Reader(['ja', 'en'],
                                                model_storage_directory="/opt/data/src/ocr/easyocr",
                                                user_network_directory="/opt/data/src/ocr/easyocr",
                                                download_enabled=True,
                                                gpu=True)
        elif engine == "paddleocr":
            self.paddleocrReader = self._paddleocr()

        file_name = os.path.basename(image_path)
        file_name_without_extension, file_extension = os.path.splitext(file_name)
        input_folder = os.path.dirname(image_path)
        analyze_file_path = os.path.join(input_folder, file_name_without_extension + "_analyze" + file_extension)
        shutil.copyfile(image_path, analyze_file_path)
        image_analyze = cv.imread(analyze_file_path)
        text_crop_padding_size = 12

        processes = []
        try:
            for filename in os.listdir(input_folder):
                if filename.startswith("cropped_area_"):
                    file_path = os.path.join(input_folder, filename)
                    process = Process(target=os.remove,
                                      args=(file_path,))
                    process.start()
                    processes.append(process)
            for process in processes:
                process.join()
        except Exception as e:
            pass
            # print("Error while deleting cropped_area files:", e)

        linearea_json = self.line_detection(analyze_file_path)
        linearea = json.loads(linearea_json)

        if layout == True:
            processes = []
            for idx, area in enumerate(linearea):
                x, y, w, h = area['x'], area['y'], area['width'], area['height']
                cv.rectangle(image_analyze, (x, y), (x+w, y+h), (255, 255, 255), -1)
                cropped_image_path = os.path.join(input_folder, f"cropped_area_line-{x}-{y}-{w}-{h}.png")
                process = Process(target=self.crop_text_area,
                                args=(analyze_file_path,
                                        cropped_image_path,
                                        x,
                                        y,
                                        w,
                                        h,
                                        text_crop_padding_size,))
                process.start()
                processes.append(process)
            for process in processes:
                process.join()

            cv.imwrite(analyze_file_path, image_analyze)

        textarea_json = self.text_detection(analyze_file_path)
        textarea = json.loads(textarea_json)

        processes = []
        for idx, area in enumerate(textarea):
            x, y, w, h = area['x'], area['y'], area['width'], area['height']
            cv.rectangle(image_analyze, (x, y), (x+w, y+h), (255, 255, 255), -1)
            cropped_image_path = os.path.join(input_folder, f"cropped_area_text-{x}-{y}-{w}-{h}.png")
            process = Process(target=self.crop_text_area,
                              args=(analyze_file_path,
                                    cropped_image_path,
                                    x,
                                    y,
                                    w,
                                    h,
                                    text_crop_padding_size,))
            process.start()
            processes.append(process)
        for process in processes:
            process.join()

        cv.imwrite(analyze_file_path, image_analyze)

        ocr_results = {
            'words': [],
            'lines': linearea,
        }
        try:
            for filename in os.listdir(input_folder):
                if filename.startswith("cropped_area_"):
                    file_path = os.path.join(input_folder, filename)
                    output_list = self.process_engine(engine=engine)(image_path=file_path,
                                                                     lang=lang)

                    if output_list:
                        image_info = filename.split("_")[-1].split(".")[0].split("-")[-4:]
                        x_offset, y_offset, width, height = map(int, image_info)

                        width += 2 * text_crop_padding_size
                        height += 2 * text_crop_padding_size
                        x_offset -= text_crop_padding_size
                        y_offset -= text_crop_padding_size

                        for output in output_list:
                            x = int(output['x']) + x_offset
                            y = int(output['y']) + y_offset
                            output['x'] = x
                            output['y'] = y

                        ocr_results['words'].append(output_list)
        except Exception as e:
            pass
            # print("Error while analyze cropped_area files:", e)

        output_json_path = os.path.join(input_folder, "analyze.json")
        with open(output_json_path, 'w') as f:
            json.dump(ocr_results,
                      f,
                      ensure_ascii=False)

        return json.dumps(ocr_results,
                          ensure_ascii=False)

    def crop_text_area(self,
                       image_path: str,
                       output_path: str,
                       x: int,
                       y: int,
                       w: int,
                       h: int,
                       padding: int=0,
                       crop_threshold=33):
        """
        画像からテキスト領域を切り抜くメソッド

        Args:
            image_path (str): 元画像ファイルのパス
            output_path (str): 切り抜いた画像を保存するファイルのパス
            x (int): 切り抜く領域の左上のX座標
            y (int): 切り抜く領域の左上のY座標
            w (int): 切り抜く領域の幅
            h (int): 切り抜く領域の高さ
            padding (int, optional): テキスト領域の周囲に追加する余白のサイズ。デフォルトは0。
            crop_threshold (int, optional): 対象エリアの状態で切り抜きを行うか判定する閾値。デフォルトは33。
        """

        image = cv.imread(image_path)
        cropped_area = image[y:y+h, x:x+w]

        avg_color = np.mean(cropped_area, axis=(0, 1))
        if np.all(np.abs(cropped_area - avg_color) < crop_threshold):
            return None

        background_color = self._get_background_color(cropped_area)
        border_color = (int(background_color[0]), int(background_color[1]), int(background_color[2]))

        cropped_area = cv.copyMakeBorder(cropped_area,
                                         padding,
                                         padding,
                                         padding,
                                         padding,
                                         cv.BORDER_CONSTANT,
                                         value=border_color)

        cv.imwrite(output_path, cropped_area)

    def _get_background_color(self,
                             image,
                             margin_percentage: int=10):
        """
        画像の背景色を取得するメソッド

        Args:
            image: 画像
            margin_percentage (int, optional): 画像の上下端から背景色を取得するためのマージンの割合。デフォルトは10。

        Returns:
            tuple: 背景色を表す(R, G, B)のタプル
        """

        height, width = image.shape[:2]
        top_margin = int(height * margin_percentage / 100)
        bottom_margin = int(height * margin_percentage / 100)

        top_region = image[:top_margin, :]
        bottom_region = image[-bottom_margin:, :]
        combined_region = np.vstack((top_region, bottom_region))
        background_color = self._get_most_frequent_color(combined_region)

        return background_color

    def _get_most_frequent_color(self,
                                image):
        """
        画像中の最頻値の色を取得するメソッド

        Args:
            image: 画像

        Returns:
            tuple: 最頻値の色を表す(R, G, B)のタプル
        """

        flattened_image = image.reshape(-1, 3)
        unique_colors, counts = np.unique(flattened_image,
                                          axis=0,
                                          return_counts=True)
        most_frequent_color = unique_colors[np.argmax(counts)]

        return most_frequent_color

    def _process_ocr_result(self,
                           output_text: str):
        """
        OCR結果を処理するメソッド

        Args:
            output_text (str): OCRの結果を表す文字列

        Returns:
            str: 処理されたOCR結果を表す文字列
        """

        result = subprocess.run(
            f'echo "{output_text}" | jq -rRs \'split("\n")[1:-1]|map([split("\t")[]|split(",")]|select(.[10]?[0] != "-1")|{{"x":.[6]?[0],"y":.[7]?[0],"w":.[8]?[0],"h":.[9]?[0],"cnf":.[10]?[0],"txt":.[11]?[0]}})\'',
            capture_output=True,
            text=True,
            shell=True
        )

        return result.stdout.strip()

    def run_tesseract(self,
                      image_path: str,
                      lang: str='jpn_custom',
                      dpi: int=300,
                      config_path: str='/opt/data/src/ocr/tesseract/jpn_custom.conf',
                      tessdata_dir: str='/opt/data/src/ocr/tesseract/langs',
                      user_words_path: str='/opt/data/src/ocr/tesseract/words.txt'):
        """
        Tesseract OCRを実行してテキストを抽出するメソッド

        Args:
            image_path (str): 画像ファイルのパス
            lang (str, optional): 使用する言語。デフォルトは"jpn_custom"。
            dpi (int, optional): 画像の解像度。デフォルトは300。
            config_path (str, optional): Tesseractの設定ファイルのパス。デフォルトは'/opt/data/src/ocr/tesseract/jpn_custom.conf'。
            tessdata_dir (str, optional): Tesseractの言語データが格納されているディレクトリのパス。デフォルトは'/opt/data/src/ocr/tesseract/langs'。
            user_words_path (str, optional): ユーザー定義の単語リストファイルのパス。デフォルトは'/opt/data/src/ocr/tesseract/words.txt'。

        Returns:
            list: 抽出されたテキストの情報を含むリスト
        """

        result = subprocess.run([
            'tesseract',
            image_path,
            'stdout',
            '-l', lang,
            '--psm', '6',
            '-c', 'tessedit_create_tsv=1',
            '--tessdata-dir', tessdata_dir,
            '--user-words', user_words_path,
            '--dpi', str(dpi),
            config_path
        ], capture_output=True, text=True)

        tsv = result.stdout.strip()
        tsv2json = self._process_ocr_result(tsv)

        return json.loads(tsv2json)

    def run_easyocr(self,
                    image_path: str,
                    lang: str='ja, en') -> str:
        """
        EasyOCRを使用してOCRを実行するメソッド

        Args:
            image_path (str): 画像ファイルのパス
            lang (str): 使用する言語を指定

        Returns:
            str: OCRの結果を含むJSON形式の文字列
        """

        results = self.easyocrReader.readtext(image_path,
                                              detail=True,
                                              decoder='greedy',
                                              beamWidth=5,
                                              batch_size=1,
                                              workers=0,
                                              blocklist='|─┌┐└┘',
                                              paragraph=False,
                                              min_size=1,   # (int, default = 10) - Filter text box smaller than minimum value in pixel
                                              rotation_info=None,
                                              contrast_ths=0.1, # (float, default = 0.5) - target contrast level for low contrast text box
                                              adjust_contrast=0.5, # (float, default 0.7)

                                              text_threshold=0.7,
                                              low_text=0.4,
                                              link_threshold=0.4,
                                              canvas_size=3508, # (int, default 2560)
                                              mag_ratio=1.5, # (float, default 1)

                                              slope_ths=0.1,
                                              ycenter_ths=0.5,
                                              height_ths=0.5,
                                              width_ths=0.7, # (float, default = 0.5) - Maximum horizontal distance to merge boxes.
                                              add_margin=0.1, # (float, default = 0.1) - Extend bounding boxes in all direction by certain value. This is important for language with complex script (E.g. Thai).
                                              x_ths=1.0,
                                              y_ths=0.5)

        json_list = []
        for result in results:
            bounding_box, text, confidence = result
            x_min = min(point[0] for point in bounding_box)
            y_min = min(point[1] for point in bounding_box)
            x_max = max(point[0] for point in bounding_box)
            y_max = max(point[1] for point in bounding_box)
            width = x_max - x_min
            height = y_max - y_min
            formatted_result = {"x": float(x_min), "y": float(y_min), "w": float(width), "h": float(height), "txt": text, "cnf": float(confidence)}
            json_list.append(formatted_result)

        return json_list

    def _paddleocr(self,
                   lang: str='japan'):
        """
        PaddleOCRのインスタンスを返すメソッド

        Args:
            lang (str): 使用する言語を指定

        Returns:
            PaddleOCRインスタンス
        """

        return PaddleOCR(lang=lang,
                         rec_char_dict_path="/opt/data/src/ocr/paddleocr/japan_dict.txt",
                         use_angle_cls=True,
                         use_gpu=True, # default False
                         use_space_char=True,
                         drop_score=0.45, # default float 0.5
                         det_limit_side_len=3508, # default int 960
                         det_db_thresh=0.3, # default float 0.3
                         det_db_box_thresh=0.6, # default float 0.6
                         det_db_unclip_ratio=1.5,
                         max_batch_size=10,
                         use_dilation=False, # default bool False
                         det_db_score_mode='slow', # default str first
                         binarize=False, # default bool False
                         det_pse_min_area=16, # default float 16
                         rec_algorithm='CRNN', # default CRNN
                         show_log=False)

    def run_paddleocr(self,
                      image_path: str,
                      lang: str='japan'):
        """
        PaddleOCRを使用してOCRを実行するメソッド

        Args:
            image_path (str): 画像ファイルのパス
            lang (str): 使用する言語を指定

        Returns:
            str: OCRの結果を含むJSON形式の文字列
        """

        results = self.paddleocrReader.ocr(image_path,
                                           cls=True)

        json_list = []
        for idx in range(len(results)):
            res = results[idx]
            if results[idx]:
                for result in res:
                    bounding_box, (text, confidence) = result
                    x_min = min(point[0] for point in bounding_box)
                    y_min = min(point[1] for point in bounding_box)
                    x_max = max(point[0] for point in bounding_box)
                    y_max = max(point[1] for point in bounding_box)
                    width = x_max - x_min
                    height = y_max - y_min
                    formatted_result = {"x": float(x_min), "y": float(y_min), "w": float(width), "h": float(height), "txt": text, "cnf": float(confidence)}
                    json_list.append(formatted_result)

        return json_list

    def process_engine(self,
                       engine: str):
        """
        解析サービスを返すメソッド

        Args:
            engine (str): 使用するサービス名

        Returns:
            str: OCRの結果を含むJSON形式の文字列
        """

        switcher = {
            "tesseract": self.run_tesseract,
            "easyocr": self.run_easyocr,
            "paddleocr": self.run_paddleocr,
        }
        selected_function = switcher.get(engine, lambda: "Invalid engine")

        return selected_function

    def extract_text_and_coordinates(self,
                                     pdf_filepath: str):
        """
        PDFから埋込テキストを抽出するメソッド

        Args:
            pdf_filepath (str): PDFファイルのパス

        Returns:
            str: PDFから抽出したJSON形式の文字列
        """

        doc = fitz.open(pdf_filepath)

        for page in doc:
            text = page.get_text('json')
            return text
