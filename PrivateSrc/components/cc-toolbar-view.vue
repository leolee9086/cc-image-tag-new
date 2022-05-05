<template>
  <div class="toolbar toolbar-view">
    <el-slider
      v-model="窗口缩放倍数"
      vertical
      height="500px"
      :marks="比例标记"
      :format-tooltip="显示百分比"
      :max="1000"
      :min="1"
    ></el-slider>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-view",
  props: [],
  data() {
    return {
      窗口缩放倍数: 100,
      比例标记: {
        50: "50%",
        100: "100%",
        150: "150%",
        200: "200%",
        300: "300%",
        1000: "1000",
      },
    };
  },
  mounted() {
    this.$事件总线.$on("窗口缩放", ($event) =>
      $event ? (this.窗口缩放倍数 = $event * 100) : null
    );
  },
  watch: {
    窗口缩放倍数: {
      handler: function (val) {
        this.$事件总线.$emit("窗口缩放", val / 100);
      },
    },
  },
  methods: {
    显示百分比: function (val) {
      this.窗口缩放倍数 = val;
      return val + "%";
    },
  },
};
</script>
<style>
.toolbar-view {
  position: fixed;
  top: 30vh;
  height: 10vh;
  width: 3vw;
  left: 1vw;
}
</style>
