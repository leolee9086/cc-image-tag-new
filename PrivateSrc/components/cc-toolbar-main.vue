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
            <el-row>
              <el-col :span="24">
                <el-input v-model="当前画板命名" size="mini">
                  <span slot="prepend">画板命名</span>
                </el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="space-between">
              <el-col :span="12">
                <el-upload
                  class="upload-demo"
                  accept=".cctag"
                  :http-request="导入旧版JSON数据"
                  :action="`http://${思源伺服ip}/api/asset/upload`"
                  :headers="{ Authorization: 'Token' + apitoken }"
                  :flile-list="JSON文件列表"
                  :multiple="false"
                >
                  <el-button
                    area-label="导入文件"
                    slot="trigger"
                    size="mini"
                    class="el-icon-upload"
                    >导入旧版文件</el-button
                  >
                </el-upload>
              </el-col>
            </el-row>

            <div slot="reference" class="el-icon-setting"></div>
          </el-popover>
          <el-popover trigger="click">
            <span>打开画板</span>
            <el-select v-model="当前画板id" size="mini">
              <el-option
                v-for="(item, i) in this.画板列表"
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
          <el-popover trigger="click">
            <el-upload
              class="upload-demo"
              drag
              accept=".cccards"
              :http-request="覆盖导入JSON数据"
              :action="`http://${思源伺服ip}/api/asset/upload`"
              :headers="{ Authorization: 'Token' + apitoken }"
              :flile-list="JSON文件列表"
              :multiple="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传cccards|cctags文件</div>
            </el-upload>

            <div slot="reference" class="el-icon-upload"></div>
          </el-popover>

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
            <cc-color-pane
              v-model="背景色"
              :自定义颜色数组="自定义颜色数组"
            ></cc-color-pane>

            <el-row>
              <el-col :span="12">
                <cc-assets-selector
                  v-model="背景图片源"
                  :apitoken="apitoken"
                  :思源伺服ip="思源伺服ip"
                  :k="背景图片格式"
                ></cc-assets-selector>
              </el-col>
              <el-col :span="12">
                <el-select v-model="背景图片格式" size="mini" allow-create filterable>
                  <el-option
                    v-for="格式 in 图片格式列表"
                    :label="格式"
                    :value="格式"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-input v-model="背景图片源" size="mini"></el-input>
            <el-input-number size="mini" v-model="背景图像缩放倍数"></el-input-number>
            <el-switch
              v-model="背景图像模式"
              active-text="重复"
              active-value="重复"
              inactive-value="填充"
            ></el-switch>

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
        <el-tooltip content="折叠时是否显示类型">
          <el-switch
            size="mini"
            @change="$当前窗口状态.showsubtype = $event"
            v-model="折叠时显示名称"
          ></el-switch>
        </el-tooltip>
        <el-tooltip content="折叠时是否显示名称">
          <el-switch
            area-label="折叠时是否显示名称"
            @change="$当前窗口状态.showname = $event"
            size="mini"
            v-model="折叠时显示类别"
          ></el-switch>
        </el-tooltip>
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
      背景色: "",
      当前预设名: "",
      apitoken: "",
      数据源id: {},
      属性对象: {},
      对象数据: {},
      自定义颜色数组: [],
      搜索关键词: "",
      搜索结果id: "",
      搜索结果列表: "",
      当前画板id: "",
      画板列表: [],
      当前画板命名: "",
      画板超链接: `http://${this.思源伺服ip}/widgets/cc-image-tag-new/?baseid=${this.$baseid}`,
      显示历史面板: false,
      文件历史列表: [],
      当前对象名称: "",
      JSON文件列表: [],
      timer: {},
      图片格式列表: ["jpg", "png", "jpeg", "svg"],
      背景图片格式: "jpg",
      背景图片源: "",
      背景图像缩放倍数: 1,
      背景图像模式: "填充",
      使用svg渲染: false,
      折叠时显示名称: true,
      折叠时显示类别: true,
    };
  },
  async mounted() {
    this.$事件总线.$on("保存卡片", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("保存链接", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("激活卡片", ($event) => this.获取当前元素数据($event));
    this.$事件总线.$on("激活链接", ($event) => this.获取当前元素数据($event));

    this.timer = setInterval(() => {
      this.保存计数 = this.保存计数 + 1;
    }, 1000);
    this.$事件总线.$on("自定义颜色改变", ($event) => (this.自定义颜色数组 = $event));
  },
  watch: {
    背景色(val) {
      this.$事件总线.$emit("背景色改变", val);
      this.$当前窗口状态.backgroundColor = val;
      this.$数据库.metadata.put({ key: "backgroundColor", value: val });
    },
    自定义颜色数组: {
      handler(val) {
        this.$事件总线.$emit("自定义颜色改变", val);
        this.$数据库.metadata.put({ key: "customcolors", value: val });
        console.log(val);
      },
      deep: true,
    },

    使用svg渲染: function (val) {
      this.$当前窗口状态.使用svg = val;
    },
    背景图像模式: function (val) {
      this.$事件总线.$emit("改变背景图像模式", val);
      this.$数据库.metadata.put({ key: "backgroundtype", value: val });
    },
    背景图像缩放倍数: function (val) {
      this.$事件总线.$emit("缩放背景", val);
      this.$数据库.metadata.put({ key: "backgroundscale", value: val });
    },
    背景图片源: function (val) {
      this.$数据库.metadata.put({ key: "backgroundImage", value: val });
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
    加载数据: function (数据) {
      try {
        this.当前画板命名 = (await this.$数据库.metadata.get("name")).value;
      } catch (e) {
        this.当前画板命名 = "未命名";
        this.$数据库.metadata.put({ key: "name", value: "未命名" });
      }

      try {
        this.背景图片源 = (await this.$数据库.metadata.get("backgroundImage")).value;
      } catch (e) {
        this.背景图片源 = "";
        this.$数据库.metadata.put({ key: "backgroundImage", value: "" });
      }
      try {
        this.自定义颜色数组 = (await this.$数据库.metadata.get("customcolors")).value;
      } catch (e) {
        this.自定义颜色数组 = [];
        this.$数据库.metadata.put({ key: "customcolors", value: [] });
      }
      try {
        this.背景色 = (await this.$数据库.metadata.get("backgroundColor")).value;
      } catch (e) {
        this.背景色 = "var(--b3-theme-background)";
        this.$数据库.metadata.put({ key: "customcolors", value: [] });
      }
      try {
        this.背景图像缩放倍数 = (await this.$数据库.metadata.get("backgroundscale")).value;
      } catch (e) {
        this.背景图像缩放倍数 = 1;

        this.$数据库.metadata.put({ key: "backgroundscale", value: 1 });
      }
      try {
        this.背景图像模式 = (await this.$数据库.metadata.get("backgroundtype")).value;
      } catch (e) {
        this.背景图像模式 = "填充";
        this.$数据库.metadata.put({ key: "backgroundtype", value: "填充" });
      }
      try {
        this.保存时间间隔 = (await this.$数据库.metadata.get("autosaveinteger")).value;
      } catch (e) {
        console.log(e);
        this.保存时间间隔 = 5;
        this.$数据库.metadata.put({ key: "autosaveinteger", value: 5 });
      }
      try {
        this.历史版本数量上限 = (await this.$数据库.metadata.get("maxhistorycount")).value;
      } catch (e) {
        console.log(e);
        this.历史版本数量上限 = 30;
        this.$数据库.metadata.put({ key: "maxhistorycount", value: 30 });
      }

      this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${this.$baseid}`;
      this.画板列表 = await this.$画板元数据库.boards.toArray();
      // console.log(this.画板列表);
      try {
        await this.保存历史();
        await this.从思源块加载数据(this.$baseid);
      } catch (error) {
        console.log("加载出错", error);
        alert("加载挂件块数据失败,注意手动保存数据");
      }
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
      let url = "http://" + this.思源伺服ip + "/" + filepath;
      //  console.log(url);
      let 文件数据 = {};
      try {
        await axios.get(url).then((res) => {
          文件数据 = res.data;
          if (文件数据["cardarray"]) {
            try {
              this.图片缩放倍数 = parseFloat(文件数据.resize).toFixed(2);
            } catch (e) {
              //    console.log(e);
            }
          }
        });
      } catch (e) {
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
