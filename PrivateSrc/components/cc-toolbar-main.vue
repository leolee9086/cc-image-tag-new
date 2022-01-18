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
      <el-button @click="file()"> </el-button>

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
                <el-button
                  size="mini"
                  class="el-icon-time"
                  aria-label="显示|隐藏文件历史"
                  @click="显示历史面板 = !显示历史面板"
                  >查看历史版本</el-button
                >
              </el-col>
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
                </el-upload></el-col
              >
            </el-row>
            <el-tooltip content="保存时间间隔,单位为秒">
              <el-input-number
                size="mini"
                :min="1"
                :max="600"
                v-model="保存时间间隔"
              ></el-input-number>
            </el-tooltip>
            <el-tooltip content="历史版本数量限制,调整之后会按照时间顺序删除超限旧版本">
              <el-input-number
                size="mini"
                :min="5"
                :max="100"
                v-model="历史版本数量上限"
              ></el-input-number>
            </el-tooltip>

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
          <el-popover :width="300">
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
                  <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>

            <el-input v-model="背景图片源" size="mini"></el-input>
            <el-input-number
              size="mini"
              v-if="背景图像模式 == '填充'"
              v-model="背景图像缩放倍数"
            ></el-input-number>
            <el-switch
              v-model="背景图像模式"
              active-text="填充"
              inactive-text="重复"
              active-value="填充"
              inactive-value="重复"
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
            >
            </cc-presets-selector>
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
    <el-drawer :modal="false" title="历史版本" :visible.sync="显示历史面板">
      <el-timeline>
        <el-timeline-item
          v-for="(版本, 序号) in 文件历史列表"
          :key="序号"
          :timestamp="`${版本.timestamp.slice(0, 4)}年${版本.timestamp.slice(
            4,
            6
          )}月${版本.timestamp.slice(6, 8)}日${版本.timestamp.slice(
            8,
            10
          )}时${版本.timestamp.slice(10, 12)}分${版本.timestamp.slice(12, 14)}秒 `"
          placement="top"
        >
          <el-card>
            <strong>{{ 版本.metadata[版本.metadata.length - 1]["value"] }}</strong>

            <div>
              卡片数量:{{ 版本.cards.length }} 链接数量:{{ 版本.links.length }}
              <span
                aria-label="删除这个版本"
                class="el-icon-delete"
                @click="删除版本数据(版本)"
              ></span>
              <span
                aria-label="回滚到这个版本"
                class="el-icon-check"
                @click="应用版本数据(版本)"
              ></span>
              <span
                aria-label="导出版本数据"
                class="el-icon-download"
                @click="导出版本数据(版本)"
              ></span>
              <span
                aria-label="导出markdown压缩包"
                class="el-icon-markdown"
                @click="导出版本markdown(版本)"
              ></span>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
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
      保存时间间隔: 5,
      历史版本数量上限: 30,
      timer: {},
      保存计数: 1,
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
    this.timer = setInterval(() => {
      this.保存计数 = this.保存计数 + 1;
    }, 1000);
  },
  watch: {
    保存时间间隔: async function (val) {
      if (val) {
        await this.$数据库.metadata.put({ key: "autosaveinteger", value: val });

        this.保存数据();
        this.保存计数 = 1;
        if (val * this.历史版本数量上限 <= 60) {
          alert("历史版本覆盖时长小于一分钟,请注意");
        }
      }
    },
    历史版本数量上限: async function (val) {
      if (val) {
        await this.$数据库.metadata.put({ key: "maxhistorycount", value: val });

        this.保存数据();
        this.保存计数 = 1;
        if (val * this.保存时间间隔 <= 60) {
          alert("历史版本覆盖时长小于一分钟,请注意");
        }
      }
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
    保存计数(val) {
      if (val >= this.保存时间间隔) {
        this.保存数据();
        this.保存计数 = 1;
      }
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
    file() {
      window.file();
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
    保存数据: async function () {
      await this.保存历史();

      this.$事件总线.$emit("上传当前画板文件数据到思源");
    },
    覆盖导入JSON数据: async function (data) {
      let that = this;
      await this.清空画板();

      // console.log("aaa", data.file);
      var reader = new FileReader();
      reader.onload = function (evt) {
        that.增量导入JSON数据(JSON.parse(evt.target.result));
        //  console.log(evt.target.result);
      };

      reader
        .readAsText(data.file)
        .then((result) => {
          that.增量导入JSON数据(JSON.parse(result));
        })
        .catch((err) => {
          //   console.log(err);
        });
    },
    导入旧版JSON数据: async function (data) {
      let that = this;
      await that.保存历史();
      await this.清空画板();

      // console.log("aaa", data.file);
      var reader = new FileReader(data.file);
      reader.onload = function (evt) {
        that.解析旧版JSON数据(JSON.parse(evt.target.result));
        //  console.log(evt.target.result);
      };

      reader
        .readAsText(data.file)
        .then((result) => {
          that.解析旧版JSON数据(JSON.parse(result));
        })
        .catch((err) => {
          //  console.log(err);
        });
    },
    解析旧版JSON数据: async function (旧版JSON数据) {
      //   console.log(旧版JSON数据);
      for (标记序号 in 旧版JSON数据.tagarray) {
        let 标记 = 旧版JSON数据.tagarray[标记序号];
        let 空标签 = this.$根据属性生成卡片();
        //   console.log(空标签);
        空标签.name = 标记.anchor;
        空标签.attrs.backgroundColor = 标记.backgroundColor;
        空标签.attrs.borderColor = 标记.borderColor;
        空标签.attrs.color = 标记.color;
        空标签.attrs.left = 标记.left;
        空标签.attrs.top = 标记.top;
        空标签.attrs.def_block = 标记.def_block;
        await this.$数据库.cards.put(空标签);
      }
    },
    增量导入JSON数据: async function (JSON数据) {
      //   console.log(JSON数据);
      let cards = JSON数据.cards;
      let links = JSON数据.links;
      let metadata = JSON数据.metadata;
      let cardpresets = JSON数据.cardpresets;
      let linkpresets = JSON数据.linkpresets;

      try {
        for (i in cards) {
          await this.$数据库.cards.add(cards[i]);
        }
        for (i in links) {
          await this.$数据库.links.add(links[i]);
        }
        for (i in metadata) {
          await this.$数据库.metadata.add(metadata[i]);
        }
        for (i in linkpresets) {
          await this.$数据库.linkpresets.add(linkpresets[i]);
        }
        for (i in cardpresets) {
          await this.$数据库.cardpresets.add(cardpresets[i]);
        }
      } catch (e) {
        alert("导入出错", e);
      }
    },
    删除版本数据: async function (版本数据) {
      await this.$数据库.history.delete(版本数据.id);
      this.文件历史列表 = await this.$数据库.history.toArray();
    },
    清空画板: async function () {
      await this.$数据库.cards.clear();
      await this.$数据库.links.clear();
      await this.$数据库.metadata.clear();
      await this.$数据库.cardpresets.clear();
      await this.$数据库.linkpresets.clear();
    },
    应用版本数据: async function (版本数据) {
      await this.保存历史();
      await this.清空画板();
      let historycards = 版本数据.cards;
      for (i in historycards) {
        try {
          await this.$数据库.cards.add(historycards[i]);
        } catch (e) {
          //    console.log(historycards[i], i, e);
        }
      }
      let historylinks = 版本数据.links;
      for (j in historycards) {
        try {
          await this.$数据库.links.add(historylinks[j]);
        } catch (e) {
          //  console.log(historylinks[j], j, e);
        }
      }
      let historymeta = 版本数据.metadata;
      for (j in historymeta) {
        try {
          await this.$数据库.metadata.add(historymeta[j]);
        } catch (e) {
          //  console.log(historylinks[j], j, e);
        }
      }
      let historycardpresets = 版本数据.cardpresets;
      for (j in historycardpresets) {
        try {
          await this.$数据库.cardpresets.add(historycardpresets[j]);
        } catch (e) {
          //  console.log(historylinks[j], j, e);
        }
      }
      let historylinkpresets = 版本数据.linkpresets;
      for (j in historylinkpresets) {
        try {
          await this.$数据库.linkpresets.add(historylinkpresets[j]);
        } catch (e) {
          //  console.log(historylinks[j], j, e);
        }
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
    导出版本markdown: async function (版本数据) {
      let that = this;
      let cards = {};
      let links = {};
      cards = 版本数据.cards;
      links = 版本数据.links;
      let zip = new JSZip();
      for (i in cards) {
        try {
          let yaml = this.生成yaml(cards[i]);
          let markdown = yaml + cards[i]["markdown"];
          zip.file(`${"卡片" + i + cards[i]["name"]}.md`, markdown);
        } catch (e) {
          //   console.log(i, links[i]["id"], e);
        }
      }
      for (i in links) {
        try {
          let yaml = this.生成yaml(links[i]);
          let markdown = yaml + links[i]["markdown"];
          zip.file(`${"关系" + i + links[i]["name"]}.md`, markdown);
        } catch (e) {
          //   console.log(i, links[i]["id"], e);
        }
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        that.保存(content, `${that.当前画板命名}-${that.当前画板id}.zip`);
      });
    },
    导出版本数据: async function (版本数据) {
      let that = this;
      let JSON数据 = 版本数据;
      let 文件名 = `${this.当前画板命名}.cccards`;
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
      // console.log(blob)
    },

    生成yaml: function (对象数据) {
      let yaml = `---
id:"${对象数据.id}"
parent_id:"${对象数据.parent_id}"
root_id:"${对象数据.root_id}"
hash:"${对象数据.hash}"
box:"${对象数据.box}"
path:"${对象数据.path}"
name:"${对象数据.name}"
alias:"${对象数据.alias}"
memo:"${对象数据.memo}"
content:"${对象数据.content}"
length:"${对象数据.length}"
type:"${对象数据.type}"
subtype:"${对象数据.subtype}"
ial:"${对象数据.ial}"
sort:"${对象数据.sort}"
created:"${对象数据.created}"
updated:"${对象数据.updated}"
attrs:'${JSON.stringify(对象数据.attrs)}'
---
`;
      return yaml;
    },
    保存历史: async function () {
      let data = {};
      data.cards = await this.$数据库.cards.toArray();
      data.links = await this.$数据库.links.toArray();
      data.metadata = await this.$数据库.metadata.toArray();
      data.states = await this.$数据库.states.toArray();
      data.linkpresets = await this.$数据库.linkpresets.toArray();
      data.cardpresets = await this.$数据库.cardpresets.toArray();
      data.timestamp = this.$用Lute生成时间戳();
      let 历史版本数量 = this.文件历史列表.length;
      // console.log(历史版本数量);
      //console.log(this.历史版本数量上限);
      if (历史版本数量 > this.历史版本数量上限) {
        await this.$数据库.history
          .orderBy("id")
          .reverse()
          .offset(this.历史版本数量上限 - 1)
          .delete();
      }
      await this.$数据库.history.put(data);
      this.文件历史列表 = await this.$数据库.history.toArray();
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
