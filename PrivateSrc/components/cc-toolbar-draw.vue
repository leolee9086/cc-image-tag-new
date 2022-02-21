<template>
  <div
    style="
      border: solid 0.01vw;
      border-radius: 50px;
      position: fixed;
      top: 1vh;
      left: calc(50vw - 150px);
      background-color: white;
      z-index: 251;
      padding: 2px;
      width: 300px;
      justify-content: center;
    "
    :show-close="false"
  >
    <el-row>
      <el-col :span="6">
        <el-popover trigger="click" :width="500">
          <v-stage
            ref="dragLayer"
            class="brushshower"
            slot="reference"
            :config="configshower"
          >
            <v-layer>
              <v-circle :config="configbrush"></v-circle>
            </v-layer>
          </v-stage>
          <el-divider></el-divider>
          <el-slider v-model="画笔宽度" :min="1" :max="21"></el-slider>
          <cc-color-pane
            :自定义颜色数组="自定义颜色数组"
            :显示web命名颜色="true"
            v-model="当前画笔颜色"
          >
          </cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="6">
        <div class="drawer-button draw">
          <span
            @click="绘制模式 != '绘制' ? (绘制模式 = '绘制') : (绘制模式 = '')"
            circle
            class="el-icon-edit"
            aria-label="展开|关闭面板"
            :style="`
          background-color:${当前按钮名称 == '绘制' ? 'lightblue' : 'transparent'};
        
          `"
          >
          </span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="drawer-button draw">
          <span
            @click="绘制模式 != '移动' ? (绘制模式 = '移动') : (绘制模式 = '')"
            circle
            class="el-icon-rank"
            aria-label="移动绘制元素"
            :style="`
          background-color:${当前按钮名称 == '移动' ? 'lightblue' : 'transparent'};
        
          `"
          >
          </span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="drawer-button draw">
          <span
            @click="绘制模式 != '删除' ? (绘制模式 = '删除') : (绘制模式 = '')"
            circle
            class="el-icon-eraser"
            aria-label="删除绘制元素"
            :style="`
          background-color:${当前按钮名称 == '删除' ? 'lightblue' : 'transparent'};
        
          `"
          >
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
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
        width: "42",
        height: "42",
      },
      绘制模式: "",
      当前按钮名称: "",
    };
  },
  computed: {
    configbrush: function () {
      return {
        x: 21,
        y: 21,
        radius: this.画笔宽度 / 2,
        fill: this.当前画笔颜色,
      };
    },
  },
  mounted() {
    this.$事件总线.$on("结束绘制", this.结束绘制);
  },
  methods: {
    结束绘制() {
      this.当前按钮名称 = "";
      this.绘制模式 = "";
    },
  },
  watch: {
    绘制模式: {
      handler(val) {
        switch (val) {
          case "绘制":
            this.$当前窗口状态.is_drawing = true;
            this.当前按钮名称 = "绘制";
            this.$当前窗口状态.drawing_mode = "brush";
            break;
          case "移动":
            this.$当前窗口状态.is_drawing = true;
            this.$当前窗口状态.drawing_mode = "move";
            this.当前按钮名称 = "移动";
            break;
          case "删除":
            this.$当前窗口状态.is_drawing = true;
            this.$当前窗口状态.drawing_mode = "eraser";
            this.当前按钮名称 = "删除";
            break;
          default:
            this.$当前窗口状态.is_drawing = false;
            this.$当前窗口状态.drawing_mode = "";
            this.当前按钮名称 = "";
            break;
        }
      },
    },
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
<style>
.drawer-button.draw {
  margin-top: 0;
  margin-bottom: 0;
}
.drawer-button.draw span {
  border-radius: 50%;
  padding: 2px;
  border: 1px rgb(255, 255, 255) solid;
}
</style>
