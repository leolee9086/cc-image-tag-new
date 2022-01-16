<template>
  <v-stage class="cc-graph" ref="stage" :config="configKonva">
    <v-layer ref="layer-links">
      <cc-graph-link-path-konva
        v-if="link"
        v-for="(link, i) in 链接数组"
        :link="link"
        :key="链接数组[i].id + 'label'"
        :画布原点="画布原点"
      ></cc-graph-link-path-konva>
      <v-arrow v-if="显示虚拟连接" :config="虚拟连接设定"></v-arrow>
    </v-layer>
    <v-layer ref="layer-tips">
      <v-rect
        v-if="($当前窗口状态.current_linkid || $当前窗口状态.current_cardid) && 当前数据"
        :config="激活块提示设定"
      >
      </v-rect>
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
      当前数据: {},
      当前卡片id: this.$当前窗口状态.current_cardid,
      当前链接id: this.$当前窗口状态.current_linkid,
      当前网格大小: this.$当前窗口状态.gridsize,
    };
  },

  mounted() {
    this.链接获取器 = liveQuery(() => this.$数据库.links.toArray());
    this.链接订阅器 = this.链接获取器.subscribe({
      next: (result) => {
        this.链接数组 = result;
      },
    });
    this.卡片获取器 = liveQuery(() => this.$数据库.cards.toArray());
    this.卡片订阅器 = this.卡片获取器.subscribe({
      next: (result) => {
        this.卡片数组 = result;
      },
    });

    this.$事件总线.$on("开始连接", (event) => this.生成虚拟连接(event));
    this.$事件总线.$on("结束连接", () => (this.显示虚拟连接 = false));
    this.$事件总线.$on("移动卡片", ($event) => (this.当前数据 = $event));
    this.$事件总线.$on("激活数据", ($event) => (this.当前数据 = $event));
    this.$事件总线.$on("缩放卡片", ($event) => (this.当前数据 = $event));
  },

  computed: {
    虚拟连接设定: function () {
      let 真实起点x = this.虚拟连接起点.x * this.$当前窗口状态.缩放倍数 - this.画布原点.x;
      let 真实起点y = this.虚拟连接起点.y * this.$当前窗口状态.缩放倍数 - this.画布原点.y;
      return {
        points: [
          真实起点x,
          真实起点y,
          this.当前鼠标坐标.x || 0,
          this.当前鼠标坐标.y || 0,
        ],
        pointerLength: 20,
        pointerWidth: 20,
        fill: "darkblue",
        stroke: "darkblue",
        strokeWidth: 4,
        scale: this.$当前窗口状态.缩放倍数 || 1,
        dash: [15, 10, 5, 10, 15],
      };
    },
    激活块提示设定: function () {
      let attrs = this.当前数据.attrs;
      return {
        x:
          (attrs
            ? (attrs.left + attrs.offsetx) * this.$当前窗口状态.缩放倍数 - this.画布原点.x
            : this.画布原点.x) - 5,
        y:
          (attrs
            ? (attrs.top + attrs.offsety) * this.$当前窗口状态.缩放倍数 - this.画布原点.y
            : this.画布原点.y) - 5,
        width: (attrs ? attrs.width : null || 100) + 10,
        height: (attrs ? attrs.height : null || 1000) + 10,
        fill: "transparent",
        stroke: "darkblue",
        strokeWidth: 5,
        radius: 5,
        scaleX: this.$当前窗口状态.缩放倍数,
        scaleY: this.$当前窗口状态.缩放倍数,
      };
    },
  },
  watch: {
    当前鼠标坐标: {
      handler: async function (val) {
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
      this.虚拟连接起点 = {
        x: $event.attrs.left,
        y: $event.attrs.top,
      };
      this.显示虚拟连接 = true;
    },
  },
};
</script>
