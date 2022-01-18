<template>
  <vue-draggable-resizable
    v-if="!hide"
    ref="container"
    @click="鼠标点击($event)"
    :resizable="显示控制柄"
    :draggable="!正在编辑"
    @activated="激活 = true"
    @deactivated="激活 = false"
    @dragging="dragging"
    @dragstop="dragstop"
    @resizing="resizing"
    @resizestop="resizestop"
    :y="top || 0"
    :w="width || 对象数据.attrs.width * 窗口缩放倍数 || 100"
    :h="height || 对象数据.attrs.height * 窗口缩放倍数 || 100"
    :x="left || 0"
    :z="210"
    class-name-handle="resizer"
    class-name="cc-card-container"
  >
    <div
      @click="鼠标点击($event)"
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
        :width="300"
        v-if="对象数据.attrs.folded"
      >
        <div
          @click="鼠标点击($event)"
          class="cc-card-body folded"
          slot="reference"
          :style="`              
          background-color:${对象数据.attrs.backgroundColor};
          color:${对象数据.attrs.color};
          border:solid ${对象数据.attrs.borderColor} 2px;
          max-width:${对象数据.attrs.height * 窗口缩放倍数} px
          
          `"
          @dblclick="开始连接()"
        >
          <span>{{ index }}</span>
          <span
            class="el-icon-siyuan"
            aria-label="卡片已经连接到思源块,点击更换源"
            v-if="对象数据.attrs.def_block"
          ></span>

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

          <div
            v-html="思源HTML || 预览HTML"
            class="protyle-wysiwyg protyle-wysiwyg--attr"
            :style="`font-size:xx-small;color:${对象数据.attrs.color}`"
          ></div>
        </div>
      </el-popover>

      <div v-if="激活" class="cc-card-toolbar">
        <span aria-label="卡片序号">{{ index }}</span>
        <span aria-label="删除卡片" class="el-icon-delete" v-on:click="删除()"> </span>
        <span
          aria-label="展开|关闭卡片"
          class="el-icon-full-screen"
          @click="对象数据.attrs.folded = !对象数据.attrs.folded"
        ></span>
        <span
          aria-label="将卡片转换为链接"
          v-if="数据类型 == 'link'"
          class="el-icon-refresh"
          v-on:click="转化为卡片()"
        ></span>

        <span
          aria-label="就地编辑卡片内容"
          class="el-icon-edit"
          v-if="!正在编辑 && !思源HTML"
          @click="正在编辑 = true"
        ></span>
        <span
          aria-label="停止编辑卡片内容"
          class="el-icon-check"
          v-if="正在编辑"
          @click="正在编辑 = false"
        ></span>
        <span
          class="el-icon-focus"
          @click="$事件总线.$emit('定位至卡片', 对象数据.id)"
        ></span>
        <span
          aria-label="在新窗口打开卡片内容"
          class="el-icon-browser"
          @click="$窗口内打开超链接(数据超链接)"
        ></span>
        <span
          v-if="对象数据.type == 'link'"
          class="el-icon-place"
          aria-label="返回连接线中点"
          @click="返回原始点()"
        ></span>
        <span
          class="el-icon-siyuan"
          aria-label="发送卡片到思源作为文档"
          v-if="!对象数据.attrs.def_block"
          @click="发送卡片数据到思源()"
        ></span>
      </div>
      <div
        :class="`cc-card-body cc-${数据类型} not-folded`"
        v-if="!对象数据.attrs.folded"
        aria-label="双击开始卡片连接,ctrl+点击多选"
        @dblclick="开始连接()"
        :style="`
          
          color:${对象数据.attrs.color};
          border:${对象数据.attrs.borderStyle || 'solid'} ${对象数据.attrs.borderColor} ${
          对象数据.attrs.borderWidth || 1
        }px;
          background-color:${对象数据.attrs.backgroundColor};
          width:${
            对象数据.attrs.width - 21 - (对象数据.attrs.borderWidth || 1) * 2 + 'px'
          };
          height:${
            对象数据.attrs.height - 21 - (对象数据.attrs.borderWidth || 1) * 2 + 'px'
          };
          `"
        @click="鼠标点击($event)"
      >
        <div>
          <el-row>
            <el-col :span="12">
              <span
                class="el-icon-siyuan"
                @click="发送卡片数据到思源()"
                aria-label="卡片已经连接到思源块,点击更换目标"
                v-if="对象数据.attrs.def_block"
              ></span>

              <el-input
                :key="对象数据.id"
                size="mini"
                class="cc-card-name"
                :ref="'cardname' + 对象数据.id"
                autofix="ture"
                @input="保存数据(true, $event)"
                @change="保存数据(true, $event)"
                v-model="对象数据.name"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <span class="subtypetag">{{ 对象数据.subtype }}</span>
            </el-col>
          </el-row>
        </div>
        <div>
          <span v-if="对象数据.attrs.def_block">引用自:</span>
          <cc-link-siyuan
            v-if="对象数据.attrs.def_block"
            :style="`color:${对象数据.attrs.color};`"
            锚文本=""
            :链接id="对象数据.attrs.def_block"
          ></cc-link-siyuan>
        </div>
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
  model: { prop: "value", event: "change" },
  data() {
    return {
      对象数据: {},
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
      预设: "",
    };
  },
  beforeMount() {
    this.folded = null;
  },
  mounted() {
    //console.log("加载卡片", this.value);
    if (this.value.attrs) {
      this.对象数据 = this.value;
    } else {
      this.删除();
    }

    this.开始监听 = true;
    this.数据超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html/?id=${this.对象数据.id}&baseid=${this.$baseid}&type=${this.数据类型}`;
    this.hide = false;
    setTimeout(this.计算可见性, 500);
    this.获取预设(this.value);
    this.$事件总线.$on("保存卡片", (event) => this.判断id(event));
    this.$事件总线.$on("保存链接", (event) => this.判断id(event));
    this.$事件总线.$on("保存数据", (event) => this.判断id(event));
    this.$事件总线.$on("删除数据", (event) => this.判断id(event));
  },

  watch: {
    value: {
      handler: function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        if (parseInt(val.updated) <= parseInt(this.对象数据.updated)) {
          //console.log(val.updated, this.链接.updated);
          return null;
        }
        if (!val.attrs || (val.attrs && val.attrs.trashed)) {
          this.删除();
          return null;
        }
        this.对象数据 = val;
        this.对象数据 = this.$填充默认值(this.对象数据);

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
        this.边框宽度 = val.attrs.borderWidth || 1;
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
      handler: function (val, oldval) {
        if (!val.attrs) {
          return null;
        }
        this.folded = val.attrs.folded;
        let attrs = this.对象数据.attrs;
        attrs.top + "" == "NAN" ? (attrs.top = 0) : null;
        attrs.left + "" == "NAN" ? (attrs.left = 0) : null;
        attrs.width + "" == "NAN" ? (attrs.width = 100) : null;
        attrs.height + "" == "NAN" ? (attrs.height = 100) : null;
        attrs.offsetx + "" == "NAN" ? (attrs.offsetx = 0) : null;
        attrs.offsety + "" == "NAN" ? (attrs.offsety = 0) : null;
        if (this.def_block != val.attrs.def_block);
        {
          this.def_block = val.attrs.def_block;
          this.生成html();
        }
        let 拷贝对象 = JSON.parse(JSON.stringify(val));
        let 拷贝旧对象 = JSON.parse(JSON.stringify(oldval || "{}"));
        拷贝对象.updated = "";
        拷贝旧对象.updated = "";
        if (
          JSON.stringify(拷贝对象) != JSON.stringify(拷贝旧对象) &&
          !val.attrs.trashed
        ) {
          this.保存数据();
        }

        this.$refs.cardname ? this.$refs.cardname.focus() : null;
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
      } else {
        this.对象数据 = this.$更新数据时间戳(this.对象数据);
        this.$事件总线.$emit("反激活数据", this.对象数据);
        this.正在编辑 = false;
        this.生成html();
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
        (this.对象数据.attrs.top + this.对象数据.attrs.offsety) * this.窗口缩放倍数 ||
        this.对象数据.attrs.top * this.窗口缩放倍数 ||
        0;
      return a;
    },
    left: function () {
      let a =
        (this.对象数据.attrs.left + this.对象数据.attrs.offsetx) * this.窗口缩放倍数 ||
        this.对象数据.attrs.left * this.窗口缩放倍数 ||
        0;
      return a;
    },
    width: function () {
      return this.对象数据.attrs.width * this.窗口缩放倍数;
    },
    height: function () {
      return !this.folded
        ? this.对象数据.attrs.height * this.窗口缩放倍数
        : 30 * this.窗口缩放倍数;
    },
  },
  methods: {
    获取预设: async function (预设名) {
      let 预设表名 = this.对象数据.type + "presets";
      this.预设 = await this.$获取预设(预设表名, 预设名);

      if (!this.预设) {
        return null;
      } else {
        for (属性名 in this.卡片预设默认值) {
          if (this.预设[属性名] && this.预设[属性名] !== "byref") {
            this.对象数据.attrs.属性名 = this.预设.属性名;
          }
        }
      }
    },
    返回原始点: function () {
      this.对象数据.attrs.offsetx = 0 - this.对象数据.attrs.width / 2;
      this.对象数据.attrs.offsety = 0 - this.对象数据.attrs.height / 2;
      this.保存数据();
    },
    发送卡片数据到思源: function () {
      this.$事件总线.$emit("打开发送对话框", this.对象数据);
    },
    鼠标点击($event) {
      $event.ctrlKey ? this.$事件总线.$emit("ctrl加鼠标点击卡片", this.对象数据) : null;
    },
    判断id: function ($event) {
      let that = this;

      if (
        $event.id == this.对象数据.id &&
        parseInt($event.updated) >= parseInt(this.对象数据.updated)
      ) {
        let 旧数据 = JSON.parse(JSON.stringify(this.对象数据 || {}));
        let 新数据 = JSON.parse(JSON.stringify($event || {}));
        旧数据.updated = "";
        新数据.updated = "";
        if (旧数据 !== 新数据 && !新数据.attrs.trashed && !旧数据.trashed) {
          this.对象数据 = $event;
        }
      }
    },
    生成html: async function () {
      let that = this;
      let el = window.document.createElement("div");
      el.innerHTML = await Vditor.md2html(this.对象数据.markdown);
      let images = el.querySelectorAll("img");
      if (images[0]) {
        images.forEach((element) => {
          let src = element.getAttribute("src");
          if (src.slice(0, 6) == "assets") {
            element.setAttribute("src", "/" + src);
          }
        });
      }
      this.预览HTML = el.innerHTML;
      if (this.def_block) {
        let 思源块内容 = await 以id获取文档聚焦内容(
          window.location.host,
          "",
          this.def_block
        );
        if (思源块内容.data && 思源块内容.data.content) {
          let el = window.document.createElement("div");
          el.innerHTML = 思源块内容.data.content;
          let images = el.querySelectorAll("img");
          if (images[0]) {
            images.forEach((element) => {
              let src = element.getAttribute("src");
              if (src.slice(0, 6) == "assets") {
                element.setAttribute("src", "/" + src);
              }
            });
          }

          this.思源HTML = el.innerHTML;
        } else this.思源HTML = "获取思源块内容失败";
      }
    },
    开始连接() {
      //console.log("开始连接");
      this.$事件总线.$emit("开始连接", this.对象数据);
    },
    删除() {
      if (this.开始监听 == true) {
        if (this.对象数据.attrs) {
          this.对象数据.attrs.trashed = true;
        }
        console.log("删除");

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

      this.保存数据(true);
      this.$事件总线.$emit("缩放卡片", this.对象数据);
    },
    resizing: function (x, y, width, height) {
      this.计算坐标(x, y);
      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;

      this.保存数据();
      this.$事件总线.$emit("缩放卡片", this.对象数据);
    },

    resizestop: function (x, y, width, height) {
      this.计算坐标(x, y);

      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;
      this.保存数据(true);
    },
    保存数据: function (flag, $event) {
      $event ? (this.对象数据.name = $event) : null;
      this.对象数据 = this.$更新数据时间戳(this.对象数据);
      let 数据表名 = this.对象数据.type + "s";
      this.数据类型 == "card"
        ? this.$事件总线.$emit("保存卡片", this.对象数据, flag)
        : this.$事件总线.$emit("保存链接", this.对象数据, flag);
    },
    转化为卡片: function () {
      let 新数据 = JSON.parse(JSON.stringify(this.对象数据));

      this.$事件总线.$emit("链接转化为卡片", 新数据);
      this.删除();
    },
    计算可见性: async function () {
      this.hide = true;
      let 对象数据 = this.对象数据;
      if (!对象数据.attrs) {
        this.删除();
        return null;
      }
      let $当前窗口状态 = this.$当前窗口状态;
      if (this.对象数据 && this.对象数据.attrs.top < 0) {
        this.对象数据.attrs.top = 0;
      }
      if (this.对象数据 && this.对象数据.attrs.left < 0) {
        this.对象数据.attrs.left = 0;
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
      if (对象数据) {
        setTimeout(this.计算可见性, 500);
      } else {
        clearTimeout(this.计算可见性);
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
