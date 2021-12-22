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
  props: ["窗口大小"],
  components: {
    "cc-color-pane": "url:/widgets/cc-baselib/components/cc-color-pane.vue",
    "cc-graph-link-path": "url:../components/cc-graph-link-path.vue",
    "cc-dragable-block-linklabel": "url:../components/cc-dragable-block-linklabel.vue",
  },
  data() {
    return {
      显示虚拟连接: "",
      卡片数组: [],
      链接数组: [],
      卡片获取器: {},
      卡片订阅器: {},
      链接获取器: {},
      链接订阅器: {},
    };
  },
  mounted() {
    this.链接获取器 = liveQuery(() => this.$数据库.links.toArray());
    this.链接订阅器 = this.链接获取器.subscribe({
      next: (result) => {
        this.链接数组 = result;
      },
    });
    this.$事件总线.$on("开始连接", this.生成虚拟连接);
  },
  methods: {
    生成虚拟连接() {
      this.虚拟连接 = {};
      let 虚拟连接 = this.虚拟连接;
      虚拟连接.from_id = this.$数据库.get;
    },
  },
};
</script>
