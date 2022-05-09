<template>
	<view class="live">
		<view class="header">
			<view style="height: 40px;background-color: #FFFFFF;"></view>
			<view style="flex-direction: row;justify-content: space-between;">
				<uni-icons color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text style="font-size: 20px;margin-top: 8px;">直播</text>
				<text style="font-size: 20px;margin-top: 8px;margin-right: 10px;" @click="openImpSite">导入</text>
			</view>
		</view>
		<view class="impSite" v-if="impSite">
			<input
				class="inputtext"
				maxlength="-1"
				value="{&quot;name&quot;:&quot;&quot;,&quot;url&quot;:&quot;&quot;}"
				:style="{ width: `${searchwidth}px` }"
				v-model="impdata"
				type="text"
				placeholder="{&quot;name&quot;:&quot;&quot;,&quot;url&quot;:&quot;&quot;}"
			/>
			<button class="inputbutton" @click="importSiteEvent">导入</button>
		</view>
		<view class="play" maxlength="300" v-if="hidePlay">
			<video
				id="myVideo"
				ref="myVideo"
				class="player"
				autoplay="true"
				:src="url"
				:codec="jiema"
				:object-fit="objectfit"
				play-strategy="3"
				vslide-gesture="true"
				enable-play-gesture="true"
				:vslide-gesture-in-fullscreen="volumecontrol"
				show-loading="false"
				@error="changeWare()"
				@controlstoggle="controlShow"
				@fullscreenclick="changeRatePlay"
				@fullscreenchange="enterFullScreen"
				@ended="nextVideo"
			>
				<cover-view class="play-control" v-if="fullscreen && showControlshow && showControl">
					<text class="play-nowtime" @click="getNowTime">{{ nowtime }}</text>
					<text class="play-last" @click="lastVideo()">上一集</text>
					<text class="play-next" @click="nextVideo()">下一集</text>
					<text class="play-now">{{ nowPlay }}</text>
					<text class="play-rate" @click="changePlayRate()">速度:{{ String(playRate) }}</text>
					<text class="play-direction" @click="changeDirection()">旋转</text>
					<text class="play-choose" @click="changeshowplay">选集</text>
					<text class="play-choose" @click="changeobjectfit">{{ objectfittext }}</text>
				</cover-view>
				<cover-view class="body" v-if="showplay && showControlshow && fullscreen">
					<view class="play-lists">
						<view class="play-data" v-for="(item, index) in livelists" :key="index">
							<text class="play-playname" :class="[nowPlayNum == index ? 'playname-active' : '']" @click="playlive(item, index)">{{ item.slice(0, 25) }}</text>
						</view>
						<text class="playname"></text>
					</view>
				</cover-view>
			</video>
			<view style="margin-bottom: 5px;font-size: 20px;margin-top: 5px;margin-left: 20px;margin-right: 20px;display: flex;flex-direction: row;justify-content: space-between;">
				<text style="text-align:center;" @click="navigateUrl()">跳转浏览器</text>
				<text style="text-align:center;" @click="searchdev()">点击投屏</text>
			</view>
			<view v-for="dev in devList" :key="dev.id">
				<text style="font-size: 20px;text-align: center;margin-bottom: 10px;" @click="startdev(dev.id)">{{ dev.name }}</text>
			</view>
		</view>
		<view class="body">
			<view v-for="(i, j) in livelists" :key="j" class="item-group">
				<view class="name-group" @click="playlive(i, j)">{{ i.name }}</view>
				<view class="deal-name">
					<button class="delete" size="mini" :ripple="true" @click="deleteEvent(j)">删除</button>
					<button class="pushpin" size="mini" :ripple="true" @click="pushpinEvent(i, j)">置顶</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import ajax from '../../utils/uni-ajax';
const dlna = uni.requireNativePlugin('JX-Dlna');
export default {
	data() {
		return {
			impSite: false,
			impdata: '',
			livelists: [],
			fullControlsWidth: null,
			fullControlsHeigt: null,
			searchwidth: 200,
			hidePlay: false,
			devList: [],
			url: '',
			nowPlay: '',
			videoContext: null,
			showControlshow: false,
			volumecontrol: true,
			nowtime: '',
			direction: -90,
			fullscreen: false,
			jiema: 'hardware',
			nowPlayNum: 0,
			playRate: 1.0,
			objectfit: 'contain',
			objectfittext: '拉伸',
			showplay: false
		};
	},
	created() {
		this.fullControlsHeigt = uni.getSystemInfoSync().screenHeight;
		this.fullControlsWidth = uni.getSystemInfoSync().screenWidth + 1;
		if (this.fullControlsWidth > this.fullControlsHeigt) {
			this.searchwidth = (this.fullControlsWidth * 3) / 4;
		} else {
			this.searchwidth = (this.fullControlsWidth * 2) / 3;
			if (this.fullscreen) {
				this.fullscreen = true;
				this.videoContext.requestFullScreen({
					direction: 0
				});
				this.direction = 0;
			}
		}
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myVideo', this);
	},
	onLoad() {
		this.livelists = uni.getStorageSync('livelists');
		if (!this.livelists) {
			uni.setStorageSync('livelists', []);
			this.livelists = [];
		}
		this.updataSite();
	},
	onShow() {},
	methods: {
		changeshowplay() {
			this.showplay = !this.showplay;
			if (this.showplay) {
				this.volumecontrol = false;
			} else {
				this.volumecontrol = true;
			}
		},
		changeobjectfit() {
			if (this.objectfit == 'contain') {
				this.objectfittext = '还原';
				this.objectfit = 'fill';
			} else {
				this.objectfittext = '拉伸';
				this.objectfit = 'contain';
			}
		},
		changeDirection() {
			this.videoContext.exitFullScreen();
			if (this.fullControlsWidth > this.fullControlsHeigt) {
				if (this.direction == 90) {
					this.videoContext.requestFullScreen({
						direction: -90
					});
					this.direction = -90;
					plus.navigator.setFullscreen(true);
				} else {
					this.videoContext.requestFullScreen({
						direction: 90
					});
					this.direction = 90;
					plus.navigator.setFullscreen(true);
				}
			} else {
				this.fullscreen = true;
				this.videoContext.requestFullScreen({
					direction: 0
				});
				this.direction = 0;
				plus.navigator.setFullscreen(true);
			}
		},
		changePlayRate() {
			if (this.playRate == 1.0) {
				this.videoContext.playbackRate(1.25);
				this.playRate = 1.25;
				return;
			}
			if (this.playRate == 1.25) {
				this.videoContext.playbackRate(1.5);
				this.playRate = 1.5;
				return;
			}
			if (this.playRate == 1.5) {
				this.videoContext.playbackRate(2.0);
				this.playRate = 2.0;
				return;
			}
			if (this.playRate === 2.0) {
				this.videoContext.playbackRate(1.0);
				this.playRate = 1.0;

				return;
			}
		},
		lastVideo() {
			if (this.nowPlayNum > 0) {
				this.playRate = 1.0;
				this.playlive(this.livelists[Number(this.nowPlayNum - 1)], Number(this.nowPlayNum - 1));
			} else {
				uni.showToast({
					title: '第一个啦！',
					duration: 2300
				});
			}
		},
		nextVideo() {
			if (this.nowPlayNum + 1 < this.livelists.length) {
				this.playRate = 1.0;
				this.playlive(this.livelists[Number(this.nowPlayNum + 1)], Number(this.nowPlayNum + 1));
			} else {
				uni.showToast({
					title: '没有啦！',
					duration: 2300
				});
			}
		},
		changeRatePlay(e) {
			var clickW = e.detail.screenX;
			var clickH = e.detail.screenY;
			if (this.playRate == 1.0 && 8 * clickW > 7 * this.fullControlsWidth && 5 * clickH > 2 * this.fullControlsHeigt && 5 * clickH < 4 * this.fullControlsHeigt) {
				this.videoContext.playbackRate(2.0);
				this.playRate = 2.0;
				this.showControl = false;
			} else {
				if (this.playRate != 1.0 && 8 * clickW > 7 * this.fullControlsWidth && 5 * clickH > 2 * this.fullControlsHeigt && 5 * clickH < 4 * this.fullControlsHeigt) {
					this.videoContext.playbackRate(1.0);
					this.playRate = 1.0;
					this.showControl = false;
				} else {
					this.showControl = true;
				}
			}
		},
		changeWare() {
			if (this.jiema === 'hardware') {
				this.jiema = 'software';
			} else {
				uni.showToast({
					title: '播放失败！',
					duration: 2000
				});
			}
		},
		enterFullScreen() {
			this.fullscreen = !this.fullscreen;
			if (this.fullscreen) {
				plus.navigator.setFullscreen(true);
			} else {
				plus.navigator.setFullscreen(false);
			}
		},
		getNowTime() {
			var now = new Date();
			var hh = now.getHours(); //时
			if (hh < 10) hh = '0' + hh;
			var mm = now.getMinutes(); //分
			if (mm < 10) mm = '0' + mm;
			this.nowtime = `${hh}:${mm}`;
		},
		controlShow(e) {
			this.showControlshow = e.detail.show;
			if (this.showControlshow) {
				this.getNowTime();
			} else {
				this.showplay = false;
				this.volumecontrol = true;
			}
		},
		async pushpinEvent(i, index) {
			if (index === 0) {
				return false;
			}
			let temp = this.livelists.splice(index, 1);
			this.livelists.unshift(temp[0]);
			uni.setStorageSync('livelists', this.livelists);
			console.log(JSON.stringify(this.livelists));
			plus.nativeUI.toast('置顶成功!', { align: 'center', verticalAlign: 'center' });
		},
		async deleteEvent(j) {
			this.livelists.splice(j, 1);
			uni.setStorageSync('livelists', this.livelists);
			plus.nativeUI.toast('删除成功!', { align: 'center', verticalAlign: 'center' });
		},
		playlive(i, j) {
			this.videoContext.pause();
			this.url = i.url;
			this.hidePlay = true;
			this.nowPlay = i.name;
			this.nowPlayNum = j;
			this.videoContext.play();
		},
		startdev(id) {
			dlna.play({ id: id, url: this.url, title: this.nowPlay }, result => {
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
		pageBacked() {
			this.videoContext.stop();
			uni.navigateBack();
		},
		openImpSite() {
			this.impSite = !this.impSite;
		},
		async importSiteEvent() {
			if (this.impdata === '') {
				return false;
			}

			try {
				if (this.impdata.startsWith('{')) {
					let item = JSON.parse(this.impdata);

					if (item.name != '') {
						let rescheck = await this.checkitem(item);
						if (rescheck.flag) {
							this.livelists.push(JSON.parse(this.impdata));
							uni.setStorageSync('livelists', this.livelists);
							plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
						}
					}
				}
				if (this.impdata.startsWith('[')) {
					if (JSON.parse(this.impdata)[0].name != '') {
						for (let item of JSON.parse(this.impdata)) {
							let rescheck = await this.checkitem(item);
							if (rescheck.flag) {
								this.livelists.push(item);
							}
						}
						uni.setStorageSync('livelists', this.livelists);
						plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
					}
				}
				if (this.impdata.startsWith('http')) {
					let urlslices = this.impdata.split('&&&&');
					let urlList = uni.getStorageSync('urlNotive');
					let urldata = {
						name: urlslices[1],
						url: urlslices[0],
						isActive: true
					};
					const rre = await db.checkItemNotivre(urldata, urlList);
					if (rre.flag) {
						urlList.push(urldata);
						uni.setStorageSync('urlNotive', urlList);
					}
					const res = await ajax.get(urlslices[0], {
						timeout: 5000
					});
					if (res.data && res.data.length > 0) {
						for (let i of res.data) {
							if (i.livelists && i.livelists.length > 0) {
								for (let item of i.livelists) {
									let rescheck = await this.checkitem(item);
									if (rescheck.flag) {
										this.livelists.push(item);
									}
								}
								uni.setStorageSync('livelists', this.livelists);
								plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
							}
						}
					}
				}
				this.impdata = '';
				this.impSite = false;
			} catch (e) {
				console.log(e);
				plus.nativeUI.toast('格式错误,导入失败!', { align: 'center', verticalAlign: 'center' });
			}
		},
		async checkitem(item) {
			for (let i of this.livelists) {
				if (item.url == i.url) return { flag: false, msg: '已存在！' };
			}
			return { flag: true, msg: '不存在' };
		},
		async updataSite() {
			let siteList = uni.getStorageSync('urlNotive');
			for (let sitelist of siteList) {
				if (sitelist.isActive) {
					const res = await ajax.get(urlslices[0], {
						timeout: 5000
					});
					if (res.data && res.data.length > 0) {
						for (const i of res.data) {
							if (i.livelists && i.livelists.length > 0) {
								for (let item of i.livelists) {
									let rescheck = await this.checkitem(item);
									if (rescheck.flag) {
										this.livelists.push(item);
									}
								}
								uni.setStorageSync('livelists', this.livelists);
								plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
							}
						}
					}
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tag-lists {
	margin-left: 20px;

	display: flex;
	flex-direction: row;
	margin-top: 10px;
	margin-bottom: 10px;
	flex-wrap: wrap;
	.item-title {
		margin-left: 10px;
		color: #000;
		margin-right: 10px;
		margin-top: 10px;
		font-size: 20px;
		flex-wrap: wrap;
	}
	.item-title-active {
		color: #00aa00;
		flex-wrap: wrap;
		margin-right: 10px;
		margin-top: 10px;
		font-size: 20px;
		margin-left: 10px;
	}
}
.player {
	margin-top: 5px;
	margin-bottom: 5px;
	.play-control {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		color: #ffffff;
		margin-top: 13x;
		margin-left: 40px;
	}
	.play-choose {
		color: #ffffff;
	}
	.play-nowtime {
		color: #ffffff;
	}
	.play-last {
		color: #ffffff;
	}
	.play-next {
		color: #ffffff;
	}
	.play-now {
		color: #ffffff;
	}
	.play-rate {
		color: #ffffff;
	}
	.play-direction {
		color: #ffffff;
	}
}
.live {
	margin-left: 10px;
	margin-right: 10px;
}
.impSite {
	display: flex;
	margin-top: 20px;
	flex-direction: row;
	margin-bottom: 10px;
	margin-left: 20px;
	margin-right: 20px;
	justify-content: space-between;
	.inputtext {
		margin-left: 0px;
		margin-top: 6px;
	}
	.inputbutton {
		width: 70px;

		margin-left: 10px;
		height: 35px;
	}
}
.body {
	margin-top: 10px;
	.item-group {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 10px;
		margin-bottom: 10px;

		margin-right: 10px;
		.name-group {
			margin-top: 5px;
		}
		.deal-name {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			.delete {
				margin-right: 20px;
			}
		}
	}
}
</style>
