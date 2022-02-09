<template>
  <div
    class="layer layer-graph"
    :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width}px; 
        height: ${窗口大小.height}px;
        transform-origin:0% 0%;
        `"
  >
    <div>
      <svg
        ref="background"
        :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width / $当前窗口状态.缩放倍数}px; 
        height: ${窗口大小.height / $当前窗口状态.缩放倍数}px;
        transform:scale(${$当前窗口状态.缩放倍数});
        transform-origin:0% 0%;
        z-index:10`"
        :width="窗口大小.width / $当前窗口状态.缩放倍数 || 窗口大小.width"
        :height="窗口大小.height / $当前窗口状态.缩放倍数 || 窗口大小.height"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="markerArrowTo"
            markerWidth="40"
            markerHeight="40"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill: black" />
          </marker>
          <marker
            id="markerArrowFrom"
            markerWidth="40"
            markerHeight="40"
            refX="2"
            refY="6"
            orient="auto"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill: black" />
          </marker>
        </defs>
        <cc-graph-link-path
          v-for="(link, i) in 链接数组"
          :link="链接数组[i]"
          :key="link.id + 'path'"
        />
        <path
          v-if="显示虚拟连接"
          @click=""
          v-bind:d="虚拟连接路径"
          marker-mid="url(#markerArrowFrom)"
          marker-start="url(#markerArrowFrom)"
          marker-end="url(#markerArrowTo)"
          :stroke="'darkblue'"
          :stroke-width="2"
          stroke-dasharray="15, 10, 5, 10, 15"
          fill="transparent"
        ></path>
      </svg>

      <div
        :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width / $当前窗口状态.缩放倍数}px; 
        height: ${窗口大小.height / $当前窗口状态.缩放倍数}px;
        transform:scale(${$当前窗口状态.缩放倍数});
        transform-origin:0% 0%;
       
        `"
      ></div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layer-graph",
  props: ["窗口大小", "当前鼠标坐标","链接数组"],

  data() {
    return {
      显示虚拟连接: false,
      虚拟连接起点: {},
      虚拟连接路径: "",
    };
  },
  mounted() {
  
    this.$事件总线.$on("开始连接", (event) => this.生成虚拟连接(event));
    this.$事件总线.$on("结束连接", () => (this.显示虚拟连接 = false));
  },
  watch: {
    当前鼠标坐标: {
      handler(val) {
        if (val && this.显示虚拟连接) {
          this.虚拟连接路径 = `
            M ${this.虚拟连接起点.x} ${this.虚拟连接起点.y}
            L ${(val.x + window.pageXOffset) * this.$当前窗口状态.缩放倍数} ${
            (val.y + window.pageYOffset) * this.$当前窗口状态.缩放倍数
          }
        `;
        }
      },
      deep: true,
    },
  },
  methods: {
    生成虚拟连接($event) {
      this.虚拟连接起点 = { x: $event.attrs.left, y: $event.attrs.top };
      this.显示虚拟连接 = true;
    },
  },
};
</script>
