<template>
	<view class="search">
		<u-sticky :offset-top="-50">
			<view class="header">
				<image src="../../static/back.png" mode="aspectFit" class="header-img" @click="goBack()"></image>
				<u-search v-model="search" @search="searchEvent" @custom="searchEvent" :clearabled="true" @clear="searchClearEvent" borderColor="#000000"></u-search>
			</view>
		</u-sticky>
		<view class="body">
			<view class="tab-item">
				<view class="tab-data" v-for="(item, index) in nameLists" :key="index">
					<u-button class="item-title" size="mini" :ripple="true" @click="tabSearch(index)">{{ item }}</u-button>
				</view>
			</view>
			<view class="data-item">
				<view class="detail-item" v-for="(item, index) in detailLists" :key="index">
					<view class="out-item">
						<view class="tui-list-item" @click="detailButton(item)">
							<image :src="item[2]" mode="aspectFit" class="item-img"></image>
							<view class="item-box">
								<view class="item-title">{{ item[0] }}</view>
								<view class="item-name">来源：{{ nameLists[searchNum] }}</view>
								<view class="item-state">状态：{{ item[3] }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/request.js';
export default {
	data() {
		return {
			siteLists: [],
			nameLists: [],
			search: '',
			searchLists: [],
			detailLists: [],
			searchNum: 0
		};
	},
	methods: {
		async getNameLists() {
			const res = await db.getAll('site');
			if (res.flag) {
				for (let i of res.data) {
					if (i.isActive) {
						this.nameLists.push(i.name);
						this.siteLists.push(i);
					}
				}
				this.searchEvent();
			} else {
				this.$refs.uToast.show({ title: '读取视频源出错', type: 'warning', duration: '2300' });
				return false;
			}
		},
		async goBack() {
			this.$router.go(-1);
		},
		async searchEvent() {
			if (this.search === '') {
				return false;
			} else {
				const st = await http.getSearchList(this.siteLists[this.searchNum], this.search);
				this.searchLists.push(st.data);
				this.detailLists = st.data[1];
			}
		},
		async searchClearEvent() {
			this.search = '';
			this.searchLists = [];
			this.detailLists = [];
			this.searchNum = 0;
		},
		async tabSearch(index) {
			this.searchNum = index;
			let flag = false;
			for (let i of this.searchLists) {
				if (i[0] === this.nameLists[this.searchNum]) {
					this.detailLists = i[1];
					flag = true;
				}
			}
			if (!flag) {
				this.searchEvent();
			}
		},
		async detailButton(item){
			const targetHref = item[1];
			const targetImage = item[2];
			const targetTitle = item[0];
			const targetState = item[3];
			const targetName =this.nameLists[this.searchNum];
			const key=targetName+"@@"+item[1];
			const res=await db.get('notive',key);
			if(res.flag){
				const targetStar = 'static/star.png';
				const targetUserState = res.data.userState;
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				this.$u.route({ url: urll });
			}else{
				const targetStar = 'static/star1.png';
				const targetUserState = '无';
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				this.$u.route({ url: urll });
			}
			
		}
	},
	onLoad: function(option) {
		this.search = option.search;
		this.getNameLists();
	}
};
</script>

<style lang="scss" scoped>
.search {
	padding: 20rpx 10rpx;
	background-color: #f8f8f8;
	.header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: item;

		.header-img {
			height: 60rpx;
			width: 60rpx;
			margin-right: 10rpx;
			display: block;
		}
	}
	.body {
		padding: 20rpx 10rpx;
		display: flex;
		.tab-item {
			width: 120rpx;
			margin-top: 20rpx;
			margin-left: 10rpx;
			.tab-data {
				margin-top: 25rpx;
			}
		}
		.data-item {
			width: 600rpx;
			margin-top: 10rpx;
			margin-left: 10rpx;
			flex: 1;
			.out-item {
				padding: 10rpx 10rpx;
				display: flex;
				align-items: item;
				.tui-list-item {
					padding: 30rpx 30rpx;
					display: flex;
					align-items: item;
					.item-img {
						height: 150rpx;
						width: 150rpx;
						margin-right: 20rpx;
						display: block;
					}
					.item-box {
						flex: 1;
						width: 95%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					.item-title {
						font-size: 32rpx;
						word-wrap: break-word;
					}
					.item-state {
						color: #999;
						font-size: 24rpx;
						display: flex;
					}
					.item-userstate {
						color: #999;
						font-size: 24rpx;
					}
					.item-name {
						color: #999;
						font-size: 24rpx;
					}
				}
				.removeNotice {
					height: 50rpx;
					width: 50rpx;
					margin-top: auto;
					margin-bottom: auto;
					margin-left: auto;
				}
			}
		}
	}
}
</style>
