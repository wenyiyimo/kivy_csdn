<template>
	<view class="play">
		<view class="header">
			<view class="header-top"></view>
			<view
				style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
			>
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5px" @click="openimport">播放</text>
				<uni-icons style="margin-right: 10px" color="#000000" size="40" :type="downImage" @click="downvideo" />
			</view>
			<view
				v-if="impextrakey"
				style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
		  margin-left: 10px;
		  margin-right: 10px;
		  margin-bottom: 10px;
        "
			>
				<input maxlength="-1" style="width: 250px; font-size: 20px" v-model="extrakey" type="text" placeholder="请输入嗅探排除关键词" />
				<text class="first-text" @click="importextrakey">导入</text>
			</view>
		</view>
		<view class="body">
			<view class="play" v-if="hideplay" style="margin-left: 10px; margin-right: 10px">
				<video
					id="myvideo"
					ref="myvideo"
					:src="playurl"
					autoplay="true"
					:initial-time="initialtime"
					:controls="controls"
					:object-fit="objectfit"
					codec="hardware"
					http-cache="false"
					:play-strategy="playstrategy"
					vslide-gesture="true"
					show-center-play-btn="true"
					enable-play-gesture="true"
					@ended="nextvideo"
					@fullscreenchange="fullscreenchange"
					@error="showerror"
					@fullscreenclick="fullscreenclick"
					@controlstoggle="controlstoggle"
				>
					<!-- @timeupdate="timeupdate" -->
					<cover-view class="play-control" v-if="fullscreen && controls">
						<text class="first-text" style="color: #fff" @click="getnowtime()">{{ nowtime }}</text>
						<text class="first-text" style="color: #fff" @click="changeplaystrategy()">解码:{{ playstrategytext }}</text>
						<text class="first-text" style="color: #fff" @click="lastvideo()">上集</text>
						<text class="first-text" style="color: #fff">{{ nowplay }}</text>
						<text class="first-text" style="color: #fff" @click="nextvideo()">下集</text>
						<text class="first-text" style="color: #fff" @click="changeobjectfit()">{{ objectfittext }}</text>
						<text class="first-text" style="color: #fff" @click="changedirection()">旋转</text>
						<text class="first-text" style="color: #fff" @click="changeplaybackRate()">速度:{{ playbackRate }}</text>
					</cover-view>
				</video>
				<view
					style="
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
				>
					<text style="text-align: center; font-size: 20px" @click="navigateUrl()">腾讯免流</text>
					<text style="text-align: center; font-size: 20px" @click="copyUrl()">复制链接</text>
					<text style="text-align: center; font-size: 20px" @click="searchdev()">点击投屏</text>
				</view>
				<view v-for="dev in devList" :key="dev.id">
					<text class="first-text" style="text-align: center; margin-bottom: 10px" @click="startdev(dev.id)">{{ dev.name }}</text>
				</view>
			</view>
			<uni-card style="margin: 5px;">
				<view
					class="detail"
					style="
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin-top: 10rpx;
            margin-bottom: 10rpx;
          "
				>
					<image :src="searchlists[sitecurrent][0].pic" mode="aspectFill" style="height: 120px; width: 90px"></image>
					<view
						style="
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              margin-left: 30px;
            "
					>
						<text class="first-text">{{ searchlists[sitecurrent][0].title }}</text>
						<text class="second-text">状态：{{ searchlists[sitecurrent][0].state }}</text>
						<text class="second-text">上次观看：{{ nowplay }}</text>
					</view>
				</view>
			</uni-card>
			<scroll-view
				style="
          white-space: nowrap;
          display: flex;
          flex-direction: row;
          padding-top: 5px;
          margin-left: 10px;
          margin-right: 10px;
        "
				scroll-x="true"
				show-scrollbar="false"
				scroll-left="120"
			>
				<text
					v-for="(item, index) in searchlists"
					:key="index"
					class="first-text"
					:class="[sitecurrent == index ? 'active-text' : '']"
					style="margin-right: 20px"
					@click="changesite(index)"
				>
					{{ item[0].name }}
				</text>
			</scroll-view>
			<scroll-view
				style="
          white-space: nowrap;
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left: 10px;
          margin-right: 10px;
        "
				scroll-x="true"
				show-scrollbar="false"
				scroll-left="120"
			>
				<text class="first-text" style="margin-right:20px;" @click="nixu(tagcurrent)">逆序</text>
				<text
					v-for="(item, index) in searchlists[sitecurrent][2]"
					:key="index"
					class="first-text"
					:class="[tagcurrent == index ? 'active-text' : '']"
					style="margin-right: 20px"
					@click="changetag(index)"
				>
					{{ item.name }}
				</text>
			</scroll-view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;flex-wrap: wrap;" v-if="showplaydata">
				<text
					class="first-text"
					:class="[playcurrent == index ? 'active-text' : '']"
					v-for="(item, index) in searchlists[sitecurrent][2][tagcurrent].data"
					:key="index"
					@click="changeplay(index)"
					style="justify-content: center;align-items: center;margin: 5px;padding: 5px;background-color: #fff;border-radius: 10%;border-style:solid;border-color:border-width: 2; flex;flex-direction: row;flex-wrap: nowrap;"
				>
					{{ item.title }}
				</text>
				<text style="width:0px"></text>
			</view>
			<uni-load-more status="loading" v-if="showloading"></uni-load-more>
		</view>
	</view>
</template>
<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import webvplay from '@/utils/webview.js';
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
import UniLoadMore from '../../components/uni-ui/uni-load-more/components/uni-load-more/uni-load-more.vue';
const dlna = uni.requireNativePlugin('JX-Dlna');
export default {
	mixins: [webvplay],
	components: {
		UniIcons,
		UniCard,
		UniLoadMore
	},
	data() {
		return {
			extrakey: '',
			impextrakey: false,
			showloading: true,
			videoContext: null,
			hideplay: false,
			downImage: 'arrow-down',
			sitecurrent: 0,
			tagcurrent: 0,
			playcurrent: 0,
			searchlists: [],
			showplaydata: false,
			notiveImage: 'heart-filled',
			nowtime: '',
			nowplay: '无',
			initialtime: 0,
			controls: true,
			objectfit: 'contain',
			objectfittext: '包含',
			playstrategy: '3',
			playstrategytext: '网络',
			fullscreen: false,
			playbackRate: 1.0,
			direction: -90,
			devList: [],
			downloadlists: []
		};
	},
	watch: {
		playurl(newurl, oldurl) {
			if (newurl != '') this.playvideo();
		}
	},
	methods: {
		async importextrakey() {
			if (this.extrakey == '') {
				this.openimport();
				return;
			} else {
				let extrakey = uni.getStorageSync('extrakey');
				let flag = await this.checkextrakey(extrakey, this.extrakey);
				this.openimport();
				if (flag.flag) {
					extrakey.push(this.extrakey);
					uni.setStorageSync('extrakey', extrakey);
					this.extrakey = '';
					return;
				} else {
					this.extrakey = '';
					return;
				}
			}
		},
		async checkextrakey(sites, key) {
			for (let i of sites) {
				if (i.indexOf(key) != -1) {
					return { flag: false };
				}
			}
			return { flag: true };
		},
		openimport() {
			this.impextrakey = !this.impextrakey;
		},
		startdev(id) {
			dlna.play({ id: id, url: this.playurl, title: this.nowPlay }, result => {
				console.log(result.msg);
				// this.title = result.msg
			});
		},
		searchdev() {
			this.devList = [];
			dlna.search(result => {
				//alert(result.type)
				if (result.type === 'add') {
					this.devList.push({ id: result.id, name: result.name });
				} else {
					this.devList = this.devList.filter(x => x.id != result.id);
				}
			});
		},
		copyUrl() {
			uni.setClipboardData({
				data: this.playurl,
				success: function() {
					uni.showToast({
						title: '复制成功！',
						duration: 1000
					});
				},
				fail: function(err) {
					uni.showToast({
						title: '复制失败！',
						duration: 1000
					});
				}
			});
		},
		navigateUrl() {
			this.videoContext.pause();
			plus.runtime.openURL(
				this.playurl,
				err => {
					uni.showToast({
						title: '跳转失败！',
						duration: 1000
					});
				},
				'com.tencent.mtt'
			);
		},
		fullscreenchange() {
			this.fullscreen = !this.fullscreen;
			if (this.fullscreen) {
				this.controls = false;
				plus.navigator.setFullscreen(true);
			} else {
				plus.navigator.setFullscreen(false);
				this.controls = true;
			}
		},
		controlstoggle(e) {
			if (!e.detail.show && this.fullscreen) {
				this.controls = e.detail.show;
			}
		},
		fullscreenclick(e) {
			let clickW = e.detail.screenX / e.detail.screenWidth;
			let clickH = e.detail.screenY / e.detail.screenHeight;
			if (clickW > 0.88 && 0.4 < clickH && clickH < 0.6 && this.playbackRate == 1.0) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				this.controls = false;
			} else {
				if (clickW > 0.88 && 0.4 < clickH && clickH < 0.6 && this.playbackRate != 1.0) {
					this.videoContext.playbackRate(1.0);
					this.playbackRate = 1.0;
					this.controls = false;
				} else {
					if (clickH > 0.2 && this.controls) {
						this.controls = false;
					} else {
						this.getnowtime();
						this.controls = true;
					}
				}
			}
		},
		changeplaystrategy() {
			if (this.playstrategytext == '网络') {
				this.playstrategytext = '本地';
				this.playstrategy = '0';
				return;
			}
			if (this.playstrategytext == '本地') {
				this.playstrategytext = '极端';
				this.playstrategy = '1';
				return;
			}
			if (this.playstrategytext == '极端') {
				this.playstrategytext = '网络';
				this.playstrategy = '3';
				return;
			}
		},
		changeplaybackRate() {
			if (this.playbackRate == 1.0) {
				this.videoContext.playbackRate(1.25);
				this.playbackRate = 1.25;
				return;
			}
			if (this.playbackRate == 1.25) {
				this.videoContext.playbackRate(1.5);
				this.playbackRate = 1.5;
				return;
			}
			if (this.playbackRate == 1.5) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				return;
			}
			if (this.playbackRate == 2.0) {
				this.videoContext.playbackRate(0.5);
				this.playbackRate = 0.5;
				return;
			}
			if (this.playbackRate == 0.5) {
				this.videoContext.playbackRate(0.8);
				this.playbackRate = 0.8;
				return;
			}
			if (this.playbackRate === 0.8) {
				this.videoContext.playbackRate(1.0);
				this.playbackRate = 1.0;
				return;
			}
		},
		changedirection() {
			this.videoContext.exitFullScreen();
			if (this.direction == -90) {
				this.videoContext.requestFullScreen({
					direction: 0
				});
				this.direction = 0;
				plus.navigator.setFullscreen(true);
				return;
			}
			if (this.direction == 0) {
				this.videoContext.requestFullScreen({
					direction: 90
				});
				this.direction = 90;
				plus.navigator.setFullscreen(true);
				return;
			}
			if (this.direction == 90) {
				this.videoContext.requestFullScreen({
					direction: -90
				});
				this.direction = -90;
				plus.navigator.setFullscreen(true);
				return;
			}
		},
		changeobjectfit() {
			if (this.objectfit == 'contain') {
				this.objectfit = 'fill';
				this.objectfittext = '填充';
				return;
			}
			if (this.objectfit == 'fill') {
				this.objectfit = 'cover';
				this.objectfittext = '覆盖';
				return;
			}
			if (this.objectfit == 'cover') {
				this.objectfit = 'contain';
				this.objectfittext = '包含';
				return;
			}
		},
		nextvideo() {
			this.videoContext.pause();
			if (this.searchlists[this.sitecurrent][2][this.tagcurrent].data.length == this.playcurrent + 1) {
				uni.showToast({
					title: '最后一集了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent + 1;
				this.changeplay(this.playcurrent);
			}
		},
		lastvideo() {
			this.videoContext.pause();
			if (this.playcurrent == 0) {
				uni.showToast({
					title: '第一集了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent - 1;
				this.changeplay(this.playcurrent);
			}
		},
		getnowtime() {
			let now = new Date();
			let hh = now.getHours(); //时
			if (hh < 10) hh = '0' + hh;
			let mm = now.getMinutes(); //分
			if (mm < 10) mm = '0' + mm;
			this.nowtime = `${hh}:${mm}`;
		},
		showerror() {
			if (this.playurl != '') {
				// this.playurl='';
				uni.showToast({
					title: '视频播放错误!',
					duration: 1000
				});
			}
		},
		playvideo() {
			this.hideplay = true;
			this.videoContext.playbackRate(1.0);
			this.playbackRate = 1.0;
			this.videoContext.play();
		},
		changeplay(index) {
			if (this.downImage == 'arrow-down') {
				this.playcurrent = index;
				this.nowplay = this.searchlists[this.sitecurrent][2][this.tagcurrent].data[index].title;
				this.xtplayurl(this.searchlists[this.sitecurrent][2][this.tagcurrent].data[index].href);
				let site = {
					title: this.searchlists[this.sitecurrent][0].title,
					state: this.nowplay
				};
				this.sethistory(site);
			} else {
				let temp = [
					this.searchlists[this.sitecurrent][0].title,
					this.searchlists[this.sitecurrent][2][this.tagcurrent].data[index].title,
					this.searchlists[this.sitecurrent][2][this.tagcurrent].data[index].href
				];
				let tempindex = this.downloadlists.findIndex(item => item[3] == temp[3]);
				if (tempindex) {
					uni.showToast({
						title: '已添加过该集',
						duration: 1000
					});
					return;
				} else {
					this.downloadlists.push(temp);
					uni.showToast({
						title: temp[1] + '添加成功',
						duration: 800
					});
				}
			}
		},
		async sethistory(site) {
			let historys = uni.getStorageSync('historys');
			let flag = await this.checkhistory(historys, site);
			if (flag.flag) {
				historys.unshift(site);
				uni.setStorageSync('historys', historys);
			}
		},
		async gethistory() {
			let historys = uni.getStorageSync('historys');
			let title = this.searchlists[this.sitecurrent][0].title;
			for (let i of historys) {
				if (i.title == title) {
					this.nowplay = i.state;
				}
			}
		},
		async checkhistory(historys, site) {
			let num = historys.length;
			if (num > 100) {
				historys.pop();
				for (let i = 0; i < num - 1; i++) {
					if (historys[i].title == site.title) {
						historys.splice(i, 1);
						historys.unshift(site);
						uni.setStorageSync('historys', historys);
						return { flag: false };
					}
				}
				return { flag: true };
			} else {
				for (let i = 0; i < num; i++) {
					if (historys[i].title == site.title) {
						historys.splice(i, 1);
						historys.unshift(site);
						uni.setStorageSync('historys', historys);
						return { flag: false };
					}
				}
				return { flag: true };
			}
		},
		changetag(index) {
			this.tagcurrent = index;
		},
		changesite(index) {
			this.sitecurrent = index;
			this.tagcurrent = 0;
			this.getplaydata(index);
		},
		downvideo() {
			if (this.downImage == 'arrow-down') {
				this.downImage = 'arrow-up';
			} else {
				this.downImage = 'arrow-down';
				uni.setStorageSync('downloadlists', this.downloadlists);
				uni.navigateTo({ url: `/pages/download/download` });
			}
		},
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		},
		nixu(index) {
			let temp = [];
			let tempLen = this.searchlists[this.sitecurrent][2][index].data.length;
			for (let i = 0; i < tempLen; i++) {
				temp[i] = this.searchlists[this.sitecurrent][2][index]['data'][tempLen - i - 1];
			}
			this.searchlists[this.sitecurrent][2][index].data = temp;
		},
		async getplaydata(index) {
			let site = this.searchlists[index];
			// console.log(site)
			if (site[2]) {
				this.showloading = false;
				this.showplaydata = true;
			} else {
				this.showplaydata = false;
				this.showloading = true;
				if (site[1].id == 'XT') {
					let res = await http.xtplaydata(site[0].href, site[1]);
					if (res.flag) {
						this.showplaydata = true;
						this.showloading = false;
						this.searchlists[index].push(res.data);
					} else {
						this.showloading = false;
						uni.showToast({
							title: '获取失败!',
							duration: 2000
						});
					}
				}
				if (site[1].id == 'APP') {
					// console.log(site)
					let res = await http.appplaydata(site[0].href, site[1]);
					if (res.flag) {
						this.showplaydata = true;
						this.showloading = false;
						this.searchlists[index].push(res.data);
					} else {
						this.showloading = false;
						uni.showToast({
							title: '获取失败!',
							duration: 2000
						});
					}
				}
			}
		}
	},
	onLoad: function() {
		this.searchlists = uni.getStorageSync('temp');
		this.getplaydata(this.sitecurrent);
		this.gethistory();
		this.initialtime = uni.getStorageSync('initialtime');
		this.downloadlists = uni.getStorageInfoSync('downloadlists');
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myvideo', this);
	},
	onUnload() {}
};
</script>
<style lang="scss" scoped>
.body {
	display: flex;
	flex-direction: column;
}
.play-control {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	color: #ffffff;
	margin-top: 13px;
	margin-left: 40px;
}
</style>
