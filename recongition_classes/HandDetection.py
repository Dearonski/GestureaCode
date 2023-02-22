import cv2
import mediapipe as mp
import math
import numpy as np
from typing import List


class HandDetector:
    def __init__(self,  mode: bool = False, max_hands: int = 1, model_complexity: int = 1, detection_con: int = 0.5, track_con: int = 0.5) -> None:
        self.mode = mode
        self.max_hands = max_hands
        self.model_complexity = model_complexity
        self.detection_con = detection_con
        self.track_con = track_con

        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            self.mode, self.max_hands, self.model_complexity, self.detection_con, self.track_con)
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_draw_styles = mp.solutions.drawing_styles
        self.tip_ids = [4, 8, 12, 16, 20]

        # draw the hand on the image
    def find_hands(self, img: np.ndarray, draw: bool = True) -> None:
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)

        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    style_lmd = self.mp_draw_styles.get_default_hand_landmarks_style()
                    style_con = self.mp_draw_styles.get_default_hand_connections_style()

                    self.mp_draw.draw_landmarks(
                        img, handLms, self.mp_hands.HAND_CONNECTIONS, style_lmd, style_con)
        return img

    # find landmarks
    def find_position(self, img: np.ndarray, handNo: int = 0) -> List[int]:
        xList = []
        yList = []
        self.lm_list = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id, lm in enumerate(myHand.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x*w), int(lm.y*h)
                xList.append(cx)
                yList.append(cy)
                self.lm_list.append([id, cx, cy])
        return self.lm_list

    # find the distance between two points
    def find_distance(self, p1: int, p2: int) -> float:
        x1, y1 = self.lm_list[p1][1], self.lm_list[p1][2]
        x2, y2 = self.lm_list[p2][1], self.lm_list[p2][2]
        cx, cy = (x1+x2)//2, (y1+y2)//2

        length = math.hypot(x2-x1, y2-y1)
        return length

    # check if the fingers are up
    def fingers_up(self) -> List[int]:
        fingers = []

        # Thumb
        if self.find_distance(3, 9) > 30:
            fingers.append(1)
        else:
            fingers.append(0)

        # 4 Fingers
        for id in range(1, 5):
            if self.lm_list[self.tip_ids[id]][2] < self.lm_list[self.tip_ids[id]-3][2]:
                fingers.append(1)
            else:
                fingers.append(0)
        return fingers
