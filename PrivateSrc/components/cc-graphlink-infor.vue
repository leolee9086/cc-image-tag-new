<template>
  <el-card>
    <el-tabs v-model="当前标签">
      <el-tab-pane label="链接" name="链接"></el-tab-pane>
      <el-tab-pane label="卡片" name="卡片"></el-tab-pane>
      <el-card v-if="当前数据 && !def_block" @click="定位至卡片(当前数据)">
        <el-row @click="定位至卡片(当前数据)">
          <el-col :span="18">
            <span>
              {{ 当前数据.name }}
            </span>
          </el-col>
          <el-col :span="3">
            <span
              v-if="当前数据.type == 'link'"
              class="el-icon-view"
              aria-label="显示链接标记"
              @click="显示卡片(当前数据)"
            ></span>
          </el-col>
        </el-row>
        <div @click="定位至卡片(当前数据)" v-html="预览HTML"></div>
      </el-card>
      <iframe
        v-if="当前数据 && def_block"
        @click="定位至卡片(当前数据)"
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
    </el-tabs>
  </el-card>
</template>
<script>
module.exports = {
  name: "cc-graphlink-infor",
  props: ["linkid", "linkdata", "cardid", "carddata"],
  data() {
    return {
      当前链接数据: {},
      当前卡片数据: {},
      当前标签: "链接",
      预览HTML: "",
      def_block: "",
      当前数据: {},
    };
  },
  async mounted() {
    if (this.linkdata) {
      this.当前链接数据 = this.linkdata;
    } else {
      if (this.linkid) {
        this.linkdata = await this.$数据库.links.get(this.linkid);
      }
    }
    if (this.carddata) {
      this.当前卡片数据 = this.carddata;
    } else {
      if (this.cardid) {
        this.当前卡片数据 = await this.$数据库.cards.get(this.cardid);
      }
    }
    this.当前数据 = this.当前链接数据;
  },
  watch: {
    linkdata: {
      handler: function (val) {
        if (val && val.updated > this.当前链接数据.updated) {
          this.当前链接数据 = val;
        }
      },
      deep: true,
      immediate: true,
    },
    carddata: {
      handler: function (val) {
        if (val && val.updated > this.当前卡片数据.updated) {
          this.当前卡片数据 = val;
        }
      },
      deep: true,
      immediate: true,
    },
    当前数据: {
      handler: async function (val) {
        if (val) {
          let that = this;
          let el = window.document.createElement("div");
          el.innerHTML = await Vditor.md2html(val.markdown);
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
          val.attrs ? (this.def_block = val.attrs.def_block) : null;
        }
      },
      deep: true,
    },
    当前标签: {
      handler: function (val) {
        val == "链接"
          ? (this.当前数据 = this.当前链接数据)
          : (this.当前数据 = this.当前卡片数据);
      },
      immediate: true,
    },
  },

  methods: {
    async 修改编辑器() {
      let that = this;
      //console.log("编辑器窗口加载");
      let 编辑器 = that.$refs.siyuanEditor;
      if (!编辑器) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
      let 编辑器DOM = 编辑器.contentDocument;
      let 编辑器窗口 = 编辑器.contentWindow;
      //console.log(编辑器DOM);
      //console.log(编辑器窗口.siyuan);
      if (!编辑器窗口.siyuan) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
      if (!编辑器DOM) {
        setTimeout(that.修改编辑器, 100);
        return null;
      }
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
          that.打开块id(that.当前数据.attrs.def_block, 编辑器DOM);
        } catch (e) {
          console.log(e);
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
        编辑器窗口.siyuan.mobileEditor.protyle.block.id = that.当前数据.attrs.def_block;
        编辑器窗口.siyuan.mobileEditor.protyle.block.mode = 0;
        编辑器窗口.siyuan.mobileEditor.protyle.block.showAll = true;
        编辑器窗口.addEventListener("dbclick", that.开始连接);
        编辑器DOM.addEventListener("dbclick", that.开始连接);
      }, 100);
      let head = 编辑器DOM.head;
      let oldstyle = 编辑器DOM.querySelector("#widgetset");
      oldstyle ? oldstyle.remove() : null;
      let style = 编辑器DOM.createElement("style");
      style.setAttribute("id", "widgetset");
      style.innerHTML = `
      :root{--b3-theme-on-background:${this.当前数据.attrs.color};
      --b3-theme-background:${this.当前数据.attrs.backgroundColor}
      }`;
      head.appendChild(style);
    },
    定位至卡片: function (卡片数据) {
      //console.log(卡片数据);
      卡片数据.id ? this.$事件总线.$emit("定位至卡片", 卡片数据) : null;
    },
    显示卡片: function (卡片数据) {
      if (卡片数据.id) {
        卡片数据.attrs.hidetag = false;
        this.$事件总线.$emit("显示卡片", 卡片数据);
      }
    },
  },
};
</script>
