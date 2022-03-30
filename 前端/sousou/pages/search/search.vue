<template>
	<list :id="parentListId" class="search" offset-accuracy="5" bounce="false" show-scrollbar="false">
		<cell><view id="head"></view></cell>
		<cell>
			<view class="main-content" :style="'height:' + pageHeight + 'px'">
				<view class="header">
					<image src="../../static/back.png" mode="aspectFit" class="header-img" @click="goBack()"></image>
					<uni-search-bar
						v-model="search"
						class="search-layout"
						:style="{ width: `${searchwidth}px` }"
						:value="search"
						placeholder="请输入搜索关键词"
						bgColor="#EEEEEE"
						cancelButton="none"
						@confirm="searchEvent"
						@clear="searchClearEvent"
						borderColor="#000000"
					></uni-search-bar>
					<text class="search-text" @click="searchEvent">搜索</text>
				</view>
				<view class="tab-data">
					<view v-for="(item, index) in tabItems" :key="index">
						<text class="tab-item" :class="[current == index ? 'tab-item-active' : '']" @click="onClickItem(index)">{{ item }}</text>
					</view>
				</view>
				<list ref="sublist" offset-accuracy="5" bounce="false" show-scrollbar="false">
					<cell class="data-item">
						<view v-if="current === 0" id="detail-item" class="detail-item" v-for="(item, index) in detailLists" :key="index">
							<view class="out-item">
								<view class="tui-list-item" @click="detailButton(item)">
									<image :src="item[2]" mode="aspectFit" class="item-img"></image>
									<view class="item-box">
										<text class="item-title">{{ item[0] }}</text>
										<text class="item-name">来源：{{ item[4] }}</text>
										<text class="item-state">状态：{{ item[3] }}</text>
									</view>
								</view>
							</view>
						</view>
						<view v-if="current === 1" id="detail-item" class="detail-item" v-for="(item, index) in nodetailLists" :key="index">
							<view class="out-item">
								<view class="tui-list-item" @click="detailButton(item)">
									<image :src="item[2]" mode="aspectFit" class="item-img"></image>
									<view class="item-box">
										<text class="item-title">{{ item[0] }}</text>
										<text class="item-name">来源：{{ item[4] }}</text>
										<text class="item-state">状态：{{ item[3] }}</text>
									</view>
								</view>
							</view>
						</view>
						<view v-if="current === 2" id="detail-item" class="detail-item" v-for="(item, index) in searchLists" :key="index">
							<view class="out-item">
								<view class="tui-list-item" @click="detailButton(item)">
									<image :src="item[2]" mode="aspectFit" class="item-img"></image>
									<view class="item-box">
										<text class="item-title">{{ item[0] }}</text>
										<text class="item-name">来源：{{ item[4] }}</text>
										<text class="item-state">状态：{{ item[3] }}</text>
									</view>
								</view>
							</view>
						</view>
					</cell>
				</list>
			</view>
		</cell>
	</list>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/request.js';
// const dom = weex.requireModule('dom');
export default {
	data() {
		return {
			tabItems: ['精确', '相关', '所有'],
			current: 0,
			searchwidth: 200,
			siteLists: [],
			search: '',
			searchLists: [],
			detailLists: [],
			nodetailLists: [],
			fullControlsWidth: null,
			fullControlsHeigt: null,
			pageHeight: 300,
			parentListId: 'parentListId'
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
	onReady() {
		this.pageHeight = uni.getSystemInfoSync().windowHeight - 40;
		uni.createSelectorQuery()
			.in(this)
			.select('#head')
			.boundingClientRect()
			.exec(rect => {
				this.$refs.sublist.setSpecialEffects({
					id: this.parentListId,
					headerHeight: rect[0].height
				});
			});
		// let that=this
		// setTimeout(function(){
		// 	const result = dom.getComponentRect(that.$refs.tabitem, option => {
		// 		console.log('getComponentRect:', option)
		// 	})
		// },5000)
	},
	methods: {
		onClickItem(index) {
			this.current = index;
		},
		async getNameLists() {
			const res = await db.getAll('site');
			if (res.flag) {
				for (let i of res.data) {
					if (i.isActive) {
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
			// this.$router.go(-1);
			uni.redirectTo({
				url: `/pages/index/index`
			});
		},
		async dealSearchLists(datas) {
			let siteName = datas[0];
			let dn = this.detailLists.length
			let nn = this.nodetailLists.length
			for (let data of datas[1]) {
				data.push(siteName);
				if (data[0] == this.search && dn <= 20) {
					this.searchLists.push(data);
					this.detailLists.push(data);
					dn = dn + 1;
				} else {
					if (data[0] != this.search && nn <= 30) {
						this.searchLists.push(data);
						this.nodetailLists.push(data);
						nn = nn + 1;
					} 
				}
			}
		},
		async searchEvent() {
			if (this.search === '') {
				return false;
			} else {
				this.searchLists = [];
				this.detailLists = [];
				this.nodetailLists = [];
				for (let site of this.siteLists) {
					let dn = this.detailLists.length
					let nn = this.nodetailLists.length
					if(dn>=20&&nn>=30){
						return
					}else{
						let siteName = site.id;
						if (siteName == 'XT') {
							const st = await http.getSearchList(site, this.search);
							if (st.flag) {
								this.dealSearchLists(st.data);
							}
						}
						if (siteName == 'APP') {
							const st = await http.appSearch(site, this.search);
							if (st.flag) {
								this.dealSearchLists(st.data);
							}
						}
					}
					
				}
			}
		},
		async searchClearEvent() {
			this.search = '';
		},
		async detailButton(item) {
			const targetHref = item[1];
			const targetImage = item[2];
			const targetTitle = item[0];
			const targetState = item[3];
			const targetName = item[4];
			const key = targetName + '@@' + item[1];
			const res = await db.get('notive', key);
			if (res.flag) {
				const targetStar = '../../static/star.png';
				const targetUserState = res.data.userState;
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				uni.navigateTo({ url: urll });
			} else {
				const targetStar = '../../static/star1.png';
				const targetUserState = '无';
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				uni.navigateTo({ url: urll });
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
	margin-top: 40px;
	flex: 1;
	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.header-img {
			height: 40px;
			width: 40px;
			margin-top: 2px;
			margin-left: 10px;
		}
		.search-layout {
			height: 50px;
		}
		.search-text {
			height: 50px;
			margin-top: 15px;
			font-size: 20px;
			margin-right: 20px;
		}
	}
	.tab-data {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.tab-item {
		font-size: 20px;
		color: #000;

		margin-bottom: 10px;
	}
	.tab-item-active {
		font-size: 20px;
		color: #00aa00;

		margin-bottom: 10px;
	}
	.data-item {
		//    position: fixed;
		// top: 105px;
		// left: 70px;
		margin-top: 0px;
		margin-left: 5px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	.out-item {
		margin-bottom: 10px;
		.tui-list-item {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.item-img {
				height: 150px;
				width: 100px;
				margin-right: 20px;
				margin-left: 20px;
			}
			.item-box {
				width: 150px;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin-right: 20px;
			}
			.item-title {
				font-size: 20px;
			}
			.item-state {
				color: #999;
				font-size: 16px;
			}
			.item-userstate {
				color: #999;
				font-size: 16px;
			}
			.item-name {
				color: #999;
				font-size: 16px;
			}
		}
	}
}
</style>
