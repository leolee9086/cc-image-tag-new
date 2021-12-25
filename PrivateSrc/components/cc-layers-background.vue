<template>
  <div class="background fixed fullscreen">
    <image class="fullscreen" :src="图像路径"> </image>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-background",
  data() {
    return {
      画板属性数组: [],
      图像路径: "",
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
  },
};
</script>
<style scoped></style>
