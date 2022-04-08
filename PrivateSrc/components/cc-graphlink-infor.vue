<template>
  <el-card>
    <el-tabs v-model="当前标签">
      <el-tab-pane label="链接" name="链接"></el-tab-pane>
      <el-tab-pane label="卡片" name="卡片"></el-tab-pane>
      <el-card v-if="当前数据" @click="定位至卡片(当前数据)">
        <el-row @click="定位至卡片(当前数据)">
          <el-col :span="18">
            <h2>
              {{ 当前数据.name }}
            </h2>
          </el-col>
        </el-row>
        <div @click="定位至卡片(当前数据)" v-html="预览HTML"></div>
      </el-card>
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
  },
  watch: {
    linkdata: {
      handler: function (val) {
        if (val && val.updated > this.当前链接数据.updated) {
          this.当前链接数据 = val;
        }
      },
      deep: true,
    },
    carddata: {
      handler: function (val) {
        if (val && val.updated > this.当前卡片数据.updated) {
          this.当前卡片数据 = val;
        }
      },
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
        }
      },
    },
  },
  computed: {
    当前数据: function () {
      return this.当前标签 == "链接" ? this.当前链接数据 : this.当前卡片数据;
    },
  },
  methods: {
    定位至卡片: function (卡片数据) {
      //console.log(卡片数据);
      卡片数据.id ? this.$事件总线.$emit("定位至卡片", 卡片数据) : null;
    },
  },
};
</script>
