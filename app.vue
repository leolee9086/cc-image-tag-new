<template>
  <div
    id="app"
    :style="`width: ${窗口大小.width}px; 
        height:${窗口大小.height}px;`"
    v-on:paste="黏贴内容($event)"
  >
    <div>
      <cc-layers-background
        class="layer"
        :填充图像路径="`https://img1.baidu.com/it/u=3705788448,184693213&fm=26&fmt=auto`"
      ></cc-layers-background>
      <cc-layers-toolbar
        class="layer"
        :窗口大小="窗口大小"
        :思源伺服ip="思源伺服ip"
      ></cc-layers-toolbar>
      <cc-layers-tooltip
        class="layer"
        :窗口大小="窗口大小"
        :当前鼠标坐标="当前鼠标坐标"
      ></cc-layers-tooltip>
    </div>
    <cc-layers-cards
      class="layer"
      v-on:paste="黏贴内容($event)"
      :窗口大小="窗口大小"
    ></cc-layers-cards>

    <cc-layers-graph class="layer" :窗口大小="窗口大小"></cc-layers-graph>
  </div>
</template>
<script>
module.exports = {
  name: "app",
  components: componentsList,
  beformounted: async function () {},
  mounted: async function () {
    this.初始窗口大小 = { H: window.innerHeight, W: window.innerWidth };
    window.addEventListener("mousewheel", this.计算比例);
    window.addEventListener("mousemove", this.计算坐标);
    this.主界面 = window.parent.document;
    console.log(this.主界面);
    this.思源伺服ip = window.location.host;
    console.log(this.思源伺服ip);
    console.log(this.$数据库);
    let url参数 = this.$解析url(window.location.href);
    console.log(url参数);
    if (this.$挂件模式()) {
      this.挂件自身元素 = self.frameElement.parentElement.parentElement;
    }

    //  if (数据源id)
    // {await this.打开思源数据()};
  },
  data() {
    return {
      画板列表: [],
      书签列表: "",
      新属性: { type: "原始文本", name: "newattr", label: "newattr", value: "default" },
      属性类型: ["图片", "文本", "块链接", "超链接", "原始文本", "附件"],
      数据源id: "",
      窗口大小: { width: 2000, height: 2000 },
      主界面: {},
      挂件自身元素: "",
      思源伺服ip: "",
      当前鼠标坐标: { x: "", y: "" },
    };
  },
  watch: {
    数据源id: async function (val, oldval) {
      console.log("new", val, "old", oldval);
      if (val != oldval && val && oldval) {
        this.初始化(val);
      }
    },
  },
  methods: {
    以属性查找对象(集合, 属性名, 属性值) {
      let obj = null;
      集合.forEach((card) => {
        if (card) {
          if (card[属性名] == 属性值) {
            obj = card;
          }
        }
      });
      return obj;
    },
    黏贴内容: function ($event) {
      let clipboardData = $event.clipboardData;

      if (!(clipboardData && clipboardData.items)) {
        return;
      }
      for (var i = 0, len = clipboardData.items.length; i < len; i++) {
        var item = clipboardData.items[i];
        if (item.kind === "string" && item.type == "text/plain") {
          item.getAsString((str) => {
            console.log(str);
            this.解析剪贴板内容(str + "");
          });
        }
      }
    },

    计算坐标($event) {
      this.当前鼠标坐标.x = $event.clientX;
      this.当前鼠标坐标.y = $event.clientY;
      this.保存计数器 = this.保存计数器 + 1;
      if (this.保存计数器 >= 100) {
        this.保存计数器 = 1;
      }
      this.窗口大小 = {
        width: window.pageXOffset + $event.clientX + window.innerWidth,
        height: window.pageYOffset + $event.clientY + window.innerHeight,
      };
    },
    保存数据: async function () {
      this.$事件总线.$emit("上传数据到思源", this.数据源id);
    },

    打开新窗口() {
      let 链接 = `http://${this.思源伺服ip}/widgets/cc-image-tag/?baseid=${this.$baseid}`;

      this.$窗口内打开超链接(链接);
    },
  },
};
</script>
