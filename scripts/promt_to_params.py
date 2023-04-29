import openai
import os
import argparse
import json
import subprocess
from PIL import Image

parser = argparse.ArgumentParser(
    description="Dress4All: Convert dress description to an dress design"
)

parser.add_argument(
    "--description", help="Dress description", default="A dress description"
)

args = parser.parse_args()

openai.api_key = os.environ["OPENAI_KEY"]

with open("./promt.txt", "r") as file:
    promt = file.read().replace("\n", "")

promt = promt.replace("{DESCRIPTION}", args.description)

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo", messages=[{"role": "user", "content": promt}]
)
response = completion.choices[0].message.content

# make sure response is correctly formated JSON
params = json.loads(response)

result = subprocess.Popen(
    [
        "node",
        "./scripts/snap_dress.mjs",
        "--bodice",
        params["bodice"],
        "--sleeve",
        params["sleeve"],
        "--skirt",
        params["skirt"],
        "--skirt_length",
        params["skirt_length"],
        "--lace_overlay_on_bust",
        params["lace_overlay_on_bust"],
        "--lace_overlay_on_skirt",
        params["lace_overlay_on_skirt"],
        "--extras_collar",
        params["extras_collar"],
        "--extras_stash",
        params["extras_stash"],
    ],
    universal_newlines=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
result.communicate()
image = Image.open("./tmp/screenshot.png")
# Get the size of the image
width, height = image.size
image = image.crop((0, 65, width, height))
image.save("./tmp/cropped.png")


result = subprocess.Popen(
    [
        "imagine",
        "--model",
        "SD-2.0-depth",
        "--init-image",
        "./tmp/cropped.png",
        "--init-image-strength",
        "0.05",
        "professional photo of a woman in a fashion show, luxury, award winning, glamour"
        "-r",
        "1",
        "-w",
        "1024",
        "-h",
        "1024",
        "--steps",
        "50",
    ],
    universal_newlines=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
result.communicate()
print("done")
