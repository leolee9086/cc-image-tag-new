<template>
  <v-stage
    @mousedown="绘制中 = true"
    @mouseup="绘制中 = false"
    @mousemove="绘制($event)"
    class="cc-block-card-draw"
    ref="draw"
    :config="configDraw()"
  >
    <v-layer>
      <v-line v-for="绘制 in draw" :config="lineConfig(绘制)"></v-line>
      <v-line :config="tempLineConfig"></v-line>
    </v-layer>
  </v-stage>
</template>
<script>
module.exports = {
  name: "cc-draw",
  props: ["宽度", "高度", "value", "窗口缩放倍数"],
  data() {
    return {
      临时点数组: [],
      绘制中: false,
      draw: this.value,
    };
  },
  watch: {
    绘制中(val, oldval) {
      if (!val) {
        !this.draw ? (this.draw = []) : null;
        this.draw.push({
          points: this.临时点数组,
          stroke: this.$当前窗口状态.画笔颜色,
          strokeWidth: this.$当前窗口状态.画笔宽度,
        });
        this.临时点数组 = [];
      }
      this.$emit("change", this.draw);
    },
  },
  computed: {
    tempLineConfig: function () {
      return {
        x: 0,
        y: 0,
        closed: false,
        points: this.临时点数组,
        stroke: this.$当前窗口状态.画笔颜色 || "black",
        lineCap: "round",
        strokeWidth: this.$当前窗口状态.画笔宽度 || 5,
        scaleX: this.窗口缩放倍数 || 1,
        scaleY: this.窗口缩放倍数 || 1,
      };
    },
  },
  methods: {
    configDraw: function () {
      let 窗口缩放倍数 = this.窗口缩放倍数 || 1;
      return {
        width: 宽度 * 窗口缩放倍数 || 100,
        height: 高度 * 窗口缩放倍数 || 100,
        scaleX: 窗口缩放倍数 || 1,
        scaleY: 窗口缩放倍数 || 1,
      };
    },

    lineConfig: function (线定义) {
      return {
        x: 0,
        y: 0,
        points: 线定义.points,
        closed: false,
        stroke: 线定义.stroke,
        lineCap: "round",
        strokeWidth: 线定义.strokeWidth,
        scaleX: this.窗口缩放倍数 || 1,
        scaleY: this.窗口缩放倍数 || 1,
      };
    },
    绘制($event) {
      let evt = $event.evt;
      evt.stopPropagation();
      //////console.log(evt.offsetX);
      let 临时点数组 = this.临时点数组;
      if (this.绘制中 && this.$当前窗口状态.is_drawing) {
        let 点 = [evt.offsetX, evt.offsetY];
        if (this.窗口缩放倍数) {
          点 = [
            点[0] / this.窗口缩放倍数 / this.窗口缩放倍数,
            点[1] / this.窗口缩放倍数 / this.窗口缩放倍数,
          ];
        }
        let 上一个点 = [
          临时点数组[临时点数组.length - 1],
          临时点数组[临时点数组.length - 2],
        ];
        if (上一个点[1]) {
          let 距离 = [点[0] - 上一个点[0], 点[1] - 上一个点[1]];

          let 真实点 = [上一个点[0] + 距离[0], 上一个点[1] + 距离[1]];
          点 = 真实点;
        }
        this.临时点数组 = this.临时点数组.concat(点);
      }
    },
  },
};
</script>
