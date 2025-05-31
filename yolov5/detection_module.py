# detection_module.py
import os
from pathlib import Path
import torch
from models.common import DetectMultiBackend
from utils.dataloaders import LoadImages
from utils.general import check_img_size, non_max_suppression, scale_boxes
from utils.torch_utils import select_device

# 모델 설정: 서버 시작 시 단 한 번 로딩하여 전역으로 재사용
DEVICE = select_device("")  # 빈 문자열이면 최적의 디바이스 선택 (GPU 우선)
WEIGHTS_PATH = Path("yolov5s.pt")  # 실제 모델 파일 경로 (필요시 변경)
IMG_SIZE = (640, 640)  # 추론 시 사용할 입력 이미지 크기

# 모델 로딩 (DetectMultiBackend는 다양한 포맷을 지원합니다)
model = DetectMultiBackend(WEIGHTS_PATH, device=DEVICE)
stride, names = model.stride, model.names
IMG_SIZE = check_img_size(IMG_SIZE, s=stride)  # 모델에 맞게 이미지 크기 검증/보정

def detect_image(image_path: str, conf_thres: float = 0.25, 
                 iou_thres: float = 0.45, max_det: int = 1000) -> list:
    """
    주어진 이미지에 대해 YOLOv5 객체 탐지를 진행합니다.
    
    인자:
      image_path (str): 입력 이미지 파일 경로
      conf_thres (float): 신뢰도 임계값 (기본: 0.25)
      iou_thres (float): NMS IoU 임계값 (기본: 0.45)
      max_det (int): 이미지당 최대 탐지 수 (기본: 1000)

    반환:
      detections (list): 각 객체마다 {"label", "confidence", "bbox"} 형태의 딕셔너리 목록
    """
    # LoadImages는 letterbox 전처리 등 YOLOv5에 맞는 전처리를 수행합니다.
    dataset = LoadImages(image_path, img_size=IMG_SIZE, stride=stride)
    detections = []

    for path, im, im0, _, _ in dataset:
        # 이미지를 tensor로 변환 및 정규화 (0~1 사이 값)
        im_tensor = torch.from_numpy(im).to(DEVICE)
        im_tensor = im_tensor.float() / 255.0
        if im_tensor.ndimension() == 3:
            im_tensor = im_tensor.unsqueeze(0)

        # 추론 수행
        pred = model(im_tensor)
        # NMS 수행: 신뢰도와 IoU 임계값에 따라 후보 탐지들 중 중복 제거
        pred = non_max_suppression(pred, conf_thres, iou_thres, max_det=max_det)[0]

        if pred is not None and len(pred):
            # 원본 이미지 크기에 맞게 좌표 재조정
            pred[:, :4] = scale_boxes(im_tensor.shape[2:], pred[:, :4], im0.shape).round()
            for *xyxy, conf, cls in pred:
                x1, y1, x2, y2 = map(int, xyxy)
                detections.append({
                    "label": names[int(cls)],
                    "confidence": float(conf),
                    "bbox": [x1, y1, x2, y2]
                })
    return detections
