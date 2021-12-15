from kivy.core.window import Window
import requests
import re
from kivymd.uix import bottomsheet
from kivy.lang import Builder
from kivymd.app import MDApp
from kivymd.font_definitions import theme_font_styles
from kivy.core.text import LabelBase
from kivymd.uix.card import MDCard
from kivymd.uix.screen import MDScreen
from kivy.properties import StringProperty
Window.size = (Window.width, Window.height)


class SpiderCsdn():
    url_lists = ['https://blog.csdn.net/phoenix/web/blog/hot-rank?page={{}}&pageSize=25',
                 'https://blog.csdn.net/phoenix/web/v1/home/information?page={{}}&pageSize=25']

    header = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'zh-CN,zh;q=0.9',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Connection': 'keep-alive',
              }

    def get_hot_data(url_lists, page):
        hot_datas = []
        response = requests.get(url_lists[0].replace(
            '{{}}', page), timeout=10, headers=header, verify=False)
        html = response.content.decode('utf-8')
        list_datas = re.findall('(\{\"hotRankScore\".*?\]\})', html)
        for list_data in list_datas:
            hot_data = re.findall(
                '"articleTitle":"(.*?)","articleDetailUrl":"(.*?)","commentCount":"(.*?)","favorCount":"(.*?)","viewCount":"(.*?)","hotComment".*?"picList":(.*?)\}', list_data)
            hot_datas.append(hot_data[0])
        return hot_datas

    def get_info_data(url_lists, page):
        info_datas = []
        response = requests.get(url_lists[1].replace(
            '{{}}', page), timeout=10, headers=header, verify=False)
        html = response.content.decode('utf-8')
        list_datas = re.findall(
            '(\{\"articleId\".*?"rtype":"blog_article"\})', html)
        for list_data in list_datas:
            info_data = re.findall('"title":"(.*?)","url":"(.*?)","type":0,"top":.*?,"forcePlan":.*?,"viewCount":(.*?),"commentCount":(.*?),"editUrl":null,"postTime":.*?,"diggCount":(.*?),"formatTime":.*?,"username":".*?","nickname":"(.*?)","authorUrl":".*?","picList":(.*?),"tag"', list_data)
            info_datas.append(info_data[0])
        return info_datas


class HotCard(MDCard):
    img = StringProperty()


class InforCard(MDCard):
    img = StringProperty()


class MainScreen(MDScreen):
    pass


class MainApp(MDApp):
    def build(self):

        self.theme_cls.theme_style = 'Light'
        self.theme_cls.primary_palette = 'Gray'
        LabelBase.register(name='./Lishu.ttf', fn_regular='Lishu.ttf')
        theme_font_styles.append('Lishu')
        self.theme_cls.font_styles['Lishu'] = ['Lishu', 16, False, 0.15]
        return MainScreen()


if __name__ == '__main__':

    MainApp().run()
