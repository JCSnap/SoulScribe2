import os
from flask import Flask, request, jsonify
import openai
import re
import constants
import requests
import json
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt

# export OPENAI_API_KEY="YOUR_API_KEY"
# export SD_API_KEY="YOUR_API_KEY"

# PURPOSE OF THIS TEST
# This is a test to see how the given instruction would perform given different kinds of entries
# The goal is to select the entry that generates the best summary.
# We want a summary that perfectly captures the essence of the week in terms of the activities, events and emotions
# It has to be in second person, and it has to be told in a way that is interesting and engaging

# How to run?
# in your terminal, run the following command:
# python ./art_test.py
# Make sure that you are in the correct relative directory
# A window should pop up with the generated art pieces

openai.api_key = os.getenv("OPENAI_API_KEY")

instructions = constants.instructions_summary[0]
entries = constants.entries
arts = []

with open('summary_test.txt', 'a') as file:
    count = 0
    for entry in entries:
        try:
            count += 1
            print("Starting summary generation for instruction " + str(count))
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0613",
                messages=[
                    {"role": "system", "content": instructions},
                    {"role": "user", "content": entry}
                ]
            )
            print("Completed summary generation generation")
            summary = completion.choices[0].message.content.replace("\n", " ")
            print("Summary: " + summary)
            file.write("Summary: " + summary + "\n\n")
        except Exception as e:
            print(e)
            continue
