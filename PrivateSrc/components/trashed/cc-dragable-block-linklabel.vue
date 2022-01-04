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
    :y="链接数据.attrs.top + 链接数据.attrs.offsety"
    :w="width || 链接数据.attrs.width"
    :h="height || 链接数据.attrs.height"
    :x="链接数据.attrs.left + 链接数据.attrs.offsetx"
    :z="300"
    class-name-handle="resizer"
    class-name="cc-card-container"
  >
    <div :data-node-id="链接数据.id">
      <el-popover
        popper-class="tagpoper"
        trigger="hover"
        :open-delay="300"
        placement="right"
        :width="100"
        v-if="链接数据.attrs.folded"
      >
        <div
          class="cc-card-body cc-link folded"
          slot="reference"
          :style="`             
          background-color:${链接数据.attrs.backgroundColor};
          color:${链接数据.attrs.color};
          border:solid ${链接数据.attrs.borderColor} 2px;
        
          `"
          @dblclick="链接数据.attrs.folded = !链接数据.attrs.folded"
        >
          {{ index }}
        </div>
        <div
          :style="`
          overflow:hidden;
          color:${链接数据.attrs.color};
          border:solid ${链接数据.attrs.borderColor} 1px;
          background-color:${链接数据.attrs.backgroundColor};
          border-radius:5px`"
        >
          <cc-link-siyuan
            :style="`color:${链接数据.attrs.color};`"
            :锚文本="链接数据.attrs.anchor"
            :链接id="链接数据.attrs.def_block"
          ></cc-link-siyuan>

          <div :style="`font-size:xx-small;color:${链接数据.attrs.color}`">
            双击标记展开,拖拽移动
          </div>
        </div>
      </el-popover>
      <div v-if="激活" class="cc-card-toolbar">
        <span style="float: right">{{ index }}</span>
        <span class="el-icon-delete" v-on:click="删除()"></span>
        <span
          class="el-icon-edit"
          v-if="!正在编辑 && !思源HTML"
          @click="正在编辑 = true"
        ></span>
        <span class="el-icon-check" v-if="正在编辑" @click="正在编辑 = false"></span>
        <span class="el-icon-refresh" v-on:click="转化为卡片()"></span>
        <el-tooltip content="新窗口打开编辑">
          <span class="el-icon-browser" @click="$窗口内打开超链接(链接超链接)"></span>
        </el-tooltip>
      </div>
      <div
        class="cc-card-body cc-link not-folded"
        v-if="!链接数据.attrs.folded"
        @dblclick="链接数据.attrs.folded = !链接数据.attrs.folded"
        :style="`
        color:${链接数据.attrs.color};
        
        border:solid ${链接数据.attrs.borderColor} ${边框宽度}px;
        background-color:${链接数据.attrs.backgroundColor};
        width:${链接数据.attrs.width - 27 + 'px'};
        height:${链接数据.attrs.height - 27 + 'px'};
       `"
      >
        <div>
          <span class="el-icon-siyuan" v-if="链接数据.attrs.def_block"></span>

          <strong>{{ 链接数据.name }}</strong>
        </div>
        <cc-link-siyuan
          v-if="链接数据.attrs.def_block"
          :style="`color:${链接数据.attrs.color};`"
          :锚文本="`引用自${链接数据.attrs.def_block}`"
          :链接id="链接数据.attrs.def_block"
        ></cc-link-siyuan>
        <div class="cc-card-content">
          <div :style="`color:${链接数据.attrs.color};`"></div>
          <cc-vditor-vue
            v-model="链接数据.markdown"
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
  name: "cc-dragable-block-linklabel",
  props: ["value", "index", "移除标签", "数据源id"],
  components: componentsList,
  model: { prop: "value", event: "change" },
  data() {
    return {
      链接数据: "",
      预览HTML: "",
      激活: false,
      正在编辑: false,
      开始监听: false,
      边框宽度: 1,
      链接超链接: "",
      folded: "",
      width: "",
      height: "",
      hide: "",
      显示控制柄: true,
      思源HTML: "",
      def_block: "",
    };
  },
  beforeMount() {
    this.folded = null;
  },
  mounted() {
    //  console.log("加载链接", this.value.attrs);
    this.链接数据 = JSON.parse(JSON.stringify(this.value));
    this.链接数据.type = "link";
    this.开始监听 = true;
    this.链接超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.链接数据.id}&baseid=${this.$baseid}&type=link`;
    this.hide = false;
  },

  watch: {
    value: {
      handler: function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        this.链接数据 = val;
        this.链接数据.type = "link";
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler: function (val, oldval) {
        if (!val) {
          this.链接数据.name = "未命名";
        }
        this.链接数据.name = val;
        this.保存链接();
      },
    },
    链接数据: {
      handler: async function (val, oldval) {
        //    console.log(val);
        this.folded = val.attrs.folded;
        this.def_block = val.attrs.def_block;

        this.生成html();
      },
      deep: true,
    },
    folded: {
      handler: function (val) {
        if (val) {
          this.width = 30;
          this.height = 30;
          this.显示控制柄 = false;
        } else {
          try {
            this.width = null;
            this.height = null;
            this.$refs.container["min-width"] = 100;
            this.$refs.container["min-height"] = 30;
            this.$refs.container["width"] = this.链接数据.attrs["width"];
            this.$refs.container["height"] = this.链接数据.attrs["height"];
            this.显示控制柄 = true;
          } catch (e) {}
        }
      },
      immediate: true,
    },
    激活(val) {
      if (val) {
        this.边框宽度 = 3;
        //  console.log(this.链接数据);
        this.链接数据 = this.$更新数据时间戳(this.链接数据);
        this.$事件总线.$emit("激活链接", this.链接数据.id);
      } else {
        this.边框宽度 = 1;
        this.链接数据 = this.$更新数据时间戳(this.链接数据);
        this.$事件总线.$emit("反激活链接", this.链接数据.id);
        this.正在编辑 = false;
      }
    },
    正在编辑(val) {
      if (val) {
        //  console.log(this.链接数据);
      }
    },
  },
  methods: {
    生成html: async function () {
      this.预览HTML = await Vditor.md2html(this.链接数据.markdown);
      this.保存链接();
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

    删除() {
      if ((this.开始监听 = true)) {
        this.移除标签;
        this.$emit("delete", this.index);
        this.$事件总线.$emit("删除链接", this.链接数据);
      }
    },
    dblclick: function () {
      this.$emit("dblclick");
    },
    展开链接: function () {
      this.$emit("callbacklink", this.链接数据.attrs.def_block);
    },
    dragging: function (x, y) {
      this.链接数据.attrs.offsety = y - this.链接数据.attrs.top;
      this.链接数据.attrs.offsetx = x - this.链接数据.attrs.left;
      this.链接数据 = this.$更新数据时间戳(this.链接数据);
      this.保存链接();
    },
    dragstop(x, y) {
      this.链接数据.attrs.offsety =
        y > 0 ? y - this.链接数据.attrs.top : 0 - this.链接数据.attrs.top;
      this.链接数据.attrs.offsetx =
        x > 0 ? x - this.链接数据.attrs.left : 0 - this.链接数据.attrs.left;
      this.链接数据 = this.$更新数据时间戳(this.链接数据);
      this.保存链接();
    },
    resizing: function (x, y, width, height) {
      this.链接数据.attrs.offsety = y - this.链接数据.attrs.top;
      this.链接数据.attrs.offsetx = x - this.链接数据.attrs.left;
      this.链接数据.attrs.width = width;
      this.链接数据.attrs.height = height;
      this.链接数据 = this.$更新数据时间戳(this.链接数据);
      this.保存链接();
    },

    resizestop: function (x, y, width, height) {
      this.链接数据.attrs.offsety =
        y > 0 ? y - this.链接数据.attrs.top : 0 - this.链接数据.attrs.top;
      this.链接数据.attrs.offsetx =
        x > 0 ? x - this.链接数据.attrs.left : 0 - this.链接数据.attrs.left;
      this.链接数据.attrs.width = width;
      this.链接数据.attrs.height = height;
      this.链接数据 = this.$更新数据时间戳(this.链接数据);
      this.保存链接();
    },
    保存链接: function () {
      this.$数据库.links.put(this.链接数据);
    },
    计算可见性: async function () {
      //console.log(this.链接数据)
      if (!this.链接数据) {
        return null;
      }

      let 链接数据 = JSON.parse(JSON.stringify(this.链接数据));
      let $当前窗口状态 = this.$当前窗口状态;
      if (
        window.pageYOffset >
          (链接数据.attrs.top + 链接数据.attrs.offsety + 链接数据.attrs.height) *
            $当前窗口状态.缩放倍数 ||
        window.pageYOffset + window.innerHeight <
          (链接数据.attrs.top + 链接数据.attrs.offsety) * $当前窗口状态.缩放倍数 ||
        window.pageXOffset >
          (链接数据.attrs.left + 链接数据.attrs.width + 链接数据.attrs.offsetx) *
            $当前窗口状态.缩放倍数 ||
        window.pageXOffset + window.innerWidth <
          (链接数据.attrs.left + 链接数据.attrs.offsetx) * $当前窗口状态.缩放倍数
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
.card {
  position: absolute;
  background-color: none;
  border: none;
  z-index: 300;
}
pre.vditor-reset {
  background-color: transparent !important;
}
.el-drawer__wrapper {
  z-index: -1 !important;
}
</style>
