<template>
	<view class="site">
		<view class="header">
			<view class="goBack"><image src="../../static/back.png" mode="aspectFit" class="back-img" @click="pageBacked()"></image></view>
			<view class="import-site">
				<view class="importBtn" @click="openImpSite()">站源管理</view>
				<view class="impSite" maxlength="300" v-if="impSite">
					<u-input v-model="url" type="text" :border="true" placeholder="请输入 JSON 后缀的网址" />
					<u-button :ripple="true" @click="importSiteEvent()">导入</u-button>
				</view>
			</view>
		</view>
		<view class="body">
			<u-cell-group class="cell-group">
				<u-cell-item v-for="(i, j) in siteList" :key="j" :title="i.name" :arrow="false" class="item-group">
					<u-button class="delete" size="mini" :ripple="true" @click="deleteEvent(i)">删除</u-button>
					<u-button class="pushpin" size="mini" :ripple="true" @click="pushpinEvent(i, j)">置顶</u-button>
					<u-switch slot="right-icon" v-model="i.isActive" @change="switchChange(i)" size="40" active-color="#c7ccce"></u-switch>
				</u-cell-item>
			</u-cell-group>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/request.js';
export default {
	data() {
		return {
			siteList: [],
			site: [],
			impSite: false,
			url: ''
		};
	},
	methods: {
		pageBacked() {
			this.$router.go(-1);
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
					await db.add('site', i);
				}
				this.getAllSite();
				this.impSite = false;
				this.$refs.uToast.show({ title: '导入成功', type: 'success', duration: '2300' });
				return false;
			}
			this.$refs.uToast.show({ title: '导入失败', type: 'warning', duration: '2300' });
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
			this.$refs.uToast.show({ title: '置顶成功', type: 'success', duration: '2300' });
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
			await db.remove('site', e.name);
			const res = await db.add('site', e);
			await this.getAllSite();
			if (res.flag) {
				this.$refs.uToast.show({ title: '修改成功', type: 'success', duration: '2300' });
			}
		},
		async deleteEvent(item){
			await db.remove('site', item.name);
			this.$refs.uToast.show({ title: '删除成功', type: 'success', duration: '2300' });
			this.$router.go(0);
		}
	},
	onLoad() {
		this.getAllSite();
	}
};
</script>

<style lang="scss" scoped>
.site {
	padding: 20rpx 20rpx;
	background-color: #f8f8f8;
	.header {
		flex-direction: row;
		align-items: item;
		width: 100%;
		.goBack {
			height: 30rpx;
			width: 20rpx;
			padding-left: 10rpx;

			.back-img {
				height: 60rpx;
				width: 60rpx;
			}
		}
		.import-site {
			.importBtn {
				margin-left: 300rpx;
				margin-top: -20rpx;
			}
			.impSite {
				display: flex;
				margin-top: 20rpx;
				width: 100%;
			}
		}
	}
	.body {
		margin-top: 30rpx;
		.item-group {
			margin-top: -20rpx;
			margin-bottom: -30rpx;
			.url-name {
				size: 50rpx;
			}
			.pushpin {
				margin-right: 30rpx;
			}
			.delete {
				margin-right: 30rpx;
			}
		}
	}
}
</style>
