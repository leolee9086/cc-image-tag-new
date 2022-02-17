<template>
  <el-drawer
    :modal="false"
    title="画笔设置"
    size="100%"
    :visible="显示"
    :show-close="false"
  >
    <v-stage ref="dragLayer" class="brushshower" :config="configshower">
      <v-layer>
        <v-circle :config="configbrush"></v-circle>
      </v-layer>
    </v-stage>
    <el-divider></el-divider>
    <el-slider v-model="画笔宽度"></el-slider>
    <cc-color-pane
      :自定义颜色数组="自定义颜色数组"
      :显示web命名颜色="true"
      v-model="当前画笔颜色"
    >
    </cc-color-pane>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-draw",
  props: ["显示"],
  data() {
    return {
      画笔宽度: 4,
      自定义颜色数组: [],
      当前画笔颜色: "black",
      configshower: {
        width: "300",
        height: "300",
      },
    };
  },
  computed: {
    configbrush: function () {
      return {
        x: 150,
        y: 150,
        radius: this.画笔宽度,
        fill: this.当前画笔颜色,
      };
    },
  },
  watch: {
    画笔宽度: {
      handler(val) {
        this.$当前窗口状态.画笔宽度 = val;
      },
      immediate: true,
    },
    当前画笔颜色: {
      handler(val) {
        this.$当前窗口状态.画笔颜色 = val;
      },
      immediate: true,
    },
  },
};
</script>
