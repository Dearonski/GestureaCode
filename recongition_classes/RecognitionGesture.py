import time
import numpy as np
import cv2
from PIL import Image
import torch
from torchvision import transforms
import keyboard
import pyperclip as pc
import pyautogui as pg
from pynput.keyboard import Key, Controller


class RecognitionGesture:
    def __init__(self, detector):
        self.detector = detector
        self.width = pg.size().width
        self.height = pg.size().height
        self.lmb_click = 0
        self.rmb_click = 0
        self.keyboard = Controller()
        self.previous_volume = 100
        self.timer = 0
        self.tracking_forefinger = True
        self.coords_forefinger = []
        self.class_names_rus = ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к', 'л', 'м', 'н',
                                'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ы', 'ь', 'э', 'ю', 'я']

    @staticmethod
    def paste(text: str):
        buffer = pc.paste()
        pc.copy(text)
        keyboard.press_and_release('ctrl + v')
        time.sleep(0.1)
        pc.copy(buffer)

    def run_recognition(self, img, gestures_list):
        img = self.detector.find_hands(img)
        lm_list = self.detector.find_position(img)
        h, w = img.shape[:2]
        if len(lm_list) != 0:
            self.volume = lm_list[9][2]
            if gestures_list[6]:

                # draw symbol on screen
                if self.tracking_forefinger:
                    for i in self.coords_forefinger:
                        cv2.circle(img, (i[0], i[1]), 7,
                                   (255, 0, 255), cv2.FILLED)

                # tracking forefinger
                if self.detector.fingers_up()[1:] == [1, 0, 0, 0] and self.tracking_forefinger:
                    forefinger = lm_list[8][1:]
                    cv2.circle(
                        img, (forefinger[0], forefinger[1]), 7, (255, 0, 255), cv2.FILLED)
                    self.coords_forefinger.append(forefinger)

                # input symbol
                if self.detector.fingers_up()[1:] == [1, 1, 1, 1]:
                    if self.coords_forefinger:
                        self.tracking_forefinger = not self.tracking_forefinger
                        img_letter = np.zeros((480, 640, 3), np.uint8)
                        for i in self.coords_forefinger:
                            cv2.circle(
                                img_letter, (i[0], i[1]), 7, (255, 0, 255), cv2.FILLED)
                        img_letter = cv2.flip(img_letter, 1)
                        self.coords_forefinger = []
                        img_transforms = transforms.Compose([
                            transforms.Resize(244),
                            transforms.CenterCrop(244),
                            transforms.ToTensor(),
                        ])
                        img_transformed = img_transforms(
                            Image.fromarray(img_letter))
                        img_transformed = img_transformed.to(
                            torch.device('cpu'))
                        model = torch.load(
                            r'neural_network.pth', map_location=torch.device('cpu'))
                        model.eval()
                        img_transformed = torch.stack(
                            [img_transformed, img_transformed, img_transformed, img_transformed])
                        res = self.class_names_rus[torch.argmax(
                            model(img_transformed))]
                        self.paste(res)
                    else:
                        self.tracking_forefinger = True

            # mouse move
            if self.detector.fingers_up()[1:] == [1, 1, 0, 0] and gestures_list[0]:
                pos = self.detector.find_position(img)[8]
                pg.moveTo(
                    self.width - pos[1] * self.width / w * 1.5, pos[2] * self.height / h * 1.5)

            # left click
            if self.detector.fingers_up()[1:] == [1, 1, 0, 0] and self.detector.find_distance(4, 6) < 10 and gestures_list[1]:
                if self.lmb_click == 0 or time.time() - self.lmb_click > 1:
                    pg.click()
                    self.lmb_click = time.time()
                elif time.time() - self.lmb_click > 2:
                    self.lmb_click = 0

            # right click
            if self.detector.fingers_up()[1:] == [1, 1, 0, 0] and self.detector.find_distance(4, 10) < 10 and gestures_list[2]:
                if self.rmb_click == 0 or time.time() - self.rmb_click > 1:
                    pg.click(button='right')
                    self.rmb_click = time.time()
                elif time.time() - self.rmb_click > 2:
                    self.rmb_click = 0

            # volume change
            elif self.detector.fingers_up() == [1, 1, 1, 1, 1] and self.detector.find_distance(15, 20) > 45 and self.detector.find_distance(4, 5) > 85 and self.detector.find_distance(8, 16) < 40 and gestures_list[3]:
                if self.volume < self.previous_volume:
                    self.keyboard.press(Key.media_volume_up)
                    self.keyboard.release(Key.media_volume_up)
                elif self.volume > self.previous_volume:
                    self.keyboard.press(Key.media_volume_down)
                    self.keyboard.release(Key.media_volume_down)
                self.previous_volume = self.volume

            # next track
            elif self.detector.fingers_up()[1:] == [1, 1, 1, 1] and self.detector.find_distance(4, 12) < 15 and gestures_list[4]:
                if self.timer == 0 or time.time() - self.timer > 1:
                    self.keyboard.press(Key.media_next)
                    self.keyboard.release(Key.media_next)
                    self.timer = time.time()
                elif time.time() - self.timer > 2:
                    self.timer = 0

            # previous track
            elif self.detector.fingers_up()[1:] == [1, 1, 1, 1] and self.detector.find_distance(4, 16) < 15 and gestures_list[4]:
                if self.timer == 0 or time.time() - self.timer > 1:
                    self.keyboard.press(Key.media_previous)
                    self.keyboard.release(Key.media_previous)
                    self.timer = time.time()
                elif time.time() - self.timer > 2:
                    self.timer = 0

            # play/pause
            elif self.detector.fingers_up()[1:] == [1, 1, 1, 1] and self.detector.find_distance(4, 20) < 15 and gestures_list[5]:
                if self.timer == 0 or time.time() - self.timer > 1:
                    self.keyboard.press(Key.media_play_pause)
                    self.keyboard.release(Key.media_play_pause)
                    self.timer = time.time()
                elif time.time() - self.timer > 2:
                    self.timer = 0
