<template>
	<div>
		<div style="display: flex;flex-direction: row;justify-content: center;margin-top: 1vh;">
			<canvas id="drawLine" style="position: absolute;z-index: 99;"></canvas>
			<img :src="'data:image/png;base64,' + imgpath" mode="aspectFit" />
		</div>
		<div style="margin-top: 2vh;">
			<el-card v-for="(val, index) in objectsArr" :key="index" style="margin-top: 0.5vh;">
				<div class="row-flex" style="justify-content: space-between;flex-wrap: wrap;">
					<div>对象类别:{{ detailconfig.category[val.category] ? detailconfig.category[val.category] : 'null' }}</div>
					<div>规格分类:{{ detailconfig.specification[val.specification] ? detailconfig.specification[val.specification] : 'null' }}</div>
					<div>图中图文字:{{ detailconfig.isimagetext[val.isimagetext] ? detailconfig.isimagetext[val.isimagetext] : 'null' }}</div>
					<div>文本键值:{{ detailconfig.textkey[val.textkey] ? detailconfig.textkey[val.textkey] : 'null' }}</div>
					<div>语言:{{ val.language ? detailconfig.language[val.language[0]] : null }}</div>
					<div>文本内容:{{ val.textcontent ? val.textcontent : 'null' }}</div>
					<div>位置:{{ val.position ? val.position : 'null' }}</div>
				</div>
			</el-card>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { detailconfig } from '@/utils/database.js';
import http from '@/utils/http.js';
const route = useRoute();
const imgpath = ref('');
let objectsArr = ref([]);

const drawLine = (ctx, x1, y1, x2, y2) => {
	// ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = '#ff0000';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
};
const getimgpath = async () => {
	let res = await http.get('/detail', { imgpath: route.query.imgpath });
	// temp.value = JSON.stringify(res);
	imgpath.value = res.base64img;
	let imgInfo = res.imgInfo;
	let scale = res.scale;
	objectsArr.value = res.objects;
	let mydrawLine = document.getElementById('drawLine');
	mydrawLine.width = imgInfo.width;
	mydrawLine.height = imgInfo.height;
	console.log(imgInfo);
	let ctx = mydrawLine.getContext('2d');
	for (let i = 0; i < objectsArr.value.length; i++) {
		for (let j = 0; j < objectsArr.value[i].position.length; j++) {
			if (j + 1 == objectsArr.value[i].position.length) {
				// console.log(objectsArr.value[i].position[j].x);
				let x1 = Math.round(objectsArr.value[i].position[j].x / scale);
				let y1 = Math.round(objectsArr.value[i].position[j].y / scale);

				let x2 = Math.round(objectsArr.value[i].position[0].x / scale);
				let y2 = Math.round(objectsArr.value[i].position[0].y / scale);
				// console.log([x1, y1, x2, y2]);
				drawLine(ctx, x1, y1, x2, y2);
			} else {
				let x1 = Math.round(objectsArr.value[i].position[j].x / scale);
				let y1 = Math.round(objectsArr.value[i].position[j].y / scale);
				let x2 = Math.round(objectsArr.value[i].position[j + 1].x / scale);
				let y2 = Math.round(objectsArr.value[i].position[j + 1].y / scale);
				// console.log(objectsArr.value[i].position[j].x);
				drawLine(ctx, x1, y1, x2, y2);
			}
		}
	}
};
onMounted(async () => {
	await getimgpath();
});
</script>
<style lang="scss" scoped></style>
