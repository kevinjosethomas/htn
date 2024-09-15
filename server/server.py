import os
import re
import json
from openai import OpenAI

import dotenv
import psycopg2
from flask_cors import CORS
from flask import Flask, Response, request
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer


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
            model="ft:gpt-4o-mini-2024-07-18:personal:text2gloss-full-data:A7WORNDv",
            messages=[
                {
                    "role": "system",
                    "content": "Translate English to ASL Gloss Grammar",
                },
                {
                    "role": "user",
                    "content": words,
                },
            ],
        )

        words = response.choices[0].message.content
        words = re.sub(r"DESC-|X-|-LRB-|-RRB-", "", words)

    words = words.split()

    cur = db.cursor()
    for word in words:
        embedding = embedding_model.encode(word)
        cur.execute(
            "SELECT word, poses, (embedding <=> %s) AS cosine_similarity FROM signs ORDER BY cosine_similarity ASC LIMIT 1",
            (embedding,),
        )
        result = cur.fetchone()

        if (1 - result[2]) < 0.70:
            animation = []
            for letter in word.upper():
                animation += fingerspelling.get(letter, [])

            for i in range(len(animation)):
                animation[i]["word"] = f"fs-{word.upper()}"

            animations += animation
        else:
            for i in range(len(result[1])):
                result[1][i]["word"] = result[0]

            animation = result[1]

        previous_frame = animations[-1] if animations else None
        next_frame = animation[0]

        if previous_frame and next_frame:
            for i in range(5):
                ratio = i / 5

                interpolated_frame = {
                    "frame": previous_frame["frame"] + i,
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

    return Response(json.dumps(animations), status=200)


if __name__ == "__main__":
    app.run()
