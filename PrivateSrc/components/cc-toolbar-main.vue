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
    <el-row>
      <el-col :span="21">
        <el-col :span="8">
          <el-popover trigger="click">
            <span>打开画板</span>
            <el-select v-model="当前画板id" size="mini">
              <el-option
                v-for="(item, i) in 画板列表"
                :label="item.name || item.id"
                :value="item.id"
              >
                <el-tooltip trigger="hover" :content="item.id" placement="top-start">
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </el-option>
            </el-select>
            <div slot="reference" class="el-icon-folder"></div>
          </el-popover>
          <span class="el-icon-download" @click="下载当前版本()"></span>

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
            </el-input>
          </el-col>
          <el-col :span="9">
            <cc-presets-selector
              :数据id="对象数据.id || ''"
              :数据表名="对象数据.type + 's' || ''"
              v-model="当前预设名"
            ></cc-presets-selector>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="3">
        <el-button circle><span class="el-icon-edit"></span></el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-edit",
  props: ["卡片数据id", "链接数据id", "思源伺服ip"],
  components: componentsList,
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
    };
  },
  async mounted() {
    await this.加载数据();
    await this.$画板元数据库.workspace.get(00000).then(data=>console.log(data))
    this.$事件总线.$on("保存卡片", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("保存链接", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("激活卡片", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("激活链接", ($event) => this.获取当前元素数据($event));
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
          // console.log(val);
        }
      },
    },
  },
  methods: {
    
    加载数据: async function () {
      let that = this;
      await this.从思源块加载数据()
      try {
        that.背景色 = (await that.$数据库.metadata.get("backgroundColor")).value;
      } catch (e) {
        that.背景色 = "var(--b3-theme-background)";
        that.$数据库.metadata.put({ key: "customcolors", value: [] });
      }

      that.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${that.对象数据.id}&baseid=${that.$baseid}`;
      // console.log(that.画板列表);
    },
    获取当前元素数据: function ($event) {
      if ($event) {
        if ($event.id == this.卡片数据id || $event.id == this.链接数据id) {
          this.对象数据 = $event || this.对象数据;
          this.属性对象 = this.对象数据.attrs;
          this.当前对象名称 = this.对象数据.name;
          this.预设名 = $event.subtype || this.预设名;
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${this.$baseid}&table=cards`;
        }
      }
    },
    从思源块加载数据: async function (id) {
      let that = this;
      let filepath = `assets/data-${id}.cccards`;
      if (this.$挂件模式()) {
        this.挂件自身元素 = window.frameElement.parentElement.parentElement;

        filepath =
          this.挂件自身元素.getAttribute("data-assets") ||
          this.挂件自身元素.getAttribute("custom-data-assets") ||
          `assets/data-${this.挂件自身元素.getAttribute("data-node-id")}.cccards`;
      }
      let url = this.思源伺服ip?`http://${this.思源伺服ip}/${filepath}`:`localhost:6806/${filepath}`;
        console.log(url);
      let 文件数据 = {};
      try {
        await axios.get(url).then((res) => {
          文件数据 = res.data;
          if (文件数据["cardarray"]) {
            try {
              this.图片缩放倍数 = parseFloat(文件数据.resize).toFixed(2);
            } catch (e) {
                  console.log(e);
            }
          }
        });
      } catch (e) {
                console.log(e);

        alert("文件不存在,将在附件中新建文件");
        this.$事件总线.$emit("上传当前画板文件数据到思源");
      }
      if (文件数据) {
        let 卡片数组 = 文件数据["cards"];
        let 链接数组 = 文件数据["links"];
        let metadata = 文件数据["metadata"];
        let 卡片预设 = 文件数据["cardpresets"];
        let 链接预设 = 文件数据["linkpresets"];
        if (卡片数组) {
          for (i in 卡片数组) {
            await this.$数据库.cards.put(卡片数组[i]);
          }
        }
        if (链接数组) {
          for (i in 链接数组) {
            await this.$数据库.links.put(链接数组[i]);
          }
        }
        if (metadata) {
          for (i in metadata) {
            await this.$数据库.metadata.put(metadata[i]);
          }
        }
        if (卡片预设) {
          for (i in 卡片预设) {
            await this.$数据库.cardpresets.put(卡片预设[i]);
          }
        }
        if (链接预设) {
          for (i in 链接预设) {
            await this.$数据库.linkpresets.put(链接预设[i]);
          }
        }
      }
      //     console.log("加载完成");
    },
    聚焦到卡片: function (对象数据) {
      if (this.$当前窗口状态.缩放倍数 < 1) {
        this.$事件总线.$emit("窗口缩放", 1);
      } else {
        this.$事件总线.$emit("窗口缩放", this.$当前窗口状态.缩放倍数);
      }
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
              if (markdown.indexOf(关键词) > 0) {
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
              if (markdown.indexOf(关键词) > 0) {
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
      //    console.log("搜索结果", this.搜索结果列表);
    },
  },
  computed: {},
};
</script>
