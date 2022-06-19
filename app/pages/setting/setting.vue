<template>
	<view class="setting">
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
				<text class="first-text" style="margin-top: 5rpx" @click="openimport">设置</text>
				<text></text>
			</view>
		<view class="body">
			<view @click="openImpSite()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">导入订阅</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">自动更新站源</text>
			</view>
			<view class="impSite" v-if="impSite">
				<input class="inputtext" maxlength="-1" style="width: 70%;" v-model="url" type="text" placeholder="请导入JSON数据" />
				<button class="inputbutton" @click="importSiteEvent">导入</button>
			</view>
			<view @click="showstartchange()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">跳过片头</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">跳过{{ initialtime }}秒</text>
			</view>
			<view class="impSite" v-if="showstart">
				<input class="inputtext" maxlength="-1" :style="{ width: `${searchwidth}px` }" v-model="initialtimeinput" type="number" placeholder="请输入跳过时间(秒)" />
				<button class="inputbutton" @click="changeplaystarttime()">导入</button>
			</view>
			
			<view @click="deleteurl()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">重置订阅</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">删除所有订阅</text>
			</view>
			<view @click="deletesite()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">重置站源</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">删除所有站源</text>
			</view>
			
			<view @click="deletehistory()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">重置历史</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">清空历史记录</text>
			</view>
			
			<view @click="deleteapp()" style="display: flex;flex-direction: row;justify-content: space-between;">
				<text style="font-size: 20px;margin: 10px;">重置软件</text>
				<text style="font-size: 20px;color: #b4b4b4;margin: 10px;">清空所有数据</text>
			</view>
		</view>
	</view>
</template>
<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
export default {
	components: {
		UniIcons,
		UniCard
	},
	data() {
		return {
			impSite: false,
			initialtime: 0,
			initialtimeinput: null,
			showstart: false,
			url:''
		};
	},

	methods: {
		
		showstartchange() {
			this.showstart = !this.showstart;
		},
		changeplaystarttime() {
			if (!this.initialtimeinput) {
				plus.nativeUI.toast('您未输入任何值!', { align: 'center', verticalAlign: 'center' });
				this.showstart = false;
				return;
			}
			uni.setStorageSync('initialtime', this.initialtimeinput);
			this.initialtime = this.initialtimeinput;
			this.showstart = false;
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
						uni.showToast({
							title: '格式错误!',
							duration: 2000
						});
					}
				}

				this.impSite = false;
				this.url = '';
				plus.nativeUI.toast('导入成功!', { align: 'center', verticalAlign: 'center' });
				return false;
			}
			plus.nativeUI.toast('导入失败!', { align: 'center', verticalAlign: 'center' });
		},
		async deleteurl() {
			uni.showModal({
				content: '确认要清空所有订阅吗？',
				success: function(res) {
					if (res.confirm) {
						uni.setStorageSync('urlNotive', []);
						plus.nativeUI.toast('订阅已清空!', { align: 'center', verticalAlign: 'center' });
					}
				}
			});
		},
		async deletesite() {
			uni.showModal({
				content: '确认要清空所有站源吗？',
				success: function(res) {
					if (res.confirm) {
						uni.setStorageSync('sites', []);
						plus.nativeUI.toast('站源已清空!', { align: 'center', verticalAlign: 'center' });
					}
				}
			});
		},
		async deletehistory() {
			uni.showModal({
				content: '确认要所有清空历史记录吗？',
				success: function(res) {
					if (res.confirm) {
						uni.setStorageSync('historys', []);
						plus.nativeUI.toast('历史已清空!', { align: 'center', verticalAlign: 'center' });
					}
				}
			});
		},
		async deleteapp() {
			uni.showModal({
				content: '确认要重置APP吗？',
				success: function(res) {
					if (res.confirm) {
						db.reset();
						plus.nativeUI.toast('APP已重置!', { align: 'center', verticalAlign: 'center' });
					}
				}
			});
		},
		pageBacked() {
			// this.$router.go(-1);
			let urll = `/pages/index/index`;
			uni.navigateTo({ url: urll });
		}
	},
	onLoad() {		this.initialtime = uni.getStorageSync('initialtime');},
	onShow() {
		
	},
	onUnload() {}
};
</script>

<style lang="scss" scoped>
.impSite {
	display: flex;
	margin-top: 5px;
	flex-direction: row;
	margin-bottom: 5px;
	margin-left: 10px;
	margin-right: 10px;
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
</style>

