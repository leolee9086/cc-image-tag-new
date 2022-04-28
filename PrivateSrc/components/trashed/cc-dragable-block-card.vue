<template>
  <vue-draggable-resizable
    v-if="!hide"
    ref="container"
    @click="鼠标点击($event)"
    :resizable="显示控制柄"
    :draggable="!正在编辑 && !$当前窗口状态.is_drawing"
    @activated="激活 = true"
    @deactivated="激活 = false"
    @dragging="dragging"
    @dragstop="dragstop"
    @resizing="resizing"
    @resizestop="resizestop"
    :y="top || 0"
    :w="width || 对象数据.attrs.width * 窗口缩放倍数 || 100 * 窗口缩放倍数"
    :h="height || 对象数据.attrs.height * 窗口缩放倍数 || 100 * 窗口缩放倍数"
    :x="left || 0"
    :z="210"
    class-name-handle="resizer"
    class-name="cc-card-container"
  >
    <vue-draggable-resizable
      v-if="
        !hide &&
        ((对象数据.attrs.draw && 对象数据.attrs.draw[0]) || $当前窗口状态.is_drawing)
      "
      ref="container"
      :resizable="drawResize"
      :draggable="false"
      @resizing="drawresizing"
      @resizestop="drawresizing"
      :y="对象数据.attrs.draw_offsetY || 0"
      :w="对象数据.attrs.draw_width * 窗口缩放倍数 || 100 * 窗口缩放倍数"
      :h="对象数据.attrs.draw_height * 窗口缩放倍数 || 100 * 窗口缩放倍数"
      :x="对象数据.attrs.draw_offsetX * 窗口缩放倍数 || width + 20 * 窗口缩放倍数"
      class-name-handle="resizer"
      class-name="cc-card-container"
    >
      <cc-draw
        v-model="对象数据.attrs.draw"
        :宽度="对象数据.attrs.draw_width * 窗口缩放倍数 || 100"
        :高度="对象数据.attrs.draw_height * 窗口缩放倍数 || 100"
        :窗口缩放倍数="窗口缩放倍数"
        :画布原点="{ x: 0, y: 0 }"
      >
      </cc-draw>
    </vue-draggable-resizable>
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
              z-index:5
        
        `"
          @dblclick="开始连接()"
        >
          <span>{{ index }}</span>
          <span
            class="el-icon-siyuan"
            aria-label="卡片已经连接到思源块,点击更换源"
            v-if="对象数据.attrs.def_block"
          ></span>

          <span class="subtypetag" v-if="$当前窗口状态.showsubtype">
            {{ 对象数据.subtype }}
          </span>
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
          >
          </cc-link-siyuan>

          <div
            v-html="思源HTML || 预览HTML"
            class="protyle-wysiwyg protyle-wysiwyg--attr"
            :style="`font-size:xx-small;color:${对象数据.attrs.color}`"
          ></div>
        </div>
      </el-popover>

      <div v-if="激活" class="cc-card-toolbar">
        <span aria-label="卡片序号">{{ index }}</span>
        <span aria-label="删除卡片" class="el-icon-delete" v-on:click="删除()"></span>
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
        width:${对象数据.attrs.width - 21 - (对象数据.attrs.borderWidth || 1) * 2 + 'px'};
        height:${
          对象数据.attrs.height - 21 - (对象数据.attrs.borderWidth || 1) * 2 + 'px'
        };

        `"
        @click="鼠标点击($event)"
      >
        <div v-if="对象数据.type !== 'board'" style="z-index: 5">
          <el-row>
            <el-col :span="18">
              <el-input
                :key="对象数据.id"
                size="mini"
                class="cc-card-name"
                :ref="'cardname' + 对象数据.id"
                autofix="ture"
                @input="保存数据($event)"
                @change="保存数据($event)"
                v-model="对象数据.name"
                type="textarea"
              >
                <span
                  class="el-icon-siyuan"
                  @click="发送卡片数据到思源()"
                  aria-label="卡片已经连接到思源块,点击更换目标"
                  v-if="对象数据.attrs.def_block"
                  slot="prepend"
                ></span>
              </el-input>
            </el-col>
            <el-col :span="6">
              <span class="subtypetag">{{ 对象数据.subtype }}</span>
            </el-col>
          </el-row>
        </div>
        <div>
          <span v-if="对象数据.attrs.def_block && $当前窗口状态.show_markdown_by_default"
            >连接到思源块:</span
          >
        </div>
        <div
          class="cc-card-content"
          @click="开始编辑($event)"
          style="position: absolute; top: 100px; bottom: 0%; width: calc(100% - 20px)"
        >
          <div :style="`color:${对象数据.attrs.color};`"></div>
          <cc-vditor-vue
            v-model="markdown"
            @click="开始编辑($event)"
            v-if="正在编辑 && (!思源HTML || $当前窗口状态.show_markdown_by_default)"
            :toolbarconfig="{ hide: false }"
          >
          </cc-vditor-vue>
          <div
            @click="开始编辑($event)"
            v-if="!正在编辑 && !(思源HTML && !$当前窗口状态.show_markdown_by_default)"
            v-html="预览HTML"
          ></div>
          <div
            class="protyle-wysiwyg protyle-wysiwyg--attr"
            v-if="思源HTML && !$当前窗口状态.show_markdown_by_default"
            style="margin: 0%; padding: 0%; width: 100%; height: 100%"
          >
            <iframe
              @dblclick="开始连接()"
              ref="siyuanEditor"
              :src="`/stage/build/mobile?id=${def_block}`"
              data-src=""
              border="0"
              frameborder="no"
              framespacing="0"
              allowfullscreen="true"
              style="margin: 0%; padding: 0%; width: 100%; height: 100%"
              @load="修改编辑器()"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
module.exports = {
  name: "cc-block-card",
  props: ["value", "index", "窗口缩放倍数", "数据类型"],
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
      绘制中: false,
      markdown: "",
      drawResize: false,
      临时点数组: [],
      保存计数: 0,
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
    window.addEventListener("scroll", this.计算可见性);
    this.获取预设(this.value);
    this.$事件总线.$on("保存卡片", (event) => this.判断id(event));
    this.$事件总线.$on("保存链接", (event) => this.判断id(event));
    this.$事件总线.$on("保存数据", (event) => this.判断id(event));
    this.$事件总线.$on("删除数据", (event) => this.判断id(event));
    this.$事件总线.$on("接收数据", (event) => this.判断id(event));
  },

  watch: {
    绘制中(val, oldval) {
      if (!val) {
        !this.对象数据.attrs.draw ? (this.对象数据.attrs.draw = []) : null;
        this.对象数据.attrs.draw.push({
          points: this.临时点数组,
          stroke: this.$当前窗口状态.画笔颜色,
          strokeWidth: this.$当前窗口状态.画笔宽度,
        });
        this.临时点数组 = [];
      }
    },
    value: {
      handler: function (val, oldval) {
        this.计算可见性();
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        if (parseInt(val.updated) <= parseInt(this.对象数据.updated)) {
          //  console.log(val.updated, this.对象数据.updated);
          return null;
        }
        if (!val.attrs || (val.attrs && val.attrs.trashed)) {
          this.删除();
          return null;
        }

        this.对象数据 = JSON.parse(JSON.stringify(val));
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
        if (this.def_block + "" != val.attrs.def_block + "") {
          //   console.log(this.def_block, val.attrs.def_block);
          this.def_block = val.attrs.def_block;
          this.生成html();
        }
        if (this.markdown != val.markdown) {
          this.markdown = val.markdown;
        }
        let 拷贝对象 = JSON.parse(JSON.stringify(val));
        let 拷贝旧对象 = JSON.parse(JSON.stringify(oldval || "{}"));

        拷贝对象.updated = "";
        拷贝旧对象.updated = "";
        if (
          JSON.stringify(拷贝对象) !== JSON.stringify(拷贝旧对象) &&
          !val.attrs.trashed
        ) {
          console.log("保存数据");
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
          this.生成html();
        } else {
          try {
            this.显示控制柄 = true;
            this.生成html();
          } catch (e) {}
        }
        this.保存数据();
      },
      immediate: true,
    },
    激活(val) {
      if (this.$当前窗口状态.current_workspace_handle) {
        this.更新卡片markdown();
      }
      if (val) {
        //    console.log("hhhh", this.对象数据);
        this.$事件总线.$emit("激活数据", this.对象数据);
        this.生成html();
        //    console.log(this.$当前窗口状态.is_drawing);
        this.drawResize = this.$当前窗口状态.is_drawing;
      } else {
        this.$事件总线.$emit("反激活数据", this.对象数据);
        this.正在编辑 = false;
        this.生成html();
        this.drawResize = false;
      }
    },
    正在编辑(val) {
      if (this.$当前窗口状态.current_workspace_handle) {
        this.更新卡片markdown();
      }
      if (val) {
        //console.log(this.对象数据);
      } else {
        this.生成html();
      }
    },
    markdown(val) {
      this.对象数据.markdown = val;
      this.对象数据 = this.$更新数据时间戳(this.对象数据);
      this.生成html();
    },
  },
  computed: {
    tempLineConfig: function () {
      return {
        x: 0,
        y: 0,
        closed: false,
        points: this.临时点数组,
        stroke: this.$当前窗口状态.画笔颜色 || "black",
        lineCap: "round",
        strokeWidth: this.$当前窗口状态.画笔宽度 || 5,
        scaleX: this.窗口缩放倍数 || 1,
        scaleY: this.窗口缩放倍数 || 1,
      };
    },
    top: function () {
      let a =
        (this.对象数据.attrs.top + (this.对象数据.attrs.offsety || 0)) *
          this.窗口缩放倍数 || 0;
      return a;
    },
    left: function () {
      let a =
        (this.对象数据.attrs.left + (this.对象数据.attrs.offsetx || 0)) *
          this.窗口缩放倍数 || 0;
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
    async 修改编辑器() {
      let that = this;
      if (!that.$refs.siyuanEditor) {
        return null;
      }
      let 编辑器 = that.$refs.siyuanEditor;
      console.log("编辑器窗口加载");
      let 编辑器DOM = 编辑器.contentDocument;
      let 编辑器窗口 = 编辑器.contentWindow;
      //console.log(编辑器DOM);
      //console.log(编辑器窗口.siyuan);
      if (!编辑器窗口.siyuan.mobileEditor) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
      if (!编辑器DOM) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
      clearTimeout(that.修改编辑器);

      setTimeout(function () {
        let 编辑器DOM = 编辑器.contentDocument;
        let 编辑器窗口 = 编辑器.contentWindow;
        if (!编辑器DOM) {
          setTimeout(that.修改编辑器, 100);
          return null;
        }

        try {
          that.打开块id(that.def_block, 编辑器DOM);
        } catch (e) {
          setTimeout(that.修改编辑器, 100);

          return null;
        }
        编辑器DOM ? (编辑按钮 = 编辑器DOM.getElementById("toolbarEdit")) : null;
        //console.log(编辑按钮);
        let 点击事件 = 编辑器DOM.createEvent("MouseEvents");
        点击事件.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        编辑按钮.dispatchEvent(点击事件);
        console.log("点击触发");
        编辑器窗口.siyuan.mobileEditor.protyle.block.id = that.def_block;
        编辑器窗口.siyuan.mobileEditor.protyle.block.mode = 0;
        编辑器窗口.siyuan.mobileEditor.protyle.block.showAll = true;
        编辑器窗口.addEventListener("dbclick", that.开始连接);
        编辑器DOM.addEventListener("dbclick", that.开始连接);
      }, 100);
    },

    打开块id: function (id, 主界面) {
      let that = this;
      console.log("测试", 主界面);
      if (!主界面) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
      let target = 主界面.querySelector(".protyle-breadcrumb>.protyle-breadcrumb__bar");
      if (target) {
        let item = 主界面.createElement("span");
        item.setAttribute("data-node-id", id);
        target.appendChild(item);
        item.click();
        item.remove();
      } else {
        setTimeout(async () => that.打开块id(id, 主界面), 100);
      }
    },
    configDraw: function () {
      let 窗口缩放倍数 = this.窗口缩放倍数 || 1;
      return {
        width: this.对象数据.attrs.draw_width * 窗口缩放倍数 || 100,
        height: this.对象数据.attrs.draw_height * 窗口缩放倍数 || 100,
        scaleX: 窗口缩放倍数 || 1,
        scaleY: 窗口缩放倍数 || 1,
      };
    },

    lineConfig: function (线定义) {
      return {
        x: 0,
        y: 0,
        points: 线定义.points,
        closed: false,
        stroke: 线定义.stroke,
        lineCap: "round",
        strokeWidth: 线定义.strokeWidth,
        scaleX: this.窗口缩放倍数 || 1,
        scaleY: this.窗口缩放倍数 || 1,
      };
    },
    绘制($event) {
      let evt = $event.evt;
      evt.stopPropagation();
      //   console.log(evt.offsetX);
      let 临时点数组 = this.临时点数组;
      if (this.绘制中 && this.$当前窗口状态.is_drawing) {
        let 点 = [evt.offsetX, evt.offsetY];
        if (this.窗口缩放倍数) {
          点 = [
            点[0] / this.窗口缩放倍数 / this.窗口缩放倍数,
            点[1] / this.窗口缩放倍数 / this.窗口缩放倍数,
          ];
        }
        let 上一个点 = [
          临时点数组[临时点数组.length - 1],
          临时点数组[临时点数组.length - 2],
        ];
        if (上一个点[1]) {
          let 距离 = [点[0] - 上一个点[0], 点[1] - 上一个点[1]];

          let 真实点 = [上一个点[0] + 距离[0], 上一个点[1] + 距离[1]];
          点 = 真实点;
        }
        this.临时点数组 = this.临时点数组.concat(点);
      }
    },
    async 更新卡片markdown() {
      let 工作空间句柄 = this.$当前窗口状态.current_workspace_handle;
      let 卡片markdown = await this.$保存markdown卡片数据(this.对象数据, 工作空间句柄);
      // console.log(卡片markdown);
      this.markdown = 卡片markdown;
    },
    覆盖markdown() {
      let html = this.思源html;
      let 思源markdown = lute.BlockDOM2Md(this.思源HTML);
      思源markdown = this.去除ial(思源markdown);
      this.markdown = 思源markdown;
      this.生成html();
    },
    去除ial(markdown) {
      markdown = markdown.replace(/\n\{\:(.*?)\}\n/g, "");
      markdown = markdown.replace(/\{\:(.*?)\}/g, "");

      return markdown;
    },
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
      this.对象数据 = this.$更新数据时间戳(this.对象数据);

      this.保存数据();
    },
    发送卡片数据到思源: function () {
      this.$事件总线.$emit("打开发送对话框", this.对象数据);
    },
    开始编辑($event) {
      $event.stopPropagation();
      this.正在编辑 = true;
    },
    鼠标点击($event) {
      //  console.log($event);
      $event.stopPropagation();
      this.正在编辑 = false;

      this.$事件总线.$emit("鼠标点击卡片", this.对象数据, $event.ctrlKey);
    },
    判断id: function ($event) {
      let that = this;
      // console.log("sss", $event, this.对象数据);

      if (!$event) {
        return null;
      }
      if ($event.attrsproxy) {
        return null;
      }
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
      this.对象数据.content = el.innerText;
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
          if (this.$当前窗口状态.reload_markdown_by_default) {
            this.覆盖markdown();
          }
        } else this.思源HTML = "获取思源块内容失败";
      }
    },
    开始连接() {
      //console.log("开始连接");
      if (this.正在编辑) {
        return null;
      }
      this.$事件总线.$emit("开始连接", this.对象数据);
    },
    删除() {
      if (this.开始监听 == true) {
        if (this.对象数据.attrs) {
          this.对象数据.attrs.trashed = true;
        }
        //console.log("删除");

        this.$事件总线.$emit("删除数据", this.对象数据);
      }
    },
    dblclick: function () {
      this.$emit("dblclick");
    },
    展开链接: function () {
      this.$emit("callbacklink", this.对象数据.attrs.def_block);
    },
    计算坐标: function (x, y) {
      let 窗口缩放倍数 = this.窗口缩放倍数 || 1;
      let attrs = this.对象数据.attrs;
      let top = attrs.top;
      let left = attrs.left;
      let offsetx = attrs.offsetx;
      let offsety = attrs.offsety;
      if (this.数据类型 == "card") {
        top = y / 窗口缩放倍数;
        left = x / 窗口缩放倍数;
        offsety = 0;
        offsetx = 0;
      }
      if (this.数据类型 == "link") {
        offsety = y / 窗口缩放倍数 - (top || 0);
        offsetx = x / 窗口缩放倍数 - (left || 0);
      }
      this.对象数据.attrs.top = top;
      this.对象数据.attrs.left = left;
      this.对象数据.attrs.offsetx = offsetx;
      this.对象数据.attrs.offsety = offsety;
      this.对象数据 = this.$更新数据时间戳(this.对象数据);
    },
    dragging: function (x, y) {
      this.计算坐标(x, y);
      this.保存计数 = this.保存计数 + 1;
      if (this.保存计数 >= 10) {
        this.保存数据();
        this.保存计数 = 0;
      }
      this.$事件总线.$emit("移动卡片", this.对象数据);
    },
    dragstop(x, y) {
      this.计算坐标(x, y);
      if (this.$当前窗口状态.current_workspace_handle) {
        this.更新卡片markdown();
      }
      this.保存数据();

      this.$事件总线.$emit("移动卡片", this.对象数据);
    },
    resizing: function (x, y, width, height) {
      this.计算坐标(x, y);
      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;

      this.保存数据();
      this.$事件总线.$emit("缩放卡片", this.对象数据);
    },
    drawresizing: function (x, y, width, height) {
      // console.log(width, height);
      this.对象数据.attrs.draw_offsetX = x;
      this.对象数据.attrs.draw_offsetY = y;

      this.对象数据.attrs.draw_width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.draw_height = height / this.窗口缩放倍数 || 100;
      this.保存数据();
    },
    resizestop: function (x, y, width, height) {
      this.计算坐标(x, y);
      this.对象数据.attrs.width = width / this.窗口缩放倍数 || 100;
      this.对象数据.attrs.height = height / this.窗口缩放倍数 || 100;
      if (this.$当前窗口状态.current_workspace_handle) {
        this.更新卡片markdown();
      }
      this.保存数据();
    },
    保存数据: async function ($event) {
      //console.log(this.对象数据);

      $event ? (this.对象数据.name = $event) : null;

      this.对象数据 = this.$更新数据时间戳(this.对象数据);
      this.$事件总线.$emit("保存数据", this.对象数据);
      this.激活 ? this.$事件总线.$emit("当前对象改变", this.对象数据) : null;
    },
    转化为卡片: function () {
      let 新数据 = JSON.parse(JSON.stringify(this.对象数据));
      this.$事件总线.$emit("链接转化为卡片", 新数据);
      this.删除();
    },
    计算可见性: function () {
      this.hide = true;
      let 对象数据 = this.对象数据;
      if (!对象数据.attrs) {
        this.删除();
        return null;
      }
      let $当前窗口状态 = this.$当前窗口状态;
      let 缩放倍数 = $当前窗口状态.缩放倍数;
      if (this.对象数据 && this.对象数据.attrs.top < 0) {
        this.对象数据.attrs.top = 0;
      }
      if (this.对象数据 && this.对象数据.attrs.left < 0) {
        this.对象数据.attrs.left = 0;
      }
      let pageYOffset = window.pageYOffset;
      let pageXOffset = window.pageXOffset;
      let innerHeight = window.innerHeight;
      let innerWidth = window.innerWidth;
      let top = 对象数据.attrs.top;
      let left = 对象数据.attrs.left;
      let offsety = 对象数据.attrs.offsety;
      let offsetx = 对象数据.attrs.offsetx;
      let height = 对象数据.attrs.height;
      let width = 对象数据.attrs.width;
      if (
        pageYOffset > (top + offsety + height) * 缩放倍数 ||
        pageYOffset + innerHeight < (top + offsety) * 缩放倍数 ||
        pageXOffset > (left + offsetx + width) * 缩放倍数 ||
        (pageXOffset + innerWidth < (left + offsetx) * 缩放倍数 && left > 0 && top > 0)
      ) {
        // 不可见标记数组.push(标记);
        this.hide = true;
      } else {
        this.hide = false;
      }
      if (对象数据.type == "link" && 对象数据.attrs.hidetag) {
        this.hide = true;
      }
      if (对象数据.type == "link" && typeof 对象数据.attrs.hidetag == "undefined") {
        this.hide = !this.$当前窗口状态.show_tag_by_default;
        this.$数据库.links
          .filter((data) => {
            if (data.attrs.from_id == 对象数据.id || data.attrs.to_id == 对象数据.id) {
              return true;
            }
          })
          .count((count) => {
            count > 0 ? (this.hide = false) : null;
          });
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
