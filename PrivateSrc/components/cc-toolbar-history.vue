<template>
  <el-drawer :modal="false" title="历史版本" size="100%" :visible="显示">
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
    <el-divider></el-divider>
    <el-timeline v-if="文件历史列表">
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
</template>
<script>
module.exports = {
  name: "cc-toolbar-history",
  props: ["显示"],
  data() {
    return {
      文件历史列表: [],
      保存时间间隔: 5,
      历史版本数量上限: 30,
      保存计数: 1,
    };
  },
  async mounted() {
    await this.初始化();
    this.获取历史();
    this.timer = setInterval(() => {
      this.保存计数 = this.保存计数 + 1;
    }, 1000);
  },
  methods: {
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
    初始化: async function () {
      let that = this;
      try {
        that.保存时间间隔 = (await that.$数据库.metadata.get("autosaveinteger")).value;
      } catch (e) {
        console.log(e);
        that.保存时间间隔 = 5;
        that.$数据库.metadata.put({ key: "autosaveinteger", value: 5 });
      }
      try {
        that.历史版本数量上限 = (
          await that.$数据库.metadata.get("maxhistorycount")
        ).value;
      } catch (e) {
        console.log(e);
        that.历史版本数量上限 = 30;
        that.$数据库.metadata.put({ key: "maxhistorycount", value: 30 });
      }
      try {
        await that.保存历史();
        await that.从思源块加载数据(that.$baseid);
      } catch (error) {
        console.log("加载出错", error);
        alert("加载挂件块数据失败,注意手动保存数据");
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
    获取历史: async function () {
      this.文件历史列表 = (await this.$数据库.history.toArray()) || [];
    },
    删除版本数据: async function (版本数据) {
      await this.$数据库.history.delete(版本数据.id);
      this.文件历史列表 = (await this.$数据库.history.toArray()) || [];
    },
    导出版本数据(版本) {
      let JSON数据 = 版本数据;
      let 文件名 = `${this.当前画板命名}.cccards`;
      let 文件数据 = this.$从数据生成文件(JSON数据, "application/json", 文件名);
      this.保存(文件数据, 文件名);
    },
    导出版本markdown: async function (版本数据) {
      let that = this;
      let cards = {};
      let links = {};
      cards = 版本数据.cards;
      links = 版本数据.links;
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
      let zip = new JSZip();

      zip.generateAsync({ type: "blob" }).then((content) => {
        that.保存(content, `${that.当前画板命名}-${that.当前画板id}.zip`);
      });
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
    删除版本数据: async function (版本数据) {
      await this.$数据库.history.delete(版本数据.id);
      this.文件历史列表 = await this.$数据库.history.toArray();
    },
    清空画板: async function () {
      await this.$清空画板();
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
    保存计数(val) {
      if (val >= this.保存时间间隔) {
        this.保存数据();
        this.保存计数 = 1;
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
    显示: {
      handler: function (val) {
        if (val) {
          this.获取历史();
        }
      },
    },
  },
};
</script>
