import os
import json
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


fingerspelling = {}
for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    file_path = os.path.join("data/alphabets", f"{letter}.json")
    with open(file_path, "r") as file:
        fingerspelling[letter] = json.load(file)


@app.route("/pose", methods=["POST"])
def pose():
    data = request.get_json()
    words = data.get("words", "").lower().strip()
    animations = []

    if not words:
        return Response(status=400)

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
                animation.extend(fingerspelling.get(letter, []))

            for i in range(len(animation)):
                animation[i]["word"] = f"fs-{word.upper()}"

            animations += animation
        else:
            for i in range(len(result[1])):
                result[1][i]["word"] = result[0]

            animations += result[1]

    return Response(json.dumps(animations), status=200)


if __name__ == "__main__":
    app.run()
