<template>
  <div
    class="background fixed"
    :style="`
    position:absolute; 
    top:0px; 
    transform:scale(${窗口缩放倍数}); 
    width: ${窗口大小.width / 窗口缩放倍数}px; 
    height: ${窗口大小.height / 窗口缩放倍数}px;
    transform-origin:0% 0%; 
    z-index:-1;
    background-color:${当前背景色}`"
  >
    <div
      v-if="图像模式 == '重复'"
      :style="`
         position:absolute;
        top:0px;
        left:0px;
    background-image:url(${图像路径});
    background-repeat:repeat;
    background-size:${图像宽度 * 图像缩放倍数}px; 
    width: 100%; 
    height:100%;
    `"
    ></div>
    <image
      v-if="图像模式 == '填充' || 图像模式 == ''"
      :src="图像路径"
      fit="scale-down"
      ref="image"
      :style="`
        position:absolute;
        top:0px;
        left:0px;
          width: ${图像宽度}px; 
      transform:scale(${图像缩放倍数}); 
         transform-origin:0% 0%; 
     `"
    >
    </image>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-background",
  props: ["窗口大小"],
  data() {
    return {
      图像路径: "",
      图像缩放倍数: 1,
      图像模式: "",
      当前背景色: "",
      图像宽度: 100,
      图像高度: 100,
      画板绘制数据: [],
      窗口缩放倍数: 1,
    };
  },
  mounted() {
    this.属性获取器 = liveQuery(() =>
      this.$数据库.metadata.get("backgroundImage")
    ).subscribe({
      next: (result) => {
        result ? (this.图像路径 = result.value) : null;
      },
    });

    this.$事件总线.$on("缩放背景", ($event) => (this.图像缩放倍数 = $event));
    this.$事件总线.$on("改变背景图像模式", ($event) => (this.图像模式 = $event));
    this.$事件总线.$on("背景色改变", ($event) => (this.当前背景色 = $event));
    this.$事件总线.$on("窗口缩放", ($event) => (this.窗口缩放倍数 = $event));
  },
  watch: {
    图像路径: {
      handler(val) {
        if (val) {
          let img = new window.Image();
          img.src = val;
          img.onload = function () {
            // 打印
            this.图像宽度 = img.width;
            this.图像高度 = img.height;
            //console.log(this.图像大小);
          };
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped></style>
