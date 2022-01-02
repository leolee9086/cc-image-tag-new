<template>
  <vue-draggable-resizable
    v-if="!hide"
    ref="container"
    :resizable="显示控制柄"
    :draggable="!正在编辑"
    @activated="激活 = true"
    @deactivated="激活 = false"
    @dragging="dragging"
    @dragstop="dragstop"
    @resizing="resizing"
    @resizestop="resizestop"
    :y="top"
    :w="width || 对象数据.attrs.width * 窗口缩放倍数 || 100"
    :h="height || 对象数据.attrs.height * 窗口缩放倍数 || 100"
    :x="left"
    :z="210"
    class-name-handle="resizer"
    class-name="cc-card-container"
  >
    <div
      :data-node-id="对象数据.id"
      :type="数据类型"
      :subtype="对象数据.subtype"
      class="cc-card-main"
      :style="`
      transform-origin:0% 0%;
      transform:scale(${窗口缩放倍数}) 
      `"
    >
      <el-popover
        popper-class="tagpoper"
        trigger="hover"
        :open-delay="300"
        placement="right"
        :width="100"
        v-if="对象数据.attrs.folded"
      >
        <div
          class="cc-card-body folded"
          slot="reference"
          :style="`              
          background-color:${对象数据.attrs.backgroundColor};
          color:${对象数据.attrs.color};
          border:solid ${对象数据.attrs.borderColor} 2px;
          max-width:${对象数据.attrs.height * 窗口缩放倍数} px
          
          `"
          @dblclick="对象数据.attrs.folded = !对象数据.attrs.folded"
        >
          <span>{{ index }}</span>

          <span class="subtypetag" v-if="$当前窗口状态.showsubtype">{{
            对象数据.subtype
          }}</span>
          <strong v-if="$当前窗口状态.showname">{{ 对象数据.name }}</strong>
        </div>
        <div
          :style="`
         
          border:solid ${对象数据.attrs.borderColor} 1px;
          background-color:${对象数据.attrs.backgroundColor};
          `"
        >
          <cc-link-siyuan
            :style="`color:${对象数据.attrs.color};`"
            :锚文本="对象数据.attrs.anchor"
            :链接id="对象数据.attrs.def_block"
          ></cc-link-siyuan>

          <div :style="`font-size:xx-small;color:${对象数据.attrs.color}`">
            双击标记展开,拖拽移动
          </div>
        </div>
      </el-popover>
      <div v-if="激活" class="cc-card-toolbar">
        <span>{{ index }}</span>
        <span class="el-icon-delete" v-on:click="删除()"></span>
        <span v-if="数据类型 == 'card'" class="el-icon-share" @click="开始连接()"></span>
        <span
          v-if="数据类型 == 'link'"
          class="el-icon-refresh"
          v-on:click="转化为卡片()"
        ></span>

        <span
          class="el-icon-edit"
          v-if="!正在编辑 && !思源HTML"
          @click="正在编辑 = true"
        ></span>
        <span class="el-icon-check" v-if="正在编辑" @click="正在编辑 = false"></span>
        <span
          class="el-icon-focus"
          @click="$事件总线.$emit('定位至卡片', 对象数据.id)"
        ></span>
        <el-tooltip content="新窗口打开编辑">
          <span class="el-icon-browser" @click="$窗口内打开超链接(数据超链接)"></span>
        </el-tooltip>
      </div>
      <div
        :class="`cc-card-body cc-${数据类型} not-folded`"
        v-if="!对象数据.attrs.folded"
        @dblclick="对象数据.attrs.folded = !对象数据.attrs.folded"
        :style="`
          
          color:${对象数据.attrs.color};
          border:solid ${对象数据.attrs.borderColor} ${边框宽度}px;
          background-color:${对象数据.attrs.backgroundColor};
          width:${对象数据.attrs.width - 27 + 'px'};
          height:${对象数据.attrs.height - 27 + 'px'};
          `"
      >
        <div>
          <el-row>
            <el-col :span="12">
              <span class="el-icon-siyuan" v-if="对象数据.attrs.def_block"></span>

              <strong>{{ 对象数据.name }}</strong>
            </el-col>
            <el-col :span="12">
              <span size="mini" class="subtypetag">{{ 对象数据.subtype }}</span>
            </el-col>
          </el-row>
        </div>
        <div></div>
        <cc-link-siyuan
          v-if="对象数据.attrs.def_block"
          :style="`color:${对象数据.attrs.color};`"
          :锚文本="`引用自${对象数据.attrs.def_block_name || 对象数据.attrs.def_block}`"
          :链接id="对象数据.attrs.def_block"
        ></cc-link-siyuan>
        <div class="cc-card-content">
          <div :style="`color:${对象数据.attrs.color};`"></div>
          <cc-vditor-vue
            v-model="对象数据.markdown"
            v-if="正在编辑"
            @html-change="预览HTML = $event"
            :toolbarconfig="{ hide: false }"
          ></cc-vditor-vue>
          <div v-if="!正在编辑 && !思源HTML" v-html="预览HTML"></div>
          <div
            class="protyle-wysiwyg protyle-wysiwyg--attr"
            v-if="思源HTML"
            v-html="思源HTML"
          ></div>
        </div>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
module.exports = {
  name: "cc-block-card",
  props: ["value", "index", "移除标签", "数据源id", "窗口缩放倍数", "数据类型"],
  components: componentsList,
  model: { prop: "value", event: "change" },
  data() {
    return {
      对象数据: "",
      预览HTML: "",
      激活: false,
      正在编辑: false,
      开始监听: false,
      数据超链接: "",
      folded: "",

      hide: "",
      显示控制柄: true,
      边框宽度: 1,
      思源HTML: "",
      def_block: "",
    };
  },
  beforeMount() {
    this.folded = null;
  },
  async mounted() {
    //console.log("加载卡片", this.value);
    this.对象数据 = this.value;

    this.开始监听 = true;
    this.数据超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html/?id=${this.对象数据.id}&baseid=${this.$baseid}&type=${this.数据类型}`;
    this.hide = false;
    this.timer = setInterval(this.计算可见性, 100);
    this.$事件总线.$on("保存卡片", (event) => this.判断id(event));
    this.$事件总线.$on("保存链接", (event) => this.判断id(event));
  },

  watch: {
    value: {
      handler: async function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }

        this.对象数据 = val;
        if (this.对象数据 && this.对象数据.attrs.top < 0) {
          this.对象数据.top = 0;
        }
        if (this.对象数据 && this.对象数据.attrs.left < 0) {
          this.对象数据.left = 0;
        }
        let attrs = val.attrs;
        attrs.top + "" == "NAN" || attrs.top + "" == "undefined" ? (attrs.top = 0) : null;
        attrs.left + "" == "NAN" || attrs.left + "" == "undefined"
          ? (attrs.left = 0)
          : null;
        attrs.width + "" == "NAN" || attrs.width + "" == "undefined"
          ? (attrs.width = 100)
          : null;
        attrs.height + "" == "NAN" || attrs.height + "" == "undefined"
          ? (attrs.height = 100)
          : null;
        attrs.offsetx + "" == "NAN" || attrs.offsetx + "" == "undefined"
          ? (attrs.offsetx = 0)
          : null;
        attrs.offsety + "" == "NAN" || attrs.offsety + "" == "undefined"
          ? (attrs.offsety = 0)
          : null;

        this.对象数据.type = this.数据类型;
        this.数据类型 == "card"
          ? (this.对象数据.subtype = val.subtype || "一般概念")
          : (this.对象数据.subtype = val.subtype || "属于");
        this.数据类型 == "card"
          ? () => {
              this.对象数据.offsetx = 0;
              this.对象数据.offsety = 0;
            }
          : null;
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler: function (val, oldval) {
        if (!val) {
          this.对象数据.name = "未命名";
        }
        this.对象数据.name = val;
        this.保存数据();
      },
    },
    对象数据: {
      handler: async function (val, oldval) {
        this.folded = val.attrs.folded;
        this.def_block = val.attrs.def_block;
        let attrs = this.对象数据.attrs;
        attrs.top + "" == "NAN" ? (attrs.top = 0) : null;
        attrs.left + "" == "NAN" ? (attrs.left = 0) : null;
        attrs.width + "" == "NAN" ? (attrs.width = 100) : null;
        attrs.height + "" == "NAN" ? (attrs.height = 100) : null;
        attrs.offsetx + "" == "NAN" ? (attrs.offsetx = 0) : null;
        attrs.offsety + "" == "NAN" ? (attrs.offsety = 0) : null;
        this.生成html();
        this.保存数据();
      },
      deep: true,
      immediate: true,
    },
    folded: {
      handler: function (val) {
        if (val) {
          this.显示控制柄 = false;
        } else {
          try {
            this.显示控制柄 = true;
          } catch (e) {}
        }
        this.保存数据();
      },
      immediate: true,
    },
    激活(val) {
      if (val) {
        //   console.log(this.对象数据);
        this.对象数据 = this.$更新数据时间戳(this.对象数据);
        this.$事件总线.$emit("激活数据", this.对象数据);
        this.边框宽度 = 3;
      } else {
        this.对象数据 = this.$更新数据时间戳(this.对象数据);
        this.$事件总线.$emit("反激活数据", this.对象数据);
        this.正在编辑 = false;
        this.边框宽度 = 1;
      }
    },
    正在编辑(val) {
      if (val) {
        //console.log(this.对象数据);
      }
    },
  },
  computed: {
    top: function () {
      let a =
        (this.value.attrs.top + this.value.attrs.offsety) * this.窗口缩放倍数 ||
        this.value.attrs.top * this.窗口缩放倍数 ||
        0;
      return a;
    },
    left: function () {
      let a =
        (this.value.attrs.left + this.value.attrs.offsetx) * this.窗口缩放倍数 ||
        this.value.attrs.left * this.窗口缩放倍数 ||
        0;
      return a;
    },
    width: function () {
      return this.value.attrs.width * this.窗口缩放倍数;
    },
    height: function () {
      return !this.folded
        ? this.value.attrs.height * this.窗口缩放倍数
        : 30 * this.窗口缩放倍数;
    },
  },
  methods: {
    判断id: async function ($event) {
      let that = this;
      if (!this.监听) {
        return null;
      }
      if ($event.id == this.对象数据.id) {
        this.对象数据 = $event;
      }
    },
    生成html: async function () {
      this.预览HTML = await Vditor.md2html(this.对象数据.markdown);
      if (this.def_block) {
        let 思源块内容 = await 以id获取文档内容(window.location.host, "", this.def_block);
        思源块内容.data.content
          ? (this.思源HTML = 思源块内容.data.content.replace(
              'contenteditable="true"',
              'contenteditable="false"'
            ))
          : (this.思源HTML = "获取思源块内容失败");
      }
    },
    开始连接() {
      //console.log("开始连接");
      this.$事件总线.$emit("开始连接", this.对象数据);
    },
    删除() {
      if ((this.开始监听 = true)) {
        this.移除标签;
        this.$emit("delete", this.index);
        this.$事件总线.$emit("删除数据", this.对象数据);
      }
    },
    dblclick: function () {
      this.$emit("dblclick");
    },
    展开链接: function () {
      this.$emit("callbacklink", this.对象数据.attrs.def_block);
    },
    计算坐标: async function (x, y) {
      if (this.数据类型 == "card") {
        this.对象数据.attrs.top = y / this.窗口缩放倍数;
        this.对象数据.attrs.left = x / this.窗口缩放倍数;
        this.对象数据.attrs.offsety = 0;
        this.对象数据.attrs.offsetx = 0;
      }
      if (this.数据类型 == "link") {
        this.对象数据.attrs.offsety = y / this.窗口缩放倍数 - this.对象数据.attrs.top;
        this.对象数据.attrs.offsetx = x / this.窗口缩放倍数 - this.对象数据.attrs.left;
      }
    },
    dragging: function (x, y) {
      this.计算坐标(x, y);
      this.保存数据();
      this.$事件总线.$emit("移动卡片", this.对象数据);
    },
    dragstop(x, y) {
      this.计算坐标(x, y);

      this.保存数据();
    },
    resizing: function (x, y, width, height) {
      this.计算坐标(x, y);
      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;

      this.保存数据();
    },

    resizestop: function (x, y, width, height) {
      this.计算坐标(x, y);

      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;
      this.保存数据();
    },
    保存数据: function () {
      this.对象数据 = this.$更新数据时间戳(this.对象数据);

      this.数据类型 == "card"
        ? this.$事件总线.$emit("保存卡片", this.对象数据)
        : this.$事件总线.$emit("保存链接", this.对象数据);
    },
    转化为卡片: function () {
      let 新数据 = JSON.parse(JSON.stringify(this.对象数据));

      this.$事件总线.$emit("链接转化为卡片", 新数据);
      this.删除();
    },
    计算可见性: async function () {
      this.hide = true;
      let 对象数据 = this.对象数据;
      let $当前窗口状态 = this.$当前窗口状态;
      if (this.对象数据 && this.对象数据.attrs.top < 0) {
        this.对象数据.top = 0;
      }
      if (this.对象数据 && this.对象数据.attrs.left < 0) {
        this.对象数据.left = 0;
      }
      if (
        window.pageYOffset >
          (对象数据.attrs.top + 对象数据.attrs.offsety + 对象数据.attrs.height) *
            $当前窗口状态.缩放倍数 ||
        window.pageYOffset + window.innerHeight <
          (对象数据.attrs.top + 对象数据.attrs.offsety) * $当前窗口状态.缩放倍数 ||
        window.pageXOffset >
          (对象数据.attrs.left + 对象数据.attrs.offsetx + 对象数据.attrs.width) *
            $当前窗口状态.缩放倍数 ||
        (window.pageXOffset + window.innerWidth <
          (对象数据.attrs.left + 对象数据.attrs.offsetx) * $当前窗口状态.缩放倍数 &&
          对象数据.attrs.left > 0 &&
          对象数据.top > 0)
      ) {
        // 不可见标记数组.push(标记);
        this.hide = true;
      } else {
        this.hide = false;
      }
    },
  },
};
</script>

<style scoped>
.vditor-toolbar {
  display: none;
}
.el-card {
  width: 100%;
  height: 100%;
}

pre.vditor-reset {
  background-color: transparent !important;
}
</style>
