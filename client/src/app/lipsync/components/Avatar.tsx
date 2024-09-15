import {
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
} from "@mediapipe/holistic";
import { useEffect, useState, useRef } from "react";
import { drawConnectors } from "@mediapipe/drawing_utils";

import { type Point } from "@/app/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Avatar({ poses }: { poses: any[] }) {
  const canvasRef = useRef(null);
  const [word, setWord] = useState<string>("");
  const [signing, setSigning] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    setSigning(true);
    let frameIndex = 0;

    const drawFrame = () => {
      if (frameIndex >= poses.length) {
        setSigning(false);
        return;
      }

      const landmark = poses[frameIndex];
      setWord(landmark.word);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (landmark.pose_landmarks) {
        const filteredPoseLandmarks = landmark.pose_landmarks.filter(
          (point: Point, index: number) =>
            ![17, 18, 19, 20, 21, 22].includes(index)
        );

        const filteredPoseConnections = POSE_CONNECTIONS.filter(
          (connection) =>
            ![17, 18, 19, 20, 21, 22].includes(connection[0]) &&
            ![17, 18, 19, 20, 21, 22].includes(connection[1])
        );

        drawConnectors(ctx, filteredPoseLandmarks, filteredPoseConnections, {
          color: "#00FF00",
          lineWidth: 2,
        });
      }

      if (landmark.face_landmarks) {
        landmark.face_landmarks.forEach((point: Point) => {
          point.visibility = 1;
        });

        drawConnectors(ctx, landmark.face_landmarks, FACEMESH_TESSELATION, {
          color: "#00FF00",
          lineWidth: 0.5,
        });
      }

      if (landmark.right_hand_landmarks) {
        landmark.right_hand_landmarks.forEach((point: Point) => {
          point.visibility = 1;
        });

        drawConnectors(ctx, landmark.right_hand_landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
      }

      if (landmark.left_hand_landmarks) {
        landmark.left_hand_landmarks.forEach((point: Point) => {
          point.visibility = 1;
        });

        drawConnectors(ctx, landmark.left_hand_landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
      }

      frameIndex++;
      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  }, [poses]);

  return (
    <div className="flex flex-col h-full flex-1 w-full items-center justify-between py-4 bg-neutral-900">
      <div className="flex flex-col gap-6 w-full items-center">
        <p className="text-4xl text-white font-bold">Sign Language</p>
        <div
          className={`h-[543.63px] relative border-8 w-full border-l-4 ${
            signing ? "border-[#00FF00]" : "border-neutral-200"
          }`}
        >
          <canvas ref={canvasRef} width="640" height="480"></canvas>
          <Word word={word} />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400">
          Avatar translates to ASL gloss and signs!
        </p>
      </div>
    </div>
  );
}

function Word({ word }: { word: string }) {
  return (
    <div className="text-[#FF0000] absolute bottom-4 text-2xl font-medium left-1/2 transform -translate-x-1/2">
      <p>{word}</p>
    </div>
  );
}
