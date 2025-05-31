# main.py
import cv2
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# YOLOv5 관련 모듈 임포트
from models.common import DetectMultiBackend
from utils.general import check_img_size, non_max_suppression
from utils.torch_utils import select_device

# 모델 초기화 (서버 시작 시 한 번만 로딩)
DEVICE = select_device("")
WEIGHTS_PATH = "yolov5s.pt"  # 필요에 따라 yolov5m/yolov5l 사용 고려
IMG_SIZE = (640, 640)
model = DetectMultiBackend(WEIGHTS_PATH, device=DEVICE)
stride, names = model.stride, model.names
IMG_SIZE = check_img_size(IMG_SIZE, s=stride)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요한 도메인으로 조정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "FastAPI 서버가 정상 작동 중입니다."}

@app.get("/api/restaurants/${restaurantId}/seats")
async def get_detection_data():
    # 카메라에서 한 프레임 캡처
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return JSONResponse(
            status_code=500, content={"error": "카메라를 열 수 없습니다."}
        )
    
    ret, frame = cap.read()
    if not ret:
        cap.release()
        return JSONResponse(
            status_code=500, content={"error": "프레임 캡처 실패"}
        )
    cap.release()

    # 모델 입력 크기 (640×640)로 리사이즈
    frame_resized = cv2.resize(frame, IMG_SIZE)
    
    # BGR → RGB 변환 및 텐서 변환
    img_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
    img_tensor = torch.from_numpy(img_rgb).to(DEVICE).float() / 255.0
    img_tensor = img_tensor.permute(2, 0, 1).unsqueeze(0)
    
    # YOLOv5 추론 (conf_thres 낮추어 결과를 더 많이 출력)
    with torch.no_grad():
        pred = model(img_tensor)
        pred = non_max_suppression(pred, conf_thres=0.15, iou_thres=0.45, max_det=1000)[0]
    
    chair_detections = []  # label "chair"인 결과만 담음
    person_detections = []  # 사람 탐지 결과

    if pred is not None and len(pred):
        for *xyxy, conf, cls in pred:
            x1, y1, x2, y2 = map(int, xyxy)
            label = names[int(cls)].lower()
            # 디버깅: 탐지된 모든 객체의 정보를 출력
            print(f"Detected: {label} with conf {conf:.2f} at {(x1, y1, x2, y2)}")
            if label == "chair":
                chair_detections.append({"box": (x1, y1, x2, y2), "conf": float(conf)})
                cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame_resized, f"chair {conf:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            elif label == "person":
                person_detections.append({"box": (x1, y1, x2, y2), "conf": float(conf)})
                cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame_resized, f"person {conf:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # 각 chair에 대해, 사람이 앉아 있는지 (확장된 영역 내에 사람의 중심 좌표가 포함되는지) 확인
    seats = []
    seat_id_counter = 0
    for chair in chair_detections:
        x1, y1, x2, y2 = chair["box"]
        # 확장 margin: 원래 박스 크기의 10% (필요에 따라 조정)
        margin_x = int(0.1 * (x2 - x1))
        margin_y = int(0.1 * (y2 - y1))
        expanded_x1 = x1 - margin_x
        expanded_y1 = y1 - margin_y
        expanded_x2 = x2 + margin_x
        expanded_y2 = y2 + margin_y

        occupied = False
        for person in person_detections:
            px1, py1, px2, py2 = person["box"]
            p_center_x = (px1 + px2) // 2
            p_center_y = (py1 + py2) // 2
            # 확장된 chair 영역 내에 사람의 중심이 있으면 chair를 occupied 처리
            if expanded_x1 <= p_center_x <= expanded_x2 and expanded_y1 <= p_center_y <= expanded_y2:
                occupied = True
                break
        
        # chair의 중심 좌표 (픽셀 단위)
        center_x = (x1 + x2) / 2.0
        center_y = (y1 + y2) / 2.0
        # 상대 좌표 (0 ~ 1, 이미지 크기 640×640으로 정규화)
        relative_col = center_x / IMG_SIZE[0]
        relative_row = center_y / IMG_SIZE[1]

        seat = {
            "id": seat_id_counter + 1,
            "row": round(relative_row, 3),  # 예: 0.532
            "col": round(relative_col, 3),  # 예: 0.312
            "status": "occupied" if occupied else "available"
        }
        seats.append(seat)
        seat_id_counter += 1
        
        status_text = "occupied" if occupied else "available"
        cv2.putText(frame_resized, status_text, (x1, y2 + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255) if occupied else (255, 255, 0), 2)
    
    if not chair_detections:
        cv2.putText(frame_resized, "No chair detected", (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    # 디버깅용: 처리된 영상 출력 (창은 수동 종료 필요)
    cv2.imshow("Detection Debug", frame_resized)
    cv2.waitKey(1)
    
    return {"seats": seats}
