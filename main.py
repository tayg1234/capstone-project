# main.py
import asyncio
import cv2
import torch
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# YOLOv5 관련 모듈 임포트 (detection_module.py 대신 여기서 직접 구성)
from models.common import DetectMultiBackend
from utils.general import (
    check_img_size,
    non_max_suppression,
    scale_boxes,
)
from utils.torch_utils import select_device

# 모델 초기화 (서버 시작 시 한 번만 로딩)
DEVICE = select_device("")  # 빈 문자열이면 자동 선택 (가능하다면 GPU)
WEIGHTS_PATH = "yolov5s.pt"  # 실제 모델 파일 경로 (필요시 수정)
IMG_SIZE = (640, 640)
model = DetectMultiBackend(WEIGHTS_PATH, device=DEVICE)
stride, names = model.stride, model.names
IMG_SIZE = check_img_size(IMG_SIZE, s=stride)

app = FastAPI()

# CORS 설정 (실제 프론트엔드 도메인으로 수정)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    """
    WebSocket 연결이 수립되면 카메라(기본 장치 0)에서 계속 프레임을 읽고,
    YOLOv5 모델로 객체 추론 후 해당 결과를 JSON 형태로 전송합니다.
    """
    await websocket.accept()
    
    # 카메라 캡처 열기 (여러 클라이언트가 동시에 접근하지 않도록 주의)
    cap = cv2.VideoCapture(0)  
    if not cap.isOpened():
        await websocket.close(code=1011)
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # (옵션) 프레임을 지정된 크기(640x640)로 리사이즈
            frame_resized = cv2.resize(frame, IMG_SIZE)

            # BGR → RGB 변환 후, YOLOv5 모델 입력에 맞게 텐서 변환
            img_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
            img_tensor = torch.from_numpy(img_rgb).to(DEVICE).float()
            img_tensor /= 255.0  # 0~255 범위를 0~1로 정규화

            # 텐서 차원 재배열: [H, W, C] → [1, C, H, W]
            img_tensor = img_tensor.permute(2, 0, 1).unsqueeze(0)

            # 추론 진행 (blocking call)
            with torch.no_grad():
                pred = model(img_tensor)
                pred = non_max_suppression(pred, conf_thres=0.25, iou_thres=0.45, max_det=1000)[0]

            detections = []
            if pred is not None and len(pred):
                # 프레임이 이미 IMG_SIZE로 리사이즈되어 있으므로, 원본 좌표 복원이 필요하다면 추가 작업이 필요합니다.
                for *xyxy, conf, cls in pred:
                    x1, y1, x2, y2 = map(int, xyxy)
                    detections.append({
                        "label": names[int(cls)],
                        "confidence": float(conf),
                        "bbox": [x1, y1, x2, y2],
                    })

            # WebSocket을 통해 탐지 결과 전송
            await websocket.send_json({"detections": detections})

            # 너무 빠른 전송을 방지하기 위해 약 0.1초 간격으로 전송
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print("클라이언트 연결 종료")
    except Exception as e:
        print("추론 중 오류 발생:", e)
    finally:
        cap.release()