<template>
  <div
    class="background fixed"
    :style="`
    position:absolute; 
    top:0px; 
    transform:scale(${$当前窗口状态.缩放倍数}); 
    width: ${窗口大小.width / $当前窗口状态.缩放倍数}px; 
    height: ${窗口大小.height / $当前窗口状态.缩放倍数}px;
    transform-origin:0% 0%; 
    z-index:-1`"
  >
    <div
    
      v-if="图像模式 == '重复'"
      :style="`
    background-image:url(${图像路径});
    background-repeat:repeat;
    width: 100%; 
    height:100%;
    `"
    ></div>
    <image
      v-if="图像模式 == '填充' || 图像模式 == ''"
      :src="图像路径"
      fit="scale-down"
      ref="image"
      :style="`transform:scale(${图像缩放倍数}); 
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
  },
};
</script>
<style scoped></style>
