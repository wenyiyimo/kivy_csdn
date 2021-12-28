<template>
	<view class="film">
		<view class="header">
			<u-search v-model="search"
			@search="searchEvent"
			@custom="customEvent"
			:clearabled="true"
			@clear="searchClearEvent">	
			</u-search>
		</view>
		<view class="btns">
			<u-button @click="openSiteSelect" size="mini">网站: {{ site.name }}</u-button>
			<u-button @click="openTypeSelect" size="mini">分类: {{ type.name }}</u-button>
			<text>共: {{recordcount}} 资源</text>
		</view>
		<view class="body">
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="box-warter left-box-warter"
					  v-for="(item, index) in leftList"
					  :key="index"
					  @click="openDetail(item)">
					  <u-lazy-load border-radius="4" :image="item.pic" :index="index"></u-lazy-load>
					  <view class="box-name">{{ item.name }}</view>
					  <view class="box-info">
						  <view class="box-class">{{ item.type }}</view>
						  <view class="box-class">{{ item.note }}</view>
						  <view class="box-year">{{ item.year }}</view>
					  </view>
					  </view>
				</template>
				<template v-slot:right="{ rightList }">
				  <view class="box-warter right-box-warter"
				    v-for="(item, index) in rightList"
				    :key="index" 
					@click="openDetail(item)">
				    <u-lazy-load threshold="-450" border-radius="4"
					:image="item.pic" :index="index"></u-lazy-load>
				    <view class="box-name">{{ item.name }}</view>
				    <view class="box-info">
				      <view class="box-class">{{ item.type }}</view>
					  <view class="box-class">{{ item.note }}</view>
				      <view class="box-year">{{ item.year }}</view>
				    </view>
				  </view>
				</template>
			</u-waterfall>
			<u-loadmore
			  bg-color="#f8f8f8"
			  :status="loadStatus"
			  @loadmore="addData"
			></u-loadmore>
		</view>
		<u-back-top :scroll-top="scrollTop" icon="search"></u-back-top>
		<u-select v-model="siteShow" :list="siteList" value-name="key" label-name="name"
		@confirm="siteConfirm"></u-select>
		<u-select v-model="typeShow" :list="typeList" value-name="tid" label-name="name"
		@confirm="typeConfirm"></u-select>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-mask :show="mask" @tap.stop>
		  <view class="mask">
		    <u-loading mode="flower" size="80"></u-loading>
		  </view>
		</u-mask>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				search: "",
				site: {},
				siteShow: false,
				siteList: [],
				type: {},
				typeShow: false,
				typeList: [],
				flowList: [],
				loadStatus: "loadmore",
				scrollTop: 0,
				pageCount: 0,
				recordcount: 0,
				mask: false,
				r18KeyWords: ['写真',]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.film {
	  padding: 20rpx 20rpx;
	  background-color: #f8f8f8;
	  .btns {
	    margin-top: 10rpx;
	    display: flex;
	    justify-content: space-around;
	    align-items: center;
	  }
	  .body {
	    .box-warter {
	      border-radius: 8rpx;
	      padding: 14rpx;
	      background-color: #fff;
	      .box-info {
	        margin-top: 10rpx;
	        display: flex;
	        justify-content: space-between;
	        font-size: 12px;
	      }
	    }
	    .left-box-warter {
	      margin: 10rpx 10rpx 10rpx 0;
	    }
	    .right-box-warter {
	      margin: 10rpx 0rpx 10rpx 10rpx;
	    }
	  }
	  .mask{
	    width: 100%;
	    height: 100%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	  }
	}

</style>
