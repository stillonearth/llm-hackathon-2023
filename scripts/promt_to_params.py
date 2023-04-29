# !python

import openai
import os
import argparse
import json
import subprocess
import uuid

from PIL import Image


parser = argparse.ArgumentParser(
    description="Dress4All: Convert dress description to an dress design"
)
parser.add_argument(
    "--description", help="Dress description", default="A dress description"
)
args = parser.parse_args()

with open("./promt.txt", "r") as file:
    promt = file.read().replace("\n", "")

promt = promt.replace("{DESCRIPTION}", args.description)

# Do ChatGPT prompting
openai.api_key = os.environ["OPENAI_KEY"]
completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo", messages=[{"role": "user", "content": promt}]
)
response = completion.choices[0].message.content
params = json.loads(response)

# Make a dir to save this call's result
request_uuid = str(uuid.uuid4())
temp_dir_path = "./tmp/{uuid}".format(uuid=request_uuid)
subprocess.Popen(
    ["mkdir", temp_dir_path],
    universal_newlines=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
).communicate()

# Invoke Pupeteer script
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
        "--uuid",
        request_uuid,
    ],
    universal_newlines=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
result.communicate()

orig_path = "./tmp/{uuid}/screenshot.png".format(uuid=request_uuid)
cropped_path = "./tmp/{uuid}/cropped.png".format(uuid=request_uuid)

# Crop the text from screenshot
image = Image.open(orig_path)
width, height = image.size
image = image.crop((0, 65, width, height))
image.save(cropped_path)

result = subprocess.Popen(
    [
        "imagine",
        "--control-image",
        cropped_path,
        "--control-mode",
        "hed",
        # "--init-image-strength",
        # "0.2",
        # "professional photo of an expensive stunning dress in a fashion show, colored, dramatic angle, glass flare, award winning"
        "make dress look super realistic photo and add colour",
        # "-r",
        # "1",
        "-w",
        "1024",
        "-h",
        "1024",
        # "--steps",
        # "50",
        "--outdir",
        "./tmp/{uuid}".format(uuid=request_uuid),
    ],
    universal_newlines=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)


result.communicate()

# Print most recent file in directory
out_dir = "./tmp/{uuid}/generated".format(uuid=request_uuid)
files = os.listdir(out_dir)
files.sort(key=lambda x: os.path.getmtime(os.path.join(out_dir, x)), reverse=True)
if len(files) > 0:
    most_recent_file_path = os.path.join(out_dir, files[0])
    print(most_recent_file_path)
