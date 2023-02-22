import sys
import cv2
import numpy as np
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtMultimedia import *
from gui.VideoThread import VideoThread
from gui.ToggleButton import ToggleButton
from gui.TitleBar import TitleBar


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setFixedSize(1100, 620)

        self.thread = VideoThread()

        self.main_widget = QWidget()

        self.main_widget.setStyleSheet(
            '''QWidget {background-color: white;
                font: "Fira Sans"; font-size: 25px;
                border-radius: 10px;}''')

        self.main_box = QVBoxLayout()

        self.widgets_box = QHBoxLayout()

        self.gesture_list = QVBoxLayout()

        self.gest_1_box = QHBoxLayout()
        self.gest_1 = ToggleButton()
        self.gest_1_box.addWidget(self.gest_1)
        self.gest_1_box.addWidget(QLabel('Перемещение курсора'))

        self.gest_2_box = QHBoxLayout()
        self.gest_2 = ToggleButton()
        self.gest_2_box.addWidget(self.gest_2)
        self.gest_2_box.addWidget(QLabel('ЛКМ клик'))

        self.gest_3_box = QHBoxLayout()
        self.gest_3 = ToggleButton()
        self.gest_3_box.addWidget(self.gest_3)
        self.gest_3_box.addWidget(QLabel('ПКМ клик'))

        self.gest_4_box = QHBoxLayout()
        self.gest_4 = ToggleButton()
        self.gest_4_box.addWidget(self.gest_4)
        self.gest_4_box.addWidget(QLabel('Изменение громкости'))

        self.gest_5_box = QHBoxLayout()
        self.gest_5 = ToggleButton()
        self.gest_5_box.addWidget(self.gest_5)
        self.gest_5_box.addWidget(QLabel('Перелистывание треков'))

        self.gest_6_box = QHBoxLayout()
        self.gest_6 = ToggleButton()
        self.gest_6_box.addWidget(self.gest_6)
        self.gest_6_box.addWidget(QLabel('Пауза/Возпроизвести'))

        self.gest_7_box = QHBoxLayout()
        self.gest_7 = ToggleButton()
        self.gest_7_box.addWidget(self.gest_7)
        self.gest_7_box.addWidget(QLabel('Режим клавиатуры'))

        self.gest_1.setChecked(True)
        self.gest_2.setChecked(True)
        self.gest_3.setChecked(True)
        self.gest_4.setChecked(True)
        self.gest_5.setChecked(True)
        self.gest_6.setChecked(True)
        self.gest_7.setChecked(True)

        self.gest_1.stateChanged.connect(self.gest_1_state_changed)
        self.gest_2.stateChanged.connect(self.gest_2_state_changed)
        self.gest_3.stateChanged.connect(self.gest_3_state_changed)
        self.gest_4.stateChanged.connect(self.gest_4_state_changed)
        self.gest_5.stateChanged.connect(self.gest_5_state_changed)
        self.gest_6.stateChanged.connect(self.gest_6_state_changed)
        self.gest_7.stateChanged.connect(self.gest_7_state_changed)

        self.gesture_list.addLayout(self.gest_1_box)
        self.gesture_list.addLayout(self.gest_2_box)
        self.gesture_list.addLayout(self.gest_3_box)
        self.gesture_list.addLayout(self.gest_4_box)
        self.gesture_list.addLayout(self.gest_5_box)
        self.gesture_list.addLayout(self.gest_6_box)
        self.gesture_list.addLayout(self.gest_7_box)

        self.camera_box = QVBoxLayout()
        self.ss_video = QPushButton(self)

        self.ss_video.setText('Включить камеру')
        self.ss_video.clicked.connect(self.ClickStartVideo)

        self.image_label = QLabel()
        self.image_label.setStyleSheet('''border: 2px solid #007BCD;
        border-radius: 0px;''')

        self.image_label.setFixedSize(640, 480)

        self.camera_box.addWidget(self.image_label)
        self.camera_box.addWidget(self.ss_video)

        self.widgets_box.addLayout(self.camera_box)
        self.widgets_box.addLayout(self.gesture_list)
        self.widgets_box.setContentsMargins(20, 20, 20, 20)
        self.widgets_box.setSpacing(20)

        self.title_bar = TitleBar(self)
        self.main_box.addWidget(self.title_bar)
        self.main_box.addLayout(self.widgets_box)
        self.main_box.setContentsMargins(0, 0, 0, 0)
        self.main_box.addStretch(-1)

        self.main_widget.setLayout(self.main_box)

        self.setCentralWidget(self.main_widget)

        self.set_theme(False)

    def gest_1_state_changed(self):
        self.thread.set_gesture_work(0, not self.thread.gesture_list[0])

    def gest_2_state_changed(self):
        self.thread.set_gesture_work(1, not self.thread.gesture_list[1])

    def gest_3_state_changed(self):
        self.thread.set_gesture_work(2, not self.thread.gesture_list[2])

    def gest_4_state_changed(self):
        self.thread.set_gesture_work(3, not self.thread.gesture_list[3])

    def gest_5_state_changed(self):
        self.thread.set_gesture_work(4, not self.thread.gesture_list[4])

    def gest_6_state_changed(self):
        self.thread.set_gesture_work(5, not self.thread.gesture_list[5])

    def gest_7_state_changed(self):
        self.thread.set_gesture_work(5, not self.thread.gesture_list[6])

    def set_theme(self, theme):
        if theme:
            self.main_widget.setStyleSheet(
                '''QWidget {background-color: #1E1E1E;
                font: "Fira Sans"; font-size: 25px;
                border-radius: 10px;
                color: white;}''')
        else:
            self.main_widget.setStyleSheet(
                '''QWidget {background-color: #F3F3F3;
                font: "Fira Sans"; font-size: 25px;
                border-radius: 10px;}''')

        self.title_bar.set_theme(theme)
        self.ss_video.setStyleSheet(
            '''QPushButton {
            height: 40px;
            background-color: #007ACC;
            color: white;
            border-radius: 10px;}
            QPushButton:hover {background-color: #0062A3;}''')
        self.image_label.setStyleSheet('''border: 2px solid #007ACC;
            border-radius: 0px;''')

    def ClickStartVideo(self):
        self.ss_video.clicked.disconnect(self.ClickStartVideo)
        self.ss_video.setText('Выключить камеру')
        self.thread = VideoThread()
        self.thread.change_pixmap_signal.connect(self.update_image)

        self.thread.start()
        self.ss_video.clicked.connect(self.thread.stop)
        self.ss_video.clicked.connect(self.ClickStopVideo)

    def ClickStopVideo(self):
        self.thread.change_pixmap_signal.disconnect()
        self.ss_video.setText('Включить камеру')
        self.ss_video.clicked.disconnect(self.ClickStopVideo)
        self.ss_video.clicked.disconnect(self.thread.stop)
        self.ss_video.clicked.connect(self.ClickStartVideo)

    def update_image(self, cv_img):
        qt_img = self.convert_cv_qt(cv_img)
        self.image_label.setPixmap(qt_img)

    def convert_cv_qt(self, cv_img):
        rgb_image = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
        h, w, ch = rgb_image.shape
        bytes_per_line = ch * w
        convert_to_Qt_format = QImage(
            rgb_image.data, w, h, bytes_per_line, QImage.Format.Format_RGB888)
        p = convert_to_Qt_format.scaled(
            640, 480, Qt.AspectRatioMode.KeepAspectRatio)
        return QPixmap.fromImage(p)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    w = MainWindow()
    w.show()
    app.exec()
