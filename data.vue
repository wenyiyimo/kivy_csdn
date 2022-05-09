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
			<video id="myVideo" ref="myVideo" class="player" autoplay="true" :src="url" play-strategy="3"></video>
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
				<view class="name-group" @click="playlive(i)">{{ i.name }}</view>
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
			videoContext: null
		};
	},
	created() {
		this.fullControlsHeigt = uni.getSystemInfoSync().screenHeight;
		this.fullControlsWidth = uni.getSystemInfoSync().screenWidth + 1;
		if (this.fullControlsWidth > this.fullControlsHeigt) {
			this.searchwidth = (this.fullControlsWidth * 3) / 4;
		} else {
			this.searchwidth = (this.fullControlsWidth * 2) / 3;
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
		playlive(i) {
			this.url = i.url;
			this.hidePlay = true;
			this.nowPlay = i.name;
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
