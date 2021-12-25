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
    :y="卡片数据.attrs.top"
    :w="width || 卡片数据.attrs.width"
    :h="height || 卡片数据.attrs.height"
    :x="卡片数据.attrs.left"
    :z="210"
    class-name-handle="resizer"
    class-name="cc-card-container"
  >
    <div :data-node-id="卡片数据.id" class="cc-card-main">
      <el-popover
        popper-class="tagpoper"
        trigger="hover"
        :open-delay="300"
        placement="right"
        :width="100"
        v-if="卡片数据.attrs.folded"
      >
        <div
          class="cc-card-body folded"
          slot="reference"
          :style="`              
          background-color:${卡片数据.attrs.backgroundColor};
          color:${卡片数据.attrs.color};
          border:solid ${卡片数据.attrs.borderColor} 2px;
          `"
          @dblclick="卡片数据.attrs.folded = !卡片数据.attrs.folded"
        >
          {{ index }}
        </div>
        <div
          :style="`
         
          border:solid ${卡片数据.attrs.borderColor} 1px;
          background-color:${卡片数据.attrs.backgroundColor};
          `"
        >
          <cc-link-siyuan
            :style="`color:${卡片数据.attrs.color};`"
            :锚文本="卡片数据.attrs.anchor"
            :链接id="卡片数据.attrs.def_block"
          ></cc-link-siyuan>

          <div :style="`font-size:xx-small;color:${卡片数据.attrs.color}`">
            双击标记展开,拖拽移动
          </div>
        </div>
      </el-popover>
      <div v-if="激活" class="cc-card-toolbar">
        <span style="float: right">{{ index }}</span>
        <span class="el-icon-delete" v-on:click="删除()"></span>
        <span class="el-icon-share" @click="开始连接()"></span>
        <span class="el-icon-edit" v-if="!正在编辑" @click="正在编辑 = true"></span>
        <span class="el-icon-check" v-if="正在编辑" @click="正在编辑 = false"></span>
        <span
          class="el-icon-focus"
          @click="$事件总线.$emit('定位至卡片', 卡片数据.id)"
        ></span>
        <el-tooltip content="新窗口打开编辑">
          <span class="el-icon-browser" @click="$窗口内打开超链接(卡片超链接)"></span>
        </el-tooltip>
      </div>
      <div
        class="cc-card-body not-folded"
        v-if="!卡片数据.attrs.folded"
        @dblclick="卡片数据.attrs.folded = !卡片数据.attrs.folded"
        :style="`
          
          color:${卡片数据.attrs.color};
          border:solid ${卡片数据.attrs.borderColor} ${边框宽度}px;
          background-color:${卡片数据.attrs.backgroundColor};
          width:${卡片数据.attrs.width - 27 + 'px'};
          height:${卡片数据.attrs.height - 27 + 'px'};
          `"
      >
        <div>
          <div>
            <span class="el-icon-siyuan" v-if="卡片数据.attrs.def_block"></span>

            <strong>{{ 卡片数据.name }}</strong>
          </div>
          <div class="cc-node-content">
            <div :style="`color:${卡片数据.attrs.color};`">
              <cc-link-siyuan
                v-if="卡片数据.attrs.def_block"
                :style="`color:${卡片数据.attrs.color};`"
                :锚文本="`引用自${
                  卡片数据.attrs.def_block_name || 卡片数据.attrs.def_block
                }`"
                :链接id="卡片数据.attrs.def_block"
              ></cc-link-siyuan>
            </div>
            <cc-vditor-vue
              v-model="卡片数据.markdown"
              v-if="正在编辑"
              @html-change="预览HTML = $event"
              :toolbarconfig="{ hide: false }"
            ></cc-vditor-vue>
            <div v-if="!正在编辑" v-html="预览HTML"></div>
          </div>
        </div>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
module.exports = {
  name: "cc-block-card",
  props: ["value", "index", "移除标签", "数据源id"],
  components: componentsList,
  model: { prop: "value", event: "change" },
  data() {
    return {
      卡片数据: "",
      预览HTML: "",
      激活: false,
      正在编辑: false,
      开始监听: false,
      卡片超链接: "",
      folded: "",
      width: "",
      height: "",
      hide: "",
      显示控制柄: true,
    };
  },
  beforeMount() {
    this.folded = null;
  },
  async mounted() {
    //console.log("加载卡片", this.value);
    this.卡片数据 = this.value;
    this.卡片数据.type = "card";

    this.开始监听 = true;
    this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html/?id=${this.卡片数据.id}&baseid=${this.$baseid}&type=card`;
    this.hide = false;
    this.timer = setInterval(this.计算可见性, 100);
  },

  watch: {
    value: {
      handler: function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        this.卡片数据 = val;
        this.卡片数据.type = "card";
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler: function (val, oldval) {
        if (!val) {
          this.卡片数据.name = "未命名";
        }
        this.卡片数据.name = val;
        this.保存卡片();
      },
    },
    卡片数据: {
      handler: async function (val, oldval) {
        this.folded = val.attrs.folded;

        this.生成html();
      },
      deep: true,
      immediate: true,
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
            this.$refs.container["width"] = this.卡片数据.attrs["width"];
            this.$refs.container["height"] = this.卡片数据.attrs["height"];
            this.显示控制柄 = true;
          } catch (e) {}
        }
        this.保存卡片();
      },
      immediate: true,
    },
    激活(val) {
      if (val) {
        console.log(this.卡片数据);
        this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
        this.$事件总线.$emit("激活卡片", this.卡片数据.id);
      } else {
        this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
        this.$事件总线.$emit("反激活卡片", this.卡片数据.id);
        this.正在编辑 = false;
      }
    },
    正在编辑(val) {
      if (val) {
        //console.log(this.卡片数据);
      }
    },
  },
  computed: {
    边框宽度() {
      return this.$当前窗口状态["current_cardid"] ? 3 : 1;
    },
  },
  methods: {
    生成html: async function () {
      this.预览HTML = await Vditor.md2html(this.卡片数据.markdown);
    },
    开始连接() {
      //console.log("开始连接");
      this.$事件总线.$emit("开始连接", this.卡片数据);
    },
    删除() {
      if ((this.开始监听 = true)) {
        this.移除标签;
        this.$emit("delete", this.index);
        this.$事件总线.$emit("删除卡片", this.卡片数据);
      }
    },
    dblclick: function () {
      this.$emit("dblclick");
    },
    展开链接: function () {
      this.$emit("callbacklink", this.卡片数据.attrs.def_block);
    },
    dragging: function (x, y) {
      this.卡片数据.attrs.top = y;
      this.卡片数据.attrs.left = x;
      this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
      this.保存卡片();
    },
    dragstop(x, y) {
      this.卡片数据.attrs.top = y > 0 ? y : 0;
      this.卡片数据.attrs.left = x > 0 ? x : 0;
      this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
      this.保存卡片();
    },
    resizing: function (x, y, width, height) {
      this.卡片数据.attrs.top = y;
      this.卡片数据.attrs.left = x;
      this.卡片数据.attrs.width = width;
      this.卡片数据.attrs.height = height;
      this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
      this.保存卡片();
    },

    resizestop: function (x, y, width, height) {
      this.卡片数据.attrs.top = y > 0 ? y : 0;
      this.卡片数据.attrs.left = x > 0 ? x : 0;
      this.卡片数据.attrs.width = width;
      this.卡片数据.attrs.height = height;
      this.卡片数据 = this.$更新数据时间戳(this.卡片数据);
      this.保存卡片();
    },
    保存卡片: function () {
      this.$事件总线.$emit("保存卡片", this.卡片数据);
    },
    计算可见性: async function () {
      this.hide = true;
      let 卡片数据 = this.卡片数据;
      let $当前窗口状态 = this.$当前窗口状态;
      if (
        window.pageYOffset >
          (卡片数据.attrs.top + 卡片数据.attrs.height) * $当前窗口状态.缩放倍数 ||
        window.pageYOffset + window.innerHeight <
          卡片数据.attrs.top * $当前窗口状态.缩放倍数 ||
        window.pageXOffset >
          (卡片数据.attrs.left + 卡片数据.attrs.width) * $当前窗口状态.缩放倍数 ||
        window.pageXOffset + window.innerWidth <
          卡片数据.attrs.left * $当前窗口状态.缩放倍数
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
