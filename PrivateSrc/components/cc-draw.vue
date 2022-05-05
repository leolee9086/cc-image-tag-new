<template @mousemove="中止冒泡($event)">
  <v-stage
    :style="konvastyle"
    @mousedown="绘制中 = true"
    @mouseup="绘制中 = false"
    @touchstart="绘制中 = true"
    @touchstop="绘制中 = false"
    class="cc-block-card-draw"
    ref="draw"
    :config="configDraw()"
    @click="添加图形($event)"
    @mousemove="绘制($event)"
    @touchmove="绘制($event)"
  >
    <v-layer>
      <v-line
        v-for="(绘制, i) in draw"
        v-if="绘制 && (绘制.points || 绘制.type == 'line')"
        @dragend="handleDragEnd($event, i)"
        :config="lineConfig(绘制)"
        :key="i"
        @mousemove="清除($event, i)"
      ></v-line>
      <template v-for="(geom, i) in draw">
        <v-rect
          v-if="geom && geom.type == 'rect'"
          :config="geom['config']"
          @dragend="handleDragEnd($event, i)"
          @mousemove="清除($event, i)"
        ></v-rect>
      </template>
      <v-circle
        v-if="
          当前鼠标坐标 &&
          $当前窗口状态.is_drawing &&
          $当前窗口状态.drawing_mode == 'brush'
        "
        :config="configBrush()"
      ></v-circle>
      <v-line :config="tempLineConfig"></v-line>
    </v-layer>
  </v-stage>
</template>
<script>
module.exports = {
  name: "cc-draw",
  props: ["宽度", "高度", "画布原点", "value", "当前鼠标坐标", "窗口缩放倍数"],
  model: { prop: "value", event: "change" },

  data() {
    return {
      临时点数组: [],
      绘制中: false,
      draw: this.value,
    };
  },
  watch: {
    value(val, oldval) {
      this.draw = val || [];
    },
    绘制中(val, oldval) {
      if (!val) {
        !this.draw ? (this.draw = []) : null;
        let line = {};
        line.type = "line";
        line.config = this.tempLineConfig;
        line.config.draggable = true;
        this.draw.push(line);
        this.临时点数组 = [];
      }
      this.$emit("change", this.draw);
    },
  },
  computed: {
    坐标数组() {
      let 宽度坐标数组 = this.生成自然数数组(this.宽度方向画板数量);
      let 高度坐标数组 = this.生成自然数数组(this.宽度方向画板数量);
      //console.log(宽度坐标数组, 高度坐标数组);
      let 数组 = [];
      宽度坐标数组.forEach((宽度序号) => {
        高度坐标数组.forEach((高度序号) => {
          数组.push([宽度序号, 高度序号]);
        });
      });
      return 数组;
    },
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
    konvastyle: function () {
      let configKonva = this.configDraw();
      if (configKonva.x == 0 && configKonva.y == 0) {
        return "position:absolute;touch-action:none";
      } else {
        return "position:fixed !important;top:0;left:0;touch-action:none";
      }
    },
    生成自然数数组(自然数) {
      let 数组 = new Array(自然数);
      for (let i = 0, len = 数组.length; i < len; i++) {
        数组[i] = i;
      }
      return 数组;
    },
    清除($event, i) {
      let evt = $event.evt;
      if (evt.altKey || this.$当前窗口状态.drawing_mode == "eraser") {
        this.draw[i] = undefined;
        this.$emit("change", this.draw);
      }
    },
    handleDragEnd: function ($event, 序号) {
      //console.log($event.target, 序号);
      let geom = this.draw[序号];
      //console.log(geom);
      let attrs = $event.target.attrs;
      if (geom) {
        geom.x = attrs.x;
        geom.y = attrs.y;

        geom.config.x = attrs.x;
        geom.config.y = attrs.y;
      }
      this.$emit("change", this.draw);
    },
    中止冒泡: function ($event) {
      let evt = $event.evt;
      evt.stopPropagation();
    },
    configBrush: function () {
      return {
        x: (this.当前鼠标坐标.x + this.画布原点.x) / this.窗口缩放倍数,
        y: (this.当前鼠标坐标.y + this.画布原点.y) / this.窗口缩放倍数,
        radius: this.$当前窗口状态.画笔宽度 / 2,
        fill: this.$当前窗口状态.画笔颜色 || "black",
        stroke: "lightblue",
      };
    },
    configDraw: function () {
      let 窗口缩放倍数 = this.窗口缩放倍数 || 1;
      let newconfigDraw = {
        x: 0 - Math.max(0, this.画布原点.x || 0 - 5000),
        y: 0 - Math.max(0, this.画布原点.y || 0 - 5000),
        width: Math.min(window.innerWidth, this.宽度),
        height: Math.min(window.innerHeight, this.高度),
        scaleX: 窗口缩放倍数 || 1,
        scaleY: 窗口缩放倍数 || 1,
      };
      return newconfigDraw;
    },

    lineConfig: function (线定义) {
      return 线定义.config
        ? JSON.parse(JSON.stringify(线定义.config))
        : {
            x: 线定义.x || 0,
            y: 线定义.y || 0,
            points: 线定义.points,
            closed: false,
            stroke: 线定义.stroke,
            lineCap: "round",
            strokeWidth: 线定义.strokeWidth,
            scaleX: this.窗口缩放倍数 || 1,
            scaleY: this.窗口缩放倍数 || 1,
            draggable: true,
          };
    },
    添加图形($event) {
      if (!this.$当前窗口状态.当前图形类型) {
        return null;
      }
      let evt = $event.evt;
      let 点 = [evt.offsetX, evt.offsetY];

      if (this.窗口缩放倍数) {
        点 = [
          点[0] / this.窗口缩放倍数 / this.窗口缩放倍数,
          点[1] / this.窗口缩放倍数 / this.窗口缩放倍数,
        ];
      }
      if (!this.$当前窗口状态.当前图形类型) {
        return null;
      }
      evt.stopPropagation();
      let 图形 = {};
      图形.type = "rect";
      图形.config = {
        x: 点[0] + 0,
        y: 点[1] + 0,
        width: 100,
        height: 100,
        fill: "red",
        shadowBlur: 10,
        draggable: true,
      };
      this.draw.push(图形);
      this.$emit("change", this.draw);
    },
    绘制($event) {
      let evt = $event.evt;
      console.log(evt);
      if (evt.altKey) {
        return null;
      }
      if (evt.shiftKey) {
        return null;
      }
      if (this.$当前窗口状态.drawing_mode !== "brush") {
        return null;
      }
      let 临时点数组 = this.临时点数组;

      if (this.绘制中 && this.$当前窗口状态.is_drawing) {
        evt.stopPropagation();
        evt.preventDefault();
        let 点 = [evt.offsetX + this.画布原点.x || 0, evt.offsetY + this.画布原点.y || 0];
        if (evt.touches) {
          let touche = evt.touches[0];
          点 = [
            touche.clientX + this.画布原点.x || 0,
            touche.clientY + this.画布原点.y || 0,
          ];
        }
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
