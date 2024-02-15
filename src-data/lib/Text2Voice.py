import  subprocess
from pathlib import Path
import voicevox_core
from voicevox_core import (
    AccelerationMode,
    AudioQuery,
    VoicevoxCore
)

class Text2Voice:

    def run(self,
            text: str,
            output_wav: str,
            dictionary_dir: str="/var/lib/mecab/dic/open-jtalk/naist-jdic",
            speaker_id: int=3,
            engine: str="voicevox"):
        if engine == "open-jtalk":
            cmd = ["open_jtalk"]
            cmd.extend([
                "-x", dictionary_dir,
                "-m", "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice",
                "-ow", output_wav
            ])

            with subprocess.Popen(cmd, stdin=subprocess.PIPE) as proc:
                proc.stdin.write(text.encode('utf-8'))
                proc.stdin.close()
                proc.wait()
        elif engine == "espeak":
            cmd = ["espeak"]
            cmd.extend([
                "-s 170",
                "-p 75",
                "-k 25",
                "-g 9",
                "-w", output_wav,
                "-f", text
            ])

            subprocess.run(cmd,
                           capture_output=False,
                           stdout=subprocess.DEVNULL)
        elif engine == "TTS":
            with open(text, 'r', encoding='utf-8') as file:
                data = file.read()

            cmd = ["tts"]
            cmd.extend([
                "--device=cpu",
                f"--text={data}",
                f"--out_path={output_wav}"
            ])

            subprocess.run(cmd,
                           capture_output=False,
                           stdout=subprocess.DEVNULL)
        else:
            with open(text, 'r', encoding='utf-8') as file:
                data = file.read()

            voicevox_core = VoicevoxCore(
                acceleration_mode=AccelerationMode.AUTO,
                open_jtalk_dict_dir=dictionary_dir
            )
            voicevox_core.load_model(speaker_id)
            audio_query = voicevox_core.audio_query(data, speaker_id)
            Path(output_wav).write_bytes(
                voicevox_core.synthesis(audio_query, speaker_id)
            )

        return output_wav
