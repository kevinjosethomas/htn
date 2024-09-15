import os
import re
import json
import gzip
from openai import OpenAI

import dotenv
import psycopg2
from flask_cors import CORS
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer
from flask import Flask, Response, request, make_response


dotenv.load_dotenv()
app = Flask(__name__)
CORS(app)
db = psycopg2.connect(
    database="poses",
    host="localhost",
    user="postgres",
    password=os.getenv("POSTGRES_PASSWORD"),
    port=5432,
)
register_vector(db)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


fingerspelling = {}
for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    file_path = os.path.join("data/alphabets", f"{letter}.json")
    with open(file_path, "r") as file:
        fingerspelling[letter] = json.load(file)


def interpolate_landmarks(start_landmark, end_landmark, ratio):

    interpolated_landmarks = []

    if start_landmark is None or end_landmark is None:
        return None

    for i in range(len(start_landmark)):
        if start_landmark[i] is None or end_landmark[i] is None:
            interpolated_landmarks.append(None)
        else:
            interpolated_landmark = {
                "x": start_landmark[i]["x"]
                + (end_landmark[i]["x"] - start_landmark[i]["x"]) * ratio,
                "y": start_landmark[i]["y"]
                + (end_landmark[i]["y"] - start_landmark[i]["y"]) * ratio,
                "z": start_landmark[i]["z"]
                + (end_landmark[i]["z"] - start_landmark[i]["z"]) * ratio,
                "visibility": start_landmark[i]["visibility"],
            }
            interpolated_landmarks.append(interpolated_landmark)

    return interpolated_landmarks


@app.route("/pose", methods=["POST"])
def pose():

    data = request.get_json()
    words = data.get("words", "").lower().strip()
    animations = []

    if not words:
        return Response(status=400)

    if words != "hello":
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are meant to convert text from English to ASL Gloss grammar. Do not change meaning or move periods. I will send you a phrase, please rephrase it it to follow ASL grammar order: object, then subject, then verb. Remove words like IS and ARE that are not present in ASL. Replace I with ME. Do not add classifiers. Everything should be English text. Please output nothing but the rephrased phrase.",
                },
                {
                    "role": "user",
                    "content": words,
                },
            ],
        )

        words = response.choices[0].message.content

    words = re.sub(r"\buh\b", "", words)

    print(words)
    words = words.split()

    cur = db.cursor()
    for word in words:
        embedding = embedding_model.encode(word)
        cur.execute(
            "SELECT word, poses, (embedding <=> %s) AS cosine_similarity FROM signs ORDER BY cosine_similarity ASC LIMIT 1",
            (embedding,),
        )
        result = cur.fetchone()

        animation = []
        if (1 - result[2]) < 0.75:
            for letter in word.upper():
                fingerspell = fingerspelling.get(letter, [])
                for i in range(len(fingerspell)):
                    fingerspell[i]["word"] = f"fs-{word.upper()}"
                animation += fingerspell
        else:
            animation += result[1]
            for i in range(len(animation)):
                animation[i]["word"] = result[0]

        previous_frame = None if not animations else animations[-1]

        if previous_frame and animation:
            next_frame = animation[0]

            for i in range(5):
                ratio = i / 5

                interpolated_frame = {
                    "frame": previous_frame["frame"] + i,
                    "word": previous_frame["word"],
                    "pose_landmarks": interpolate_landmarks(
                        previous_frame["pose_landmarks"],
                        next_frame["pose_landmarks"],
                        ratio,
                    ),
                    "left_hand_landmarks": interpolate_landmarks(
                        previous_frame["left_hand_landmarks"],
                        next_frame["left_hand_landmarks"],
                        ratio,
                    ),
                    "right_hand_landmarks": interpolate_landmarks(
                        previous_frame["right_hand_landmarks"],
                        next_frame["right_hand_landmarks"],
                        ratio,
                    ),
                    "face_landmarks": interpolate_landmarks(
                        previous_frame["face_landmarks"],
                        next_frame["face_landmarks"],
                        ratio,
                    ),
                }

                animations.append(interpolated_frame)

        animations += animation

    content = gzip.compress(json.dumps(animations).encode("utf8"), 5)
    response = make_response(content)
    response.headers["Content-length"] = len(content)
    response.headers["Content-Encoding"] = "gzip"

    return response


if __name__ == "__main__":
    app.run()
