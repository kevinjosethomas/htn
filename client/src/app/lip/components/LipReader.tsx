"use client";

import React, { useEffect, useState, useRef } from "react";

export default function VideoRecorder({
  transcript,
  fetchTranscript,
}: {
  transcript: string;
  fetchTranscript: (blob: Blob) => void;
}) {
  const [recording, setRecording] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam.", err);
      }
    };

    initWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/mp4",
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      chunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/mp4" });
      chunks.current = [];

      if (!blob) return;
      fetchTranscript(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 w-full items-center justify-start bg-neutral-900">
      <div className="flex flex-col w-full">
        <video autoPlay playsInline ref={videoRef} style={{ width: "100%" }} />
      </div>
      <div>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      <div>{transcript}</div>
    </div>
  );
}
