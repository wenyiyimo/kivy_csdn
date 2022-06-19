<template>
	<view class="search">
		<view class="header">
			<view class="header-top"></view>
			<view
				style="
          flex-direction: row;
          justify-content: space-between;
          background-color: #ffffff;
          display: flex;
		  margin-right: 10px;
		  margin-left: 10px;
        "
			>
				<uni-icons color="#000000" size="40" type="arrow-left" @click="goback" />
				<uni-search-bar
					v-model="search"
					style="width: 70%;"
					:value="search"
					placeholder="请输入搜索关键词"
					bgColor="#EEEEEE"
					cancelButton="none"
					@confirm="searchEvent"
					@clear="searchClearEvent"
					borderColor="#000000"
				></uni-search-bar>
				<text class="first-text" @click="searchEvent">搜索</text>
			</view>
		</view>
		<view class="body">
			<view v-for="(i, index) in searchlists" :key="index">
				<uni-card style="display: flex;flex-direction: column;justify-content: flex-start;margin-bottom: -5px;">
						<view style="display: flex;flex-direction: row;justify-content: space-between;" @click="navplay(i[1], 0, false)">
							<text class="first-text" style="margin-bottom: 10px;">{{ i[0] }}</text>
							<text
								class="first-text"
								style="color: #00aa00;display: flex;flex-direction: row;"
							>
								{{ i[1].length }}
							</text>
						</view>
						<scroll-view style="white-space: nowrap" scroll-x="true" show-scrollbar="false" scroll-left="120">
							<view style="display: flex;flex-direction: row;justify-content: flex-start;margin-top: 5rpx;margin-bottom: 15rpx;">
								<view v-for="(j, key) in i[1]" :key="key">
									<view class="first-text" @click="navplay(i[1], key, true)" style="background-color: #ebebeb;border-radius: 10%;margin-right: 10rpx;">
										{{ j[0].state!=0?j[0].state:''}}
									</view>
								</view>
							</view>
						</scroll-view>
				</uni-card>
			</view>
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import UniSearchBar from '@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue';
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
export default {
	components: {
		UniIcons,
		UniSearchBar,
		UniCard
	},
	data() {
		return {
		historys:null
		};
	},
	methods: {
		
	
		async goback() {
			uni.navigateBack();
		},
		
		async searchEvent() {
			if (this.search === '') {
				return false;
			} else {
				this.searchlists = [];
				for (let site of this.sitelists) {
					this.getsearchlists(site);
					// console.log(site)
				}
			}
		},
		async searchClearEvent() {
			this.search = '';
		}
	},
	onLoad: function() {
	
	}
};
</script>

<style lang="scss" scoped></style>
