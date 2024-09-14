import {
  Holistic,
  FACEMESH_TESSELATION,
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import React, { useRef, useEffect } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results) => {
      console.log(results);
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF3030",
            lineWidth: 2,
          });
        }
      }

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }

      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });

        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, results.faceLandmarks, {
          color: "#FF3030",
          lineWidth: 2,
        });

        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "#CC0000",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawConnectors(
          canvasCtx,
          results.rightHandLandmarks,
          HAND_CONNECTIONS,
          { color: "#00CC00", lineWidth: 5 }
        );
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
        canvasCtx.restore();
      }

      canvasCtx.restore();
    };

    holistic.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width="1280" height="720"></canvas>
    </div>
  );
}
