import axios from "axios";
import { useEffect, useRef } from "react";
import {
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
} from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("http://127.0.0.1:5000/pose", {
        words: "hello test",
      });

      const landmarks = response.data;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < landmarks.length; i++) {
        setTimeout(() => {
          const landmark = landmarks[i];
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (landmark.pose_landmarks) {
            landmark.pose_landmarks.forEach((point) => {
              point.visibility = 1;
            });

            drawConnectors(ctx, landmark.pose_landmarks, POSE_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 1,
            });
            drawLandmarks(ctx, landmark.pose_landmarks, {
              color: "#00FF00",
              lineWidth: 1,
            });
          }

          if (landmark.face_landmarks) {
            landmark.face_landmarks.forEach((point) => {
              point.visibility = 1;
            });

            drawConnectors(ctx, landmark.face_landmarks, FACEMESH_TESSELATION, {
              color: "#00FF00",
              lineWidth: 1,
            });
            drawLandmarks(ctx, landmark.face_landmarks, {
              color: "#00FF00",
              lineWidth: 1,
            });
          }

          if (landmark.right_hand_landmarks) {
            landmark.right_hand_landmarks.forEach((point) => {
              point.visibility = 1;
            });

            drawConnectors(
              ctx,
              landmark.right_hand_landmarks,
              HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 1,
              }
            );
            drawLandmarks(ctx, landmark.right_hand_landmarks, {
              color: "#00FF00",
              lineWidth: 1,
            });
          }

          if (landmark.left_hand_landmarks) {
            landmark.left_hand_landmarks.forEach((point) => {
              point.visibility = 1;
            });

            drawConnectors(
              ctx,
              landmark.left_hand_landmarks,
              HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 1,
              }
            );
            drawLandmarks(ctx, landmark.left_hand_landmarks, {
              color: "#00FF00",
              lineWidth: 1,
            });
          }
        }, i * 33);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
}
