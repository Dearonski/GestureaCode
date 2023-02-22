import cv2
import numpy as np
from PyQt6.QtWidgets import *
from PyQt6.QtGui import *
from PyQt6.QtCore import *
from PyQt6.QtMultimediaWidgets import *
from PyQt6.QtMultimedia import *
from recongition_classes.HandDetection import HandDetector
from recongition_classes.RecognitionGesture import RecognitionGesture


class VideoThread(QThread):
    change_pixmap_signal = pyqtSignal(np.ndarray)

    def __init__(self):
        super().__init__()
        self._run_flag = True
        self.video_capture = 0
        self.gesture_list = [True, True, True, True, True, True, True]

    def run(self):
        self._run_flag = True
        self.cap = cv2.VideoCapture(self.video_capture)
        rec_gesture = RecognitionGesture(HandDetector(max_hands=1))
        while self._run_flag:
            ret, img = self.cap.read()
            rec_gesture.run_recognition(img, self.gesture_list)
            if ret:
                self.change_pixmap_signal.emit(cv2.flip(img, 1))
        self.cap.release()

    def stop(self):
        self._run_flag = False

    def set_gesture_work(self, gesture_idnx, val):
        self.gesture_list[gesture_idnx] = val
