<template>
  <div
    style="
      border: solid 0.01vw;
      border-radius: 0.2vw;
      position: fixed;
      top: 90vh;
      left: calc(50vw - 300px);
      background-color: white;
      z-index: 251;
      padding: 0.2vw;
      width: 600px;
      justify-content: center;
    "
  >
    <el-row type="flex" align="middle">
      <el-col :span="21">
        <el-col :span="8">
          <el-popover trigger="click">
            <span>打开画板</span>
            <cc-select-boards></cc-select-boards>
            <div slot="reference" class="el-icon-folder"></div>
          </el-popover>
          <span
            class="el-icon-download"
            aria-label="导出当前画板数据"
            @click="下载当前版本()"
          ></span>
          <el-popover trigger="click" placement="top" :height="500">
            <el-input v-model="搜索关键词" @input="搜索()" size="mini"></el-input>
            <div v-for="(item, i) in 搜索结果列表">
              <el-link :value="item.id" @click="聚焦到卡片(item)">
                <span>{{ `id:${item.id}` }}</span>
                <span>{{ `${item.markdown.slice(0, 22) || 无内容}` }}</span>
              </el-link>
            </div>
            <div slot="reference" @focus="搜索()" class="el-icon-zoom-in"></div>
          </el-popover>
          <el-popover trigger="hover" placement="top" :height="500">
            <div>
              <el-link aria-label="搜索思源块并新建" @click="添加卡片()"
                >新建到已有文档的子文档</el-link
              >
            </div>
            <div>
              <el-link aria-label="搜索思源块并新建" @click="添加卡片('链接到')"
                >链接到已有文档</el-link
              >
            </div>
            <span slot="reference" class="el-icon-siyuan"></span>
          </el-popover>
          <div class="el-icon-help" @click="聚焦到卡片(对象数据)"></div>

          <span class="el-icon-browser" @click="$窗口内打开超链接(画板超链接)"></span>
          <el-popover :width="350">
            <cc-setter-board-background></cc-setter-board-background>

            <span slot="reference" class="el-icon-picture"></span>
          </el-popover>
        </el-col>
        <strong style="font-size: small">{{ 当前画板命名 }}</strong>
        <span style="font-size: small" v-if="属性对象"
          >当前元素坐标 x:{{ parseInt(属性对象.left) }}y{{ parseInt(属性对象.top) }}</span
        >
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model="当前对象名称" size="mini" @input="修改对象名称()">
              <span slot="prepend">名称</span>
              <span
                v-if="对象数据.attrs && 对象数据.attrs.def_block"
                slot="append"
                @click="添加卡片名称到思源块别名()"
                aria-label="发送为别名"
                >A</span
              >
            </el-input>
          </el-col>
          <el-col :span="9">
            <cc-presets-selector
              v-if="对象数据.id"
              :数据id="对象数据.id || ''"
              :数据表名="对象数据.type + 's' || ''"
              v-model="当前预设名"
            ></cc-presets-selector>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="3">
        <div>
          <el-button circle size="mini" @click="重新加载窗口()" aria-label="重新加载窗口">
            <el-link class="el-icon-refresh"></el-link>
          </el-button>
          <el-button circle size="mini" aria-label="创建新的画板">
            <el-link
              class="el-icon-plus"
              :href="`http://${this.思源伺服ip}/widgets/cc-image-tag-new/?baseid=${新画板id}`"
            ></el-link>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-main",
  props: ["卡片数据id", "链接数据id", "思源伺服ip"],
  data() {
    return {
      当前预设名: "",
      apitoken: "",
      数据源id: {},
      属性对象: {},
      对象数据: {},
      搜索关键词: "",
      搜索结果id: "",
      搜索结果列表: "",
      当前画板id: "",
      画板列表: [],
      当前画板命名: "",
      画板超链接: `http://${this.思源伺服ip}/widgets/cc-image-tag-new/?baseid=${this.$baseid}`,
      当前对象名称: "",
      timer: {},
      使用svg渲染: false,
      新画板id: "",
    };
  },
  mounted() {
    this.新画板id = Lute.NewNodeID();
    this.$事件总线.$on("保存数据", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("激活数据", ($event) => (this.对象数据 = $event));
  },
  watch: {
    使用svg渲染: function (val) {
      this.$当前窗口状态.使用svg = val;
    },
    当前画板命名: {
      handler: async function (val, oldval) {
        this.$事件总线.$emit("修改画板元数据", { key: "name", value: val });
      },
    },
    当前画板id: {
      handler: function (val, oldval) {
        this.$窗口内打开超链接(`/widgets/cc-image-tag-new/?baseid=${val}`);
      },
    },
    卡片数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.获取当前元素数据();
        }
      },
    },
    链接数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.获取当前元素数据();
        }
      },
    },
    搜索结果id: {
      handler: async function (val, oldval) {
        if (val) {
          // //console.log(val);
        }
      },
    },
  },
  methods: {
    创建新画板: function () {
      let id = Lute.NewNodeID();
      window.location.reload(true);
      let 链接 = `http://${this.思源伺服ip}/widgets/cc-image-tag-new/?baseid=${id}`;
      let newwindow = window.open(null, "");
      newwindow.href = 链接;
    },
    重新加载窗口: function () {
      window.location.reload(true);
    },
    添加卡片名称到思源块别名: async function () {
      let 卡片名称 = this.当前对象名称;
      let 思源块内容 = await 以id获取思源块信息(
        this.思源伺服ip,
        this.apitoken,
        this.对象数据.attrs.def_block
      );
      let alias = 思源块内容.alias;
      let 别名数组 = [];
      alias ? (别名数组 = alias.split(",")) : [];
      别名数组.push(卡片名称.replace(",", ""));
      别名数组 = Array.from(new Set(别名数组));
      alias = 别名数组.join(",");
      await 设置思源块属性(
        this.思源伺服ip,
        this.apitoken,
        this.对象数据.attrs.def_block,
        "alias",
        alias
      );
    },

    获取当前元素数据: function ($event) {
      if ($event.attrsproxy) {
        return null;
      }
      if (
        $event &&
        $event.attrs &&
        $event.id == this.对象数据.id &&
        $event.updated >= this.对象数据.updated
      ) {
        this.对象数据 = $event || this.对象数据;
        this.属性对象 = this.对象数据.attrs;
        this.当前对象名称 = this.对象数据.name;
        this.预设名 = $event.subtype || this.预设名;
        this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${this.$baseid}&table=cards`;
      }
    },
    聚焦到卡片: function (对象数据) {
      this.$事件总线.$emit("窗口缩放", this.$当前窗口状态.缩放倍数);

      this.$事件总线.$emit("定位至卡片", 对象数据);
    },
    添加卡片: function (def) {
      let 卡片数据 = this.$根据属性生成卡片({});
      (卡片数据.attrs.top =
        (window.pageYOffset + window.innerHeight / 2 - 50) / this.$当前窗口状态.缩放倍数),
        (卡片数据.attrs.left =
          (window.pageXOffset + window.innerWidth / 2 - 50) /
          this.$当前窗口状态.缩放倍数);
      if (def) {
        卡片数据.attrs.def_block = def;
      }
      this.$事件总线.$emit("添加卡片", 卡片数据, true);
    },

    修改对象名称: async function () {
      if (this.对象数据.type == "card") {
        let 真实数据 = await this.$数据库.cards.get(this.对象数据.id);
        真实数据.name = this.当前对象名称;
        this.$事件总线.$emit("保存卡片", 真实数据);
      }
      if (this.对象数据.type == "link") {
        let 真实数据 = await this.$数据库.links.get(this.对象数据.id);
        真实数据.name = this.当前对象名称;
        this.$事件总线.$emit("保存链接", 真实数据);
      }
    },

    搜索: async function () {
      let 关键词 = this.搜索关键词;
      if (关键词) {
        let 卡片列表 = await this.$数据库.cards
          .filter((value) => {
            if (value.markdown) {
              let markdown = value.markdown;
              if (markdown.indexOf(关键词) >= 0) {
                return true;
              }
            } else {
              return false;
            }
          })
          .toArray();
        let 链接列表 = await this.$数据库.links
          .filter((value) => {
            if (value.markdown) {
              let markdown = value.markdown;
              if (markdown.indexOf(关键词) >= 0) {
                return true;
              }
            } else {
              return false;
            }
          })
          .toArray();
        this.搜索结果列表 = 卡片列表.concat(链接列表);
      } else {
        let 卡片列表 = await this.$数据库.cards.toArray();
        let 链接列表 = await this.$数据库.cards.toArray();
        this.搜索结果列表 = 卡片列表.concat(链接列表);
      }
    },
    下载当前版本: async function () {
      let JSON数据 = {};
      JSON数据.cards = await this.$数据库.cards.toArray();
      JSON数据.links = await this.$数据库.links.toArray();
      JSON数据.metadata = await this.$数据库.metadata.toArray();
      JSON数据.cardpresets = await this.$数据库.cardpresets.toArray();
      JSON数据.linkpresets = await this.$数据库.linkpresets.toArray();

      await this.导出版本数据(JSON数据);
    },
    导出版本数据: async function (版本数据) {
      let JSON数据 = 版本数据;
      let 当前画板命名 = await this.$数据库.metadata.get("name").then((data) => {
        return data.value;
      });

      let 文件名 = `${当前画板命名}.cccards`;
      let 文件数据 = this.$从数据生成文件(JSON数据, "application/json", 文件名);
      this.保存(文件数据, 文件名);
    },
    保存: function (blob, filename) {
      let type = blob.type;
      let force_saveable_type = "application/octet-stream";
      if (type && type != force_saveable_type) {
        // 强制下载，而非在浏览器中打开
        var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
      }

      let url = URL.createObjectURL(blob);
      let save_link = document.createElement("a");
      save_link.href = url;
      save_link.download = filename;
      let event = document.createEvent("MouseEvents");
      event.initMouseEvent(
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
      save_link.dispatchEvent(event);
      URL.revokeObjectURL(url);
    },
  },
  computed: {},
};
</script>
