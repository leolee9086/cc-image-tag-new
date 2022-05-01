<template>
  <v-stage class="cc-graph" ref="stage" :config="configKonva()" :style="konvastyle">
    <v-layer ref="layer-links">
      <cc-graph-link-path-konva
        v-if="link"
        v-for="(link, i) in 链接数组"
        :link="link"
        :key="链接数组[i].id + 'label'"
        :画布原点="画布原点"
      ></cc-graph-link-path-konva>
      <v-arrow v-if="显示虚拟连接" :config="虚拟连接设定"> </v-arrow>
      <cc-graph-link-path-konva
        v-for="数据 in 当前数据集合"
        :link="生成父子连接线(数据)"
        v-if="数据.id != 数据.parent_id"
        :画布原点="画布原点"
      ></cc-graph-link-path-konva>
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
  props: ["窗口大小", "当前鼠标坐标", "画布原点", "卡片数组", "链接数组"],

  data() {
    return {
      显示虚拟连接: false,

      虚拟连接起点: {},
      虚拟连接路径: "",

      当前数据: {},
      当前卡片id: this.$当前窗口状态.current_cardid,
      当前链接id: this.$当前窗口状态.current_linkid,
      当前网格大小: this.$当前窗口状态.gridsize,
      当前数据集合: [],
    };
  },

  mounted() {
    this.$事件总线.$on("选中数据集合", (event) => (this.当前数据集合 = event));
    this.$事件总线.$on("清理选择", (event) => (this.当前数据集合 = []));

    this.$事件总线.$on("开始连接", (event) => this.生成虚拟连接(event));
    this.$事件总线.$on("结束连接", () => (this.显示虚拟连接 = false));
    this.$事件总线.$on("移动卡片", ($event) =>
      $event ? (this.当前数据 = $event) : null
    );
    this.$事件总线.$on("激活数据", ($event) =>
      $event && !$event.attrsproxy ? (this.当前数据 = $event) : null
    );
    this.$事件总线.$on("缩放卡片", ($event) =>
      $event && !$event.attrsproxy ? (this.当前数据 = $event) : null
    );
    this.$事件总线.$on("保存数据", ($event) =>
      $event.id == this.当前数据.id && !$event.attrsproxy
        ? (this.当前数据 = $event)
        : null
    );
  },

  computed: {
    konvastyle: function () {
      let configKonva = this.configKonva();
      if (configKonva.x == 0 && configKonva.y == 0) {
        return "position:absolute";
      } else {
        return "position:fixed !important;top:0;left:0";
      }
    },
    虚拟连接设定: function () {
      let 真实起点x = this.虚拟连接起点.x * this.$当前窗口状态.缩放倍数 || 1;
      let 真实起点y = this.虚拟连接起点.y * this.$当前窗口状态.缩放倍数 || 1;
      return {
        points: [
          真实起点x,
          真实起点y,
          this.当前鼠标坐标.x + this.画布原点.x || 0,
          this.当前鼠标坐标.y + this.画布原点.y || 0,
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
            ? (attrs.left + attrs.offsetx) * this.$当前窗口状态.缩放倍数
            : this.$当前窗口状态.缩放倍数) - 5,
        y:
          (attrs
            ? (attrs.top + attrs.offsety) * this.$当前窗口状态.缩放倍数
            : this.画布原点.y) - 5,
        width: (attrs ? attrs.width : null || 100) + 10,
        height: (attrs ? attrs.height : null || 1000) + 10,
        fill: "transparent",
        stroke: "darkblue",
        strokeWidth: 4,
        radius: 5,
        scaleX: this.$当前窗口状态.缩放倍数,
        scaleY: this.$当前窗口状态.缩放倍数,
      };
    },
  },

  methods: {
    configKonva: function () {
      return {
        x: 0 - Math.max(0, this.画布原点.x || 0 - 5000),
        y: 0 - Math.max(0, this.画布原点.y || 0 - 5000),
        width: Math.min(this.窗口大小.width, 5000),
        height: Math.min(this.窗口大小.height, 5000),
      };
    },
    生成虚拟连接($event) {
      this.虚拟连接起点 = {
        x: $event.attrs.left,
        y: $event.attrs.top,
      };
      this.显示虚拟连接 = true;
    },
    生成父子连接线(数据) {
      let 属性对象 = {
        from_id: 数据.parent_id,
        to_id: 数据.id,
      };

      let 虚拟连接 = this.$根据属性生成链接(属性对象);
      虚拟连接 = this.$填充默认值(虚拟连接);
      虚拟连接.virtual = true;
      虚拟连接.attrs.path_type = "简单曲线";
      虚拟连接.attrs.path_dash = [15, 10, 5, 10, 15];
      虚拟连接.attrs.path_color = "lightblue";
      虚拟连接.attrs.mid_anchor_image = "none";
      虚拟连接.id = 数据.parent_id + 数据.id;
      return 虚拟连接;
    },
  },
};
</script>
