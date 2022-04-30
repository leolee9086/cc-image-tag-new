<template>
  <div style="position: relative">
    <el-input v-model="搜索关键词"> </el-input>
    <div class="cc-list fn__flex-1 cc-list--background">
      <div
        style="position: relative"
        @click="链接内容到(item)"
        v-for="(item, i) in 搜索结果列表"
        class="cc-list-item"
      >
        <span v-if="item.boxIcon" class="cc-list-item-icon">
          <svg class="custom-icon">
            <use v-bind:xlink:href="`#icon-${item.boxIcon}`"></use>
          </svg>
        </span>
        {{ item.hPath }}
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "cc-sydoc-searcher",
  props: ["思源伺服ip", "apitoken", "mode", "待发送数据"],
  data() {
    return {
      搜索关键词: "选择要新建到的思源块",
      搜索结果列表: [],
      真实待发送数据: {},
      显示发送对话框: false,
    };
  },
  mounted() {
    this.真实待发送数据 = this.待发送数据;
  },
  methods: {
    链接内容到: async function (item) {
      if (!this.真实待发送数据.attrs.def_block) {
        await this.发送内容到(item);
      } else {
        let id = "";
        if (item.path != "/" && item.path) {
          id = item.path.replace(".sy", "").slice(item.path.lastIndexOf("/") + 1);
        } else {
          alert("笔记本是没有对应的文档的,另选一个吧");
        }
        if (id) {
          this.真实待发送数据.attrs.def_block = id;
          this.真实待发送数据 = this.$更新数据时间戳(this.真实待发送数据);
          this.$事件总线.$emit("保存数据", this.真实待发送数据);
          this.显示发送对话框 = false;
          this.$emit("change", this.真实待发送数据.attrs.def_block);
        }
      }
    },
    发送内容到: async function (item) {
      let markdown = this.真实待发送数据.markdown;
      let title = this.真实待发送数据.name;
      let notebook = item.box;
      let hpath = item.hPath.slice(item.hPath.indexOf("/")) + "/";
      let path = item.path.replace(".sy", "");

      let 思源伺服ip = window.location.host;
      let apitoken = "";

      // //console.log(path, markdown);
      let res = await 通过markdown创建文档(
        思源伺服ip,
        apitoken,
        notebook,
        hpath,
        markdown
      );
      // //console.log("成功", res.data);
      if (res.code == 0) {
        let res1 = await 重命名思源文档(
          思源伺服ip,
          apitoken,
          notebook,
          path + "/" + res.data + ".sy",
          title
        );
        //  //console.log(res1.data);
      }
      if (res.data) {
        this.真实待发送数据.attrs.def_block = res.data;
        this.真实待发送数据 = this.$更新数据时间戳(this.真实待发送数据);
        this.$事件总线.$emit("保存数据", this.真实待发送数据);
        this.$emit("change", this.真实待发送数据.attrs.def_block);
        //this.$窗口内打开思源块(res.data);
      }
    },
  },
  watch: {
    搜索关键词: {
      handler: async function (val) {
        let 思源伺服ip = window.location.host;
        let apitoken = "";
        let 搜索结果列表 = await 以关键词搜索文档(思源伺服ip, apitoken, val);
        this.搜索结果列表 = 搜索结果列表.data;
        // //console.log(this.搜索结果列表);
      },
    },
  },
};
</script>
