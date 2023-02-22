from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtMultimedia import *
import sys


class TitleBar(QWidget):

    def __init__(self, parent):
        super().__init__()
        self.parent = parent
        self.layout = QHBoxLayout()
        self.setStyleSheet('''border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        font: "Fira Sans";''')
        self.layout.setContentsMargins(0, 0, 0, 0)
        self.layout.setSpacing(0)
        self.layout.addStretch(-1)
        self.white_theme_main_color = '#DDDDDD'
        self.black_theme_main_color = '#3C3C3C'
        self.bar_height = 29
        self.button_width = 44

        self.logo = QLabel()
        self.pixmap = QPixmap("./images/logo.png")
        self.pixmap = self.pixmap.scaledToWidth(21)
        self.pixmap = self.pixmap.scaledToHeight(21)
        self.logo.setPixmap(self.pixmap)

        self.camera_selector = QComboBox()
        self.available_cameras = QMediaDevices.videoInputs()
        self.camera_selector.addItems([camera.description()
                                       for camera in self.available_cameras])
        self.camera_selector.setFixedHeight(self.bar_height)
        self.camera_selector.setFixedWidth(150)

        self.theme_selector = QComboBox()
        self.theme_selector.addItems(['Светлая тема', 'Темная тема'])
        self.theme_selector.setFixedHeight(self.bar_height)
        self.theme_selector.setFixedWidth(110)
        self.theme_selector.currentIndexChanged.connect(self.select_theme)

        self.title = QLabel("Gesturea")
        self.title.setFixedHeight(self.bar_height)

        self.btn_min = QPushButton("–")
        self.btn_min.setFixedSize(self.button_width, self.bar_height)
        self.btn_min.clicked.connect(self.btn_min_clicked)

        self.btn_close = QPushButton("×")
        self.btn_close.setFixedSize(self.button_width, self.bar_height)
        self.btn_close.clicked.connect(self.btn_close_clicked)

        self.layout.addWidget(self.logo)
        self.layout.addWidget(self.camera_selector)
        self.layout.addWidget(self.theme_selector)
        self.layout.addWidget(self.title)
        self.layout.addWidget(self.btn_min)
        self.layout.addWidget(self.btn_close)

        self.setLayout(self.layout)

        self.start = QPoint(0, 0)
        self.pressing = False
        self.set_theme(False)

    def select_theme(self, index):
        self.set_theme(bool(index))
        self.parent.set_theme(bool(index))

    def resizeEvent(self, QResizeEvent):
        super(TitleBar, self).resizeEvent(QResizeEvent)
        self.title.setFixedWidth(self.parent.width() - 377)

    def set_theme(self, theme):
        if theme:
            self.logo.setStyleSheet('''background-color: {};
            border-radius: 0px;
            border-top-left-radius: 10px;
            padding-right: 10px;
            padding-left: 5px;'''.format(self.black_theme_main_color))

            self.title.setStyleSheet('''
            background-color: {};
            color: #CCCCCC;
            border-radius: 0px;
            font-size: 16px;
            padding-left: 5px;'''.format(self.black_theme_main_color))

            self.setStyleSheet('''QComboBox {
            background-color: #3C3C3C;
            border-radius: 0px;
            font-size: 14px;
            color: #CCCCCC;}
            QComboBox::drop-down {border: 0px;}
            QComboBox::down-arrow {image: url(./images/white_arrow.png);
            height: 20px;
            width: 20px;}
            QComboBox:hover{background: #3F4040;}
            ''')

            self.btn_min.setStyleSheet('''QPushButton {color: #CCCCCC;
            background-color: #3C3C3C;
            border-radius: 0px;}
            QPushButton:hover {background-color: #565656;}
            QPushButton:pressed {background-color: #6F6F6F;}''')

            self.btn_close.setStyleSheet('''QPushButton {color: #CCCCCC;
            background-color: #3C3C3C;
            border-radius: 0px;
            border-top-right-radius: 10px;
            font-size: 30px;}
            QPushButton:hover {color: #FFFFFF;
            background-color: #E81123;}
            QPushButton:pressed {background-color: #901426;}''')
        else:
            self.logo.setStyleSheet('''background-color: {};
            border-radius: 0px;
            border-top-left-radius: 10px;
            padding-right: 5px;
            padding-left: 5px;'''.format(self.white_theme_main_color))

            self.title.setStyleSheet('''
            background-color: {};
            color: black;
            border-radius: 0px;
            font-size: 16px;
            padding-left: 5px;'''.format(self.white_theme_main_color))

            self.setStyleSheet('''QComboBox {
            background-color: #DDDDDD;
            border-radius: 0px;
            font-size: 14px;}
            QComboBox::drop-down {border: 0px;}
            QComboBox::down-arrow {image: url(./images/black_arrow.png);
            height: 20px;
            width: 20px;}
            QComboBox:hover{background:#D2D2D2;}''')

            self.btn_min.setStyleSheet('''QPushButton {color: #333333;
            background-color: #DDDDDD;
            border-radius: 0px;}
            QPushButton:hover {background-color: #C0C0C0;}
            QPushButton:pressed {background-color: #A4A4A4;}''')

            self.btn_close.setStyleSheet('''QPushButton {color: #333333;
            background-color: #DDDDDD;
            border-radius: 0px;
            border-top-right-radius: 10px;
            font-size: 30px;}
            QPushButton:hover {color: #FFFFFF;
            background-color: #E81123;}
            QPushButton:pressed {background-color: #E3636D;}''')

    def mousePressEvent(self, event):
        self.start = self.mapToGlobal(event.pos())
        self.pressing = True

    def mouseMoveEvent(self, event):
        if self.pressing:
            self.end = self.mapToGlobal(event.pos())
            self.movement = self.end-self.start
            self.parent.setGeometry(self.mapToGlobal(self.movement).x(),
                                    self.mapToGlobal(self.movement).y(),
                                    self.parent.width(),
                                    self.parent.height())
            self.start = self.end

    def mouseReleaseEvent(self, QMouseEvent):
        self.pressing = False

    def btn_close_clicked(self):
        self.parent.close()

    def btn_min_clicked(self):
        self.parent.showMinimized()
