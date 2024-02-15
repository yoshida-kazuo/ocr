import os
import whisper

class Voice2Text:

    def run(self,
            file: str,
            model: str="small.en",
            lang: str="en",
            task: str=None):
        if os.path.isfile(file) == False:
            raise ValueError(f"File not found : {file}")

        whidper_model = whisper.load_model(model)
        result = whidper_model.transcribe(file,
                                          language=lang,
                                          fp16=False,
                                          task=task,
                                          word_timestamps=True)

        print(result['text'])
