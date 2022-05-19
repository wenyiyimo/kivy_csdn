let that = this;
setTimeout(function() {
	that.downloadLists.splice(item, 1);
	uni.setStorageSync('downLists', that.downloadLists);
	if (that.nowDownNum > item) that.nowDownNum--;
}, 1000);
