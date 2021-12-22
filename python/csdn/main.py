from urllib import request
from urllib.parse import quote
from kivy.core.window import Window
import time
import re
from kivymd.uix import bottomsheet
from kivy.lang import Builder
from kivymd.app import MDApp
from kivymd.font_definitions import theme_font_styles
from kivy.core.text import LabelBase
from kivymd.uix.textfield import MDTextFieldRect
from kivymd.uix.card import MDCard
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivy.properties import StringProperty
from lxml import etree
Window.size = (Window.width, Window.height)
num = 0


class SpiderCsdn():
    num = 0
    url_lists = ['https://blog.csdn.net/phoenix/web/blog/hot-rank?page={{}}&pageSize=8',
                 'https://blog.csdn.net/phoenix/web/v1/home/information?page={{}}&pageSize=8',
                 'https://so.csdn.net/api/v3/search?q={{}}&t=blog&p=1&s=new&tm=0&lv=-1&ft=0&l=&u=&ct=-1&pnt=-1&ry=-1&ss=-1&dct=-1&vco=-1&cc=-1&sc=-1&akt=-1&art=-1&ca=-1&prs=&pre=&ecc=-1&ebc=-1&urw=&ia=1&platform=pc',
                 'https://so.csdn.net/api/v3/search?q={{}}&t=blog&p=2&s=new&tm=0&lv=-1&ft=0&l=&u=&ct=-1&pnt=-1&ry=-1&ss=-1&dct=-1&vco=-1&cc=-1&sc=-1&akt=-1&art=-1&ca=-1&prs=&pre=&ecc=-1&ebc=-1&urw=&ia=1&platform=pc',
                 'https://so.csdn.net/api/v3/search?q={{}}&t=blog&p=1&s=0&tm=0&lv=-1&ft=0&l=&u=&ct=-1&pnt=-1&ry=-1&ss=-1&dct=-1&vco=-1&cc=-1&sc=-1&akt=-1&art=-1&ca=-1&prs=&pre=&ecc=-1&ebc=-1&urw=&ia=1&platform=pc',
                 'https://so.csdn.net/api/v3/search?q={{}}&t=blog&p=2&s=0&tm=0&lv=-1&ft=0&l=&u=&ct=-1&pnt=-1&ry=-1&ss=-1&dct=-1&vco=-1&cc=-1&sc=-1&akt=-1&art=-1&ca=-1&prs=&pre=&ecc=-1&ebc=-1&urw=&ia=1&platform=pc', ]

    def get_href_data(self, href_text):
        info_datas = []
        proxy = {'http': 'http://cWX1124901:cyq12345CYQ@proxy.huawei.com:8080',
                 'https': 'https://cWX1124901:cyq12345CYQ@proxy.huawei.com:8080'}
        header = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Language': 'zh-CN,zh;q=0.9',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
                  'Sec-Fetch-Dest': 'document',
                  'Sec-Fetch-Mode': 'navigate',
                  'Cache-Control': 'max-age=0',
                  'Connection': 'keep-alive',
                  'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
                  'Sec-Fetch-Mode': 'navigate'
                  }
        handler = request.ProxyHandler(proxy)
        opener = request.build_opener(handler)
        request.install_opener(opener)
        req = request.Request(href_text, headers=header)
        response = request.urlopen(req, timeout=5)

        html = response.read().decode('utf-8')
        html = html.replace('&#xff0c;', '，')
        html = html.replace('&#x1f496;', '💖')
        html = html.replace('&#x1f590;', '🖐')
        html = html.replace('&#x1f605;', '😅')
        html = html.replace('&#64;', '@')
        html = html.replace('&#x1f3d8;', '🏘')
        html = html.replace('&#xff01;', '！')
        html = html.replace('&#xff1f;', '？')
        html = html.replace('&#x1f4d6;', '📖')
        html = html.replace('&#xff1a;', '：')
        html = html.replace('&#39;', '\'')
        html = html.replace('&#61;', '=')
        html = html.replace(r'&lt;', '<')
        html = html.replace(r'&gt;', '>')
        html = html.replace('&#xff09;', '）')
        html = html.replace('&#xff08;', '（')
        html = html.replace('&#34;', '"')
        html = html.replace('&#x1f384;', '🎄')
        html = html.replace('&#x1f498;', '💘')
        html = html.replace('&#x1f332', '❤')
        html = html.replace('&#43;', '+')
        html = html.replace('&#x1f4e2;', '📢')
        html = html.replace('&#x1f4e3;;', '📣')
        return html

    def get_hot_data(self):
        hot_datas = []
        html = self.get_href_data(
            self.url_lists[0].replace('{{}}', str(self.num)))
        list_datas = re.findall('(\{\"hotRankScore\".*?\]\})', html)
        for list_data in list_datas:
            hot_data = re.findall(
                '"articleTitle":"(.*?)","articleDetailUrl":"(.*?)","commentCount":"(.*?)","favorCount":"(.*?)","viewCount":"(.*?)","hotComment".*?"picList":(.*?)\}', list_data)
            hot_datas.append(hot_data[0])
        return hot_datas

    def get_info_data(self):
        info_datas = []
        html = self.get_href_data(
            self.url_lists[1].replace('{{}}', str(self.num)))
        list_datas = re.findall(
            '(\{\"articleId\".*?"rtype":"blog_article"\})', html)
        for list_data in list_datas:
            info_data = re.findall('"title":"(.*?)","description":"(.*?)","url":"(.*?)","type":.*?,"top":.*?,"forcePlan":.*?,"viewCount":(.*?),"commentCount":(.*?),"editUrl":null,"postTime":.*?,"diggCount":(.*?),"formatTime":.*?,"username":".*?","nickname":"(.*?)","authorUrl":".*?","picList":(.*?),"tag"', list_data)
            info_datas.append(info_data[0])
        return info_datas

    def get_code_data(self, href_text):
        article_slices = []
        code_and_images = []
        html = self.get_href_data(href_text)
        article_text = re.findall(
            '<div id="content_views" class=".*?">([\s\S]*?)<div id="treeSkill"', html)[0]
        code_and_image_datas = re.findall(
            '<code>([\s\S]*?)</code>|<code class=.*?">([\s\S]*?)</code>|src="([\s\S]*?)"', article_text)
        for code_and_image_data in code_and_image_datas:
            for _ in code_and_image_data:
                if _ != '':

                    sess_codes = re.split('<[\s\S]*?>', _)
                    temp = ''
                    for sess_code in sess_codes:
                        temp += sess_code
                    code_and_images.append(temp)

        article_slice_datas = re.split(
            '<code>[\s\S]*?</code>|<code class=.*?">[\s\S]*?</code>|<img[\s\S]*?/>', article_text)
        for article_slice_data in article_slice_datas:
            datas = re.split('<[\s\S]*?>', article_slice_data)
            article_slice = ''
            for data in datas:
                article_slice += data
            article_slices.append(article_slice)
        article = ''
        for i in range(len(article_slices)-1):
            article += article_slices[i]
            article += code_and_images[i]
        article += article_slices[-1]

        return article

    def get_search_new_data(self, keyword):
        html1 = self.get_href_data(self.url_lists[2].replace('{{}}', keyword))
        # html2 = self.get_href_data(self.url_lists[3].replace('{{}}', keyword))
        html = html1
        all_datas = re.findall(
            '"digg":"([\s\S]*?)"[\s\S]*?"title":"([\s\S]*?)","view":"([\s\S]*?)"[\s\S]*?"nickname":"([\s\S]*?)","digest":"([\s\S]*?)"[\s\S]*?"url":"([\s\S]*?)"[\s\S]*?"create_time_str":"([\s\S]*?)"', html)
        return all_datas

    def get_search_all_data(self, keyword):
        html1 = self.get_href_data(self.url_lists[4].replace('{{}}', keyword))
        # html2 = self.get_href_data(self.url_lists[5].replace('{{}}', keyword))
        html = html1
        all_datas = re.findall(
            '"digg":"([\s\S]*?)"[\s\S]*?"title":"([\s\S]*?)","view":"([\s\S]*?)"[\s\S]*?"nickname":"([\s\S]*?)","digest":"([\s\S]*?)"[\s\S]*?"url":"([\s\S]*?)"[\s\S]*?"create_time_str":"([\s\S]*?)"', html)
        return all_datas

    def get_search_data(self, keyword):
        all_datas = self.get_search_all_data(keyword)
        new_datas = self.get_search_new_data(keyword)
        return [all_datas, new_datas]


class ArticleScreen(MDScreen):
    article_text = StringProperty()


class HotCard(MDCard):
    image = StringProperty()
    title_text = StringProperty()
    info_text = StringProperty()
    href_text = StringProperty()
    spidercsdn = SpiderCsdn()

    def on_press(self):
        article = self.spidercsdn.get_code_data(self.href_text)
        global num
        screen = ArticleScreen(name=f'screen{str(num)}')
        screen.text_data = article
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.add_widget(
            screen)
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.current = f'screen{str(num)}'
        num += 1


class InfoSearchCard(MDCard):
    title_text = StringProperty()
    info_text = StringProperty()
    href_text = StringProperty()
    des_text = StringProperty()
    spidercsdn = SpiderCsdn()

    def on_press(self):
        article = self.spidercsdn.get_code_data(self.href_text)
        global num
        screen = ArticleScreen(name=f'screen{str(num)}')
        screen.text_data = article
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.add_widget(
            screen)
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.current = f'screen{str(num)}'
        num += 1


class InfoCard(MDCard):
    image = StringProperty()
    title_text = StringProperty()
    info_text = StringProperty()
    href_text = StringProperty()
    des_text = StringProperty()
    spidercsdn = SpiderCsdn()

    def on_press(self):
        article = self.spidercsdn.get_code_data(self.href_text)
        global num
        screen = ArticleScreen(name=f'screen{str(num)}')
        screen.text_data = article
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.add_widget(
            screen)
        self.parent.parent.parent.parent.parent.parent.parent.parent.ids.screen_manager.current = f'screen{str(num)}'
        num += 1


class MainScreen(MDScreen):
    spider_datas = SpiderCsdn()

    def __init__(self, **kwargs):
        super(MainScreen, self).__init__(**kwargs)
        self.add_hot_data()
        self.add_info_data()

    def add_hot_data(self):
        hot_datas = self.spider_datas.get_hot_data()
        for hot_data in hot_datas:
            hot_card = HotCard()
            hot_card.title_text = hot_data[0]
            hot_card.href_text = hot_data[1]
            hot_card.info_text = hot_data[4] + '浏览·' + \
                hot_data[2] + '评论·' + hot_data[3]+'收藏'
            try:
                hot_card.image = hot_data[5].split('"')[1]
            except:
                hot_card.image = 'https://csdnimg.cn/cdn/content-toolbar/csdn-logo.png?v=20200416.1'
            self.ids.hot_class.add_widget(hot_card)

    def add_info_data(self):
        info_datas = self.spider_datas.get_info_data()
        for info_data in info_datas:
            info_card = InfoCard()
            info_card.title_text = info_data[0]
            info_card.des_text = info_data[1].split('\\n')[0]
            info_card.href_text = info_data[2]
            info_card.info_text = '👍' + \
                info_data[3]+'赞 · 👎'+info_data[4]+"踩  " + \
                info_data[5]+'浏览 ·作者:'+info_data[6]
            try:
                info_card.image = info_data[-1].split('"')[1]
            except:
                info_card.image = 'https://csdnimg.cn/cdn/content-toolbar/csdn-logo.png?v=20200416.1'
            self.ids.info_class.add_widget(info_card)

    def on_release(self):
        self.ids.screen_manager.current = 'tab_screen'

    def on_press(self):
        search_key = self.ids.search_key.text
        all_and_new_datas = self.spider_datas.get_search_data(
            quote(search_key))
        global num
        screen = SearchScreen(name=f'screen{str(num)}')
        screen.search_key = search_key
        screen.all_and_new_datas = all_and_new_datas
        screen.add_all_search_data()
        screen.add_new_search_data()
        self.ids.screen_manager.add_widget(screen)
        self.ids.screen_manager.current = f'screen{str(num)}'
        num += 1


class SearchScreen(MDScreen):
    search_key = StringProperty()
    all_and_new_datas = []

    def add_all_search_data(self):
        for all_data in self.all_and_new_datas[0]:
            all_data_card = InfoSearchCard()
            title_text = all_data[1].replace('<em>', '')
            title_text = title_text.replace('</em>', '')
            all_data_card.title_text = title_text
            des_text = all_data[4].replace('<em>', '')
            des_text = des_text.replace('</em>', '')
            all_data_card.des_text = des_text
            all_data_card.href_text = all_data[5]
            all_data_card.info_text = '👍' + all_data[0] + '赞 ·' +\
                all_data[2] + "浏览·作者" + all_data[3]+"·发表日期："+all_data[6]
            self.ids.all_search.add_widget(all_data_card)

    def add_new_search_data(self):
        for all_data in self.all_and_new_datas[1]:
            all_data_card = InfoSearchCard()
            title_text = all_data[1].replace('<em>', '')
            title_text = title_text.replace('</em>', '')
            all_data_card.title_text = title_text
            des_text = all_data[4].replace('<em>', '')
            des_text = des_text.replace('</em>', '')
            all_data_card.des_text = des_text
            all_data_card.href_text = all_data[5]
            all_data_card.info_text = '👍' + all_data[0] + '赞 ·' +\
                all_data[2] + "浏览·作者" + all_data[3]+"·发表日期："+all_data[6]
            self.ids.new_search.add_widget(all_data_card)


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
