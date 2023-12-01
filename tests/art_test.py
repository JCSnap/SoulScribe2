import os
import constants
import requests
import json
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
import constants
import time

# export OPENAI_API_KEY="YOUR_API_KEY"
# export SD_API_KEY="YOUR_API_KEY"

# Given the same art style, this is to test how different 'events' (or highlights) will
# look like for the current art style

events = constants.events

style = constants.styles["abstract_painting"]

arts = []

for event in events:
    try:
        prompt = f"{event}, {style}"
        url = "https://stablediffusionapi.com/api/v3/text2img"
        payload = json.dumps({
            "key": os.getenv("SD_API_KEY"),
            "prompt": prompt,
            "width": "512",
            "height": "512",
            "samples": "1",
            "num_inference_steps": "20",
            "seed": None,
            "guidance_scale": 7.5,
            "safety_checker": "yes",
            "multi_lingual": "no",
            "panorama": "no",
            "self_attention": "no",
            "upscale": "no",
            "webhook": None,
            "track_id": None
        })

        headers = {
            'Content-Type': 'application/json'
        }

        print("Sending request to Stable Diffusion API...")
        response = requests.request(
            "POST", url, headers=headers, data=payload)
        print("Completed art generation")

        # Parse the JSON data
        json_data = json.loads(response.text)

        # Extract the URL
        print(json_data)
        art = json_data["output"][0]
        print(art)

        arts.append(art)
        time.sleep(1)
    except Exception as e:
        print(e)
        continue

num_arts = len(arts)
num_cols = 3
num_rows = num_arts // num_cols + 1

fig, axes = plt.subplots(num_rows, num_cols, figsize=(12, 8))

# Loop through the image URLs and display images
for i, url in enumerate(arts):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))

    # Calculate the position in the grid
    row = i // num_cols
    col = i % num_cols

    # Display the image in the corresponding subplot
    axes[row, col].imshow(img)
    axes[row, col].axis('off')

# Remove empty subplots if the number of images is not a multiple of num_cols * num_rows
if num_arts % num_cols != 0:
    for i in range(num_arts, num_rows * num_cols):
        row = i // num_cols
        col = i % num_cols
        fig.delaxes(axes[row, col])

plt.tight_layout()
plt.show()
