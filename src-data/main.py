import fire
# from lib import Voice2Text as v2t, Text2Voice as t2v
from lib.Ocr import Ocr

if __name__ == "__main__":
    fire.Fire({
        # 'v2t': v2t.Voice2Text,
        # 't2v': t2v.Text2Voice,
        'ocr': Ocr,
    })
