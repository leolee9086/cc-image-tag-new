<template>
  <v-stage class="cc-graph" ref="stage" :config="configKonva">
    <v-layer ref="layer-cards">
      <cc-graph-link-path-konva
        v-for="(link, i) in 链接数组"
        :link="link"
        :画布原点="画布原点"
      ></cc-graph-link-path-konva>
    </v-layer>
  </v-stage>
</template>
<script>
module.exports = {
  name: "cc-layers-konva-graph",
  props: ["窗口大小", "当前鼠标坐标", "画布原点"],
  components: {
    "cc-graph-link-path-konva": "url:../components/cc-graph-link-path-konva.vue",
  },
  data() {
    return {
      显示虚拟连接: false,
      卡片数组: [],
      链接数组: [],
      卡片获取器: {},
      卡片订阅器: {},
      链接获取器: {},
      链接订阅器: {},
      虚拟连接起点: {},
      虚拟连接路径: "",
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  },
  mounted() {
    this.链接获取器 = liveQuery(() => this.$数据库.links.toArray());
    this.链接订阅器 = this.链接获取器.subscribe({
      next: (result) => {
        this.链接数组 = result;
      },
    });
    this.$事件总线.$on("开始连接", (event) => this.生成虚拟连接(event));
    this.$事件总线.$on("结束连接", () => (this.显示虚拟连接 = false));
  },
  watch: {
    当前鼠标坐标: {
      handler(val) {
        if (val && this.显示虚拟连接) {
          this.虚拟连接路径 = `
            M ${this.虚拟连接起点.x} ${this.虚拟连接起点.y}
            L ${(val.x + window.pageXOffset) / this.$当前窗口状态.缩放倍数} ${
            (val.y + window.pageYOffset) / this.$当前窗口状态.缩放倍数
          }
        `;
        }
        this.configKonva = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
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
