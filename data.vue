<view class="data-item" v-for="(item, index) in list" :key="index">
	<view class="out-item">
		<view class="tui-list-item" @click="handlerButton(item)">
			<image :src="item.image" mode="aspectFit" class="item-img"></image>
			<view class="item-box">
				<text class="item-title">{{ item.title }}</text>
				<text class="item-name">来源：{{ item.name }}</text>
				<text class="item-state">状态：{{ item.state }}</text>
				<text class="item-userstate">上次观看：{{ item.userState }}</text>
			</view>
		</view>
	</view>
</view>

.data-item {
	margin-top: 5px;
	margin-bottom: 5px;
	.out-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.tui-list-item {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			.item-img {
				height: 120px;
				width: 90px;
				margin-right: 20px;
				margin-left: 20px;
			}

			.item-box {
				width: 250px;
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
		.removeNotice {
			height: 30px;
			width: 30px;
			margin-top: 50px;
			margin-right: 10px;
		}
	}
}
