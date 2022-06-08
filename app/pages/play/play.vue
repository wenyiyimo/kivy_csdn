<template>
	<view class="play">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;" @click="openImpSite()">播放</text>
				<uni-icons style="margin-right: 10px;" color="#000000" size="40" :type="downImage" @click="downvideo" />
			</view>
			<scroll-view style="white-space: nowrap" scroll-x="true" show-scrollbar="false" scroll-left="120">
				<view style="display: flex;flex-direction: row;justify-content: flex-start;margin-top: 5rpx;margin-bottom: 15rpx;">
					<view v-for="(item, index) in searchlists" :key="index">
						<view class="first-text" style="margin-right: 10rpx;">{{ item[0].name }}</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view style="white-space: nowrap" scroll-x="true" show-scrollbar="false" scroll-left="120">
				<view style="display: flex;flex-direction: row;justify-content: flex-start;margin-top: 5rpx;margin-bottom: 15rpx;">
					<view class="first-text" @click="nixu">逆序</view>
					<view v-for="(item, index) in playdatas" :key="index">
						<view class="first-text" style="margin-right: 10rpx;">{{ item.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="body"></view>
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
			downImage: 'arrow-down',
			sitecurrent: 0,
			tagcurrent: 0,
			playcurrent: 0,
			searchlists: [],
			playdatas: []
		};
	},
	methods: {
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		},
		nixu() {
			let temp = this.playdatas[this.tagcurrent].data;
			let tempLen = temp.length;
			for (let i = 0; i < tempLen; i++) {
				this.playdatas[this.tagcurrent]['data'][i] = temp[tempLen - i - 1];
			}
		},
		async getplaydata() {
			let site = this.searchlists[this.sitecurrent];
			if (res.data.id == 'XT') {
				let res1 = await http.getPlayData(url, res.data);
				this.playList = res1.data[1][0];
				this.playLists = res1.data[1];
				this.tagLists = res1.data[0];
				this.nowTag = this.tagLists[0];
			}
			if (res.data.id == 'APP') {
				this.siteid = 'APP';
				let res1 = await http.appPlayData(url, res.data);
				this.playList = res1.data[1][0];
				this.playLists = res1.data[1];
				this.tagLists = res1.data[0];
				this.nowTag = this.tagLists[0];
			}
		}
	},
	onLoad: function(option) {
		this.sitecurrent = Number(option.index);
		this.searchlists = uni.getStorageSync('temp');
	}
};
</script>

<style lang="scss" scoped>
.warp {
	display: grid;
	/* grid-template-columns属性定义每一列的列宽，grid-template-rows属性定义每一行的行高。 */
	grid-template-columns: repeat(auto-fill, 60rpx);
	grid-template-rows: auto;
	/* grid-gap属性是grid-column-gap和grid-row-gap的合并简写形式， 
	        grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
	        我设置的是10 行与行之间 列与列之间 都是10*/
	grid-row-gap: 10px;
	grid-column-gap: 10px;
	/* item在这个单元格中的位置justify-items属性设置单元格内容的水平位置（左中右），align-items属性设置单元格内容的垂直位置（上中下） */
	align-items: center;
	justify-items: center;
	/* justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。 */
	justify-content: space-between;
	align-content: center;
}
.item {
	border-radius: 20%;
	display: grid;
	border: 1px solid #000000;
	justify-content: center;
	align-c#f3f3f3nt: center;
	background-color: #eeeeee;
}
</style>
