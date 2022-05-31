<template>
	<view class="site">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 15rpx;" @click="openImpSite()">站源管理</text>
				<text class="first-text" style="margin-top: 15rpx;margin-right: 20rpx;" @click="changeState">{{ urlNotive }}</text>
			</view>
			<view v-if="impSite" style="display: flex;flex-direction: row;justify-content: space-between;">
				<input maxlength="-1" style="width: 80%;" v-model="url" type="text" placeholder="请导入JSON数据" />
				<text class="first-text" @click="importSiteEvent">导入</text>
			</view>
		</view>
		<view class="body" v-if="bodyshow">
			<view v-for="(i, j) in siteList" :key="j" class="item-group">
				<text class="name-group" style="font-size:20px;">{{ i.name }}</text>
				<view class="deal-name">
					<button class="delete" size="mini" :ripple="true" @click="deleteEvent(i)">删除</button>
					<button class="pushpin" size="mini" :ripple="true" @click="pushpinEvent(i, j)">置顶</button>
					<switch class="switch-button" :checked="i.isActive" @change="switchChange(i)" type="switch" active-color="#c7ccce"></switch>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
export default {
	components: {
		UniIcons
	},
	data() {
		return {
			searchwidth: 200,
			siteList: [],
			impSite: false,
			url: '',
			bodyshow: true,
			urlNotive: '订阅',
			fullControlsWidth: null,
			fullControlsHeigt: null
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
	methods: {
		async changeState() {
			if (this.urlNotive == '订阅') {
				this.urlNotive = '站源';
				this.siteList = [];
				let that = this;
				setTimeout(function() {
					that.siteList = uni.getStorageSync('urlNotive');
				}, 500);
			} else {
				this.urlNotive = '订阅';
				this.siteList = [];
				let that = this;
				setTimeout(function() {
					that.getAllSite();
				}, 500);
			}
		},
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		},
		openImpSite() {
			this.url = '';
			this.impSite = !this.impSite;
		},
		async importSiteEvent() {
			if (this.url === '') {
				return false;
			}
			const res = await http.site(this.url);
			if (res && res.length > 0) {
				for (const i of res) {
					if (i.name.length > 0) {
						await db.add('site', i);
					} else {
						plus.nativeUI.toast('格式错误!', { align: 'center', verticalAlign: 'center' });
					}
				}
				this.getAllSite();
				this.impSite = false;
				this.url = '';

				plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
				return false;
			}
			plus.nativeUI.toast('格式错误,导入失败!', { align: 'center', verticalAlign: 'center' });
		},
		async pushpinEvent(i, index) {
			if (index === 0) {
				return false;
			}
			this.siteList.sort(function(x, y) {
				return x.name === i.name ? -1 : y.name === i.name ? 1 : 0;
			});
			const res = await db.removeAll('site');
			if (res.flag) {
				for (const i of this.siteList) {
					await db.add('site', i);
				}
			}
			plus.nativeUI.toast('置顶成功!', { align: 'center', verticalAlign: 'center' });
		},
		async getAllSite() {
			const res = await db.getAll('site');
			if (res.flag) {
				if (res.data.length <= 0) {
					return false;
				}
				this.siteList = res.data;
			}
		},
		async switchChange(e) {
			if (this.urlNotive == '订阅') {
				e.isActive = !e.isActive;
				await db.remove('site', e.name);
				const res = await db.add('site', e);
				if (res.flag) {
					uni.showToast({ title: '修改成功', type: 'success', duration: '2300' });
				}
			} else {
				e.isActive = !e.isActive;
				let urlList = uni.getStorageSync('urlNotive');
				let delnum = await this.getlistnum(urlList, e);
				urlList[delnum] = e;
				uni.setStorageSync('urlNotive', urlList);
				this.siteList = [];
				this.siteList = uni.getStorageSync('urlNotive');
			}
		},
		async getlistnum(urlList, item) {
			let i = 0;
			for (let urllist of urlList) {
				if (urllist.name == item.name) {
					return i;
				}
				i = i + 1;
			}
		},
		async deleteEvent(item) {
			if (this.urlNotive == '订阅') {
				await db.remove('site', item.name);
				plus.nativeUI.toast('删除成功!', { align: 'center', verticalAlign: 'center' });
				this.siteList = [];
				this.getAllSite();
			} else {
				let urlList = uni.getStorageSync('urlNotive');
				let delnum = await this.getlistnum(urlList, item);
				urlList.splice(delnum, 1);

				uni.setStorageSync('urlNotive', urlList);
				this.siteList = [];
				this.siteList = urlList;
			}
		}
	},
	onLoad() {
		// this.getAllSite();
	},
	onShow() {
		if (this.urlNotive == '订阅') {
			this.siteList = [];
			// this.getAllSite();
		}
	},
	onUnload() {
		this.siteList = [];
	}
};
</script>

<style lang="scss" scoped></style>
