import {
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
} from "@mediapipe/holistic";
import { useEffect, useRef } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import { type Point } from "@/app/types";

export default function Avatar({ poses }: { poses: any[] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < poses.length; i++) {
      setTimeout(() => {
        const landmark = poses[i];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (landmark.pose_landmarks) {
          landmark.pose_landmarks.forEach((point: Point) => {
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
          landmark.face_landmarks.forEach((point: Point) => {
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
          landmark.right_hand_landmarks.forEach((point: Point) => {
            point.visibility = 1;
          });

          drawConnectors(ctx, landmark.right_hand_landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 1,
          });
          drawLandmarks(ctx, landmark.right_hand_landmarks, {
            color: "#00FF00",
            lineWidth: 1,
          });
        }

        if (landmark.left_hand_landmarks) {
          landmark.left_hand_landmarks.forEach((point: Point) => {
            point.visibility = 1;
          });

          drawConnectors(ctx, landmark.left_hand_landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 1,
          });
          drawLandmarks(ctx, landmark.left_hand_landmarks, {
            color: "#00FF00",
            lineWidth: 1,
          });
        }
      }, i * 33);
    }
  }, [poses]);

  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
}
