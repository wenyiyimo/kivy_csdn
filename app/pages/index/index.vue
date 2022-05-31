<template>
  <view class="index">
    <view class="header">
      <view class="header-top"></view>
      <view class="search-style">
        <!-- <uni-icons style="margin-top: 0px;margin-left: 15px;" color="#000000" size="40" type="compose" @click="showDrawer('showLeft')" /> -->
        <uni-icons
          class="icon-style"
          color="#000000"
          size="40"
          type="compose"
          @click="showset"
        />
        <uni-search-bar
          class="search-layout"
          v-model="search"
          placeholder="请输入搜索关键词"
          bgColor="#EEEEEE"
          cancelButton="none"
          @confirm="searchEvent"
          @clear="searchClearEvent"
          borderColor="#000000"
          style="width: 500rpx"
        ></uni-search-bar>
        <text class="first-text" @click="searchEvent">搜索</text>
      </view>
      <view class="setting" v-if="showsetting">
        <view
          class="setting-item"
          v-for="(item, index) in settings"
          :key="index"
        >
          <text class="first-text">{{ item }}</text>
        </view>
      </view>
    </view>
    <view class="body">
      <swiper
        style="height: 200rpx; margin-top: 10rpx"
        autoplay="true"
        circular="true"
        interval="3000"
        duration="1000"
        @change="changeCurrent"
      >
        <swiper-item v-for="(item, index) in lunbolist" :key="index">
          <view style="display: flex; flex-direction: column">
            <image
              style="height: 200rpx; width: 100%"
              :src="item.pic"
              mode="aspectFill"
              @click="click(index)"
            ></image>
            <text
              class="first-text"
              style="
                margin-top: -50rpx;
                z-index: 2;
                display: flex;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.3);
              "
            >
              {{ item.title }}
            </text>
          </view>
        </swiper-item>
      </swiper>
      <view
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 10rpx;
        "
      >
        <view
          style="
            height: 100rpx;
            width: 100rpx;
            border-radius: 50%;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          v-for="(item, index) in settings"
          :key="index"
        >
          <text class="first-text">{{ item }}</text>
        </view>
      </view>
      <view class="data-new">
        <view class="data-header">
          <text class="first-text">追剧</text>
          <text class="first-text">更多</text>
        </view>
        <scroll-view
          style="white-space: nowrap"
          scroll-x="true"
          show-scrollbar="false"
          scroll-left="120"
        >
          <view style="display: flex; flex-direction: row; flex-wrap: nowrap">
            <view
              style="display: flex; flex-direction: column; margin-right: 20rpx"
              v-for="(item, index) in tvlist"
              :key="index"
            >
              <image
                :src="item.pic"
                mode="aspectFill"
                style="width: 200rpx; height: 300rpx"
              ></image>
              <text class="first-text">{{ item.title }}</text>
              <text class="second-text">{{ item.state.slice(0, 10) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="data-new">
        <view class="data-header">
          <text class="first-text">电影</text>
          <text class="first-text">更多</text>
        </view>
        <scroll-view
          style="white-space: nowrap"
          scroll-x="true"
          show-scrollbar="false"
          scroll-left="120"
        >
          <view style="display: flex; flex-direction: row; flex-wrap: nowrap">
            <view
              style="display: flex; flex-direction: column; margin-right: 20rpx"
              v-for="(item, index) in filmlist"
              :key="index"
            >
              <image
                :src="item.pic"
                mode="aspectFill"
                style="width: 200rpx; height: 300rpx"
              ></image>
              <text class="first-text">{{ item.title }}</text>
              <text class="second-text">{{ item.state.slice(0, 10) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="data-new">
        <view class="data-header">
          <text class="first-text">动漫</text>
          <text class="first-text">更多</text>
        </view>
        <scroll-view
          style="white-space: nowrap"
          scroll-x="true"
          show-scrollbar="false"
          scroll-left="120"
        >
          <view style="display: flex; flex-direction: row; flex-wrap: nowrap">
            <view
              style="display: flex; flex-direction: column; margin-right: 20rpx"
              v-for="(item, index) in cartoonlist"
              :key="index"
            >
              <image
                :src="item.pic"
                mode="aspectFill"
                style="width: 200rpx; height: 300rpx"
              ></image>
              <text class="first-text">{{ item.title }}</text>
              <text class="second-text">{{ item.state.slice(0, 10) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="data-new">
        <view class="data-header">
          <text class="first-text">综艺</text>
          <text class="first-text">更多</text>
        </view>
        <scroll-view
          style="white-space: nowrap"
          scroll-x="true"
          show-scrollbar="false"
          scroll-left="120"
        >
          <view style="display: flex; flex-direction: row; flex-wrap: nowrap">
            <view
              style="display: flex; flex-direction: column; margin-right: 20rpx"
              v-for="(item, index) in varietylist"
              :key="index"
            >
              <image
                :src="item.pic"
                mode="aspectFill"
                style="width: 200rpx; height: 300rpx"
              ></image>
              <text class="first-text">{{ item.title }}</text>
              <text class="second-text">{{ item.state.slice(0, 10) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import http from "../../utils/http.js";
import uniIcons from "@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue";
import uniSearchBar from "@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue";
import uniGrid from "@/components/uni-ui/uni-grid/components/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni-ui/uni-grid/components/uni-grid-item/uni-grid-item.vue";
export default {
  components: { uniIcons, uniSearchBar, uniGridItem, uniGrid },
  data() {
    return {
      lunbolist: [],
      search: "",
      current: 0,
      settings: ["收藏", "历史", "直播", "下载", "设置"],
      showsetting: false,
      tvlist: [],
      cartoonlist: [],
      filmlist: [],
      varietylist: [],
    };
  },
  onLoad() {
    this.getlunbolist();
    this.getbodydata();
  },
  methods: {
    changeCurrent(e) {
      this.current = e.detail.current;
    },
    showset() {
      this.showsetting = !this.showsetting;
    },
    async getlunbolist() {
      let html = await http.get("https://m.v.qq.com");

      let rangeres = await http.matchOnce("重磅热播([\\s\\S]*?)猜你喜欢", html);
      if (rangeres.flag) {
        let listres = await http.matchAll(
          'class="item_content"([\\s\\S]*?)</div></a>',
          rangeres.data
        );
        if (listres.flag) {
          for (let listr of listres.data) {
            let titleres = await http.matchOnce(
              'div class="item_title needsclick">([\\s\\S]*?)</div>',
              listr
            );
            let picres = await http.matchOnce(
              '<img dsrc="([\\s\\S]*?)" lazyLoad=',
              listr
            );

            if (titleres.flag && picres.flag) {
              this.lunbolist.push({
                pic: picres.data,
                title: titleres.data.trim(),
              });
            }
          }
        } else {
          uni.showToast({
            title: "轮播图获取失败！",
            duration: 2000,
            icon: "error",
          });
        }
      } else {
        uni.showToast({
          title: "轮播图获取失败！",
          duration: 2000,
          icon: "error",
        });
      }
    },
    async gethtmldata(url, site) {
      let searchLists = [];
      let header = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36",
      };
      let html = await http.get(url, header);
      let rangeres = await http.matchOnce(site.search_range, html);
	  // console.log(rangeres.data);
      if (rangeres.flag) {
        let titleres = await http.matchAll(
          site.search_list_name,
          rangeres.data
		  
        );
        let picres = await http.matchAll(site.search_list_src, rangeres.data);
        // console.log(picres.data)
		let stateres = await http.matchAll(
          site.search_list_state,
          rangeres.data
        );
		// console.log(stateres.data)
        if (
          titleres.flag &&
          picres.flag
        ) {
          for (let i = 0; i < titleres.data.length; i++) {
            if (picres.data[i] && picres.data[i].indexOf("//") == -1) {
              picres.data[i] = [site.pic_url, picres.data[i]].join("");
            }
            if (picres.data[i] && titleres.data[i]) {
              searchLists.push({
                pic: picres.data[i],
                title: titleres.data[i],
                state: stateres.data[i],
              });
            }
          }
          return {
            flag: true,
            data: searchLists,
            msg: "获取完成",
          };
        } else {
          return {
            flag: false,
            data: "error!",
            msg: "获取失败",
          };
        }
      } else {
        return {
          flag: false,
          data: "error!",
          msg: "获取失败",
        };
      }
    },
    async getbodydata() {
      let cartoonsite = {
        pic_url: "",
        search_range:
          '新番周更表([\\s\\S]*?)lz_next',
        search_list_name:'<img loading="lazy" class="figure_pic".*?src=".*?" alt="([\\s\\S]*?)" onerror=',
        search_list_src:'<img loading="lazy" class="figure_pic".*?src="([\\s\\S]*?)" alt=".*?" onerror="picerr',
        search_list_state: '<div class="figure_caption">([\\s\\S]*?)</div>',
      };
      let cartoonres = await this.gethtmldata("https://v.qq.com/channel/cartoon", cartoonsite);
     // console.log(cartoonres.data)
	  if (cartoonres.flag) {
        this.cartoonlist = cartoonres.data;
      }
      let tvsite = {
        pic_url: "",
        search_range: "热剧精选([\\s\\S]*?)热点短视频",
        search_list_name:
          '<img loading="lazy" class="figure_pic".*?src=".*?" alt="([\\s\\S]*?)" onerror="picerr',
        search_list_src:
          '<img loading="lazy" class="figure_pic".*?src="([\\s\\S]*?)" alt=.*?onerror="picerr',
        search_list_state: '<div class="figure_caption">([\\s\\S]*?)</div>',
      };
      let tvres = await this.gethtmldata("https://v.qq.com/channel/tv", tvsite);
      if (tvres.flag) {
        this.tvlist = tvres.data;
      }
      let filmsite = {
        pic_url: "",
        search_range:
          '排行榜([\\s\\S]*?)data-rowcount="8" data-rowlen="1">',
        search_list_name:
          '<img loading="lazy" class="figure_pic" alt="([\\s\\S]*?)" src=',
        search_list_src:
          '<img loading="lazy" class="figure_pic" alt=".*?" src="([\\s\\S]*?)" style=',
        search_list_state: '<div class="figure_score">([\\s\\S]*?)</div>',
      };
      let filmres = await this.gethtmldata("https://v.qq.com/channel/movie", filmsite);
      if (filmres.flag) {
        this.filmlist = filmres.data;
      }
      // let varietysite = {
      //   pic_url: "",
      //   search_range: '热播周榜([\\s\\S]*?)真人秀节目嗨翻天',
      //   search_list_name:
      //     '<img loading="lazy" class="figure_pic" alt="([\\s\\S]*?)" src=',
      //   search_list_src:
      //     '<img loading="lazy" class="figure_pic" alt=".*?" src="([\\s\\S]*?)" style=',
      //   search_list_state: '<div class="figure_caption">([\\s\\S]*?)</div>',
      // };
      // let varietyres = await this.gethtmldata("https://v.qq.com/channel/variety", varietysite);
      // if (varietyres.flag) {
      //   this.varietylist = varietyres.data;
      // }
    },
  },
};
</script>

<style lang="scss">
.data-new {
}
.data-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
