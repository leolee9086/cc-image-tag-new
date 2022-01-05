<template>
  <div class="layout">
    <div class="drawer-button-container">
      <el-button
        @click="显示详情面板 = !显示详情面板"
        circle
        icon="el-icon-share"
        aria-label="展开|关闭面板"
      >
      </el-button>
    </div>
    <cc-toolbar-main
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-main>
    <cc-toolbar-infor
      :显示="显示详情面板"
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-infor>
    <cc-toolbar-view></cc-toolbar-view>
    <el-dialog title="发送到思源" :visible.sync="显示发送对话框">
      <el-input v-model="搜索关键词"> </el-input>
      <div class="cc-list fn__flex-1 cc-list--background">
        <div
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
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-toolbar",
  props: ["思源伺服ip"],
  components: {
    "cc-toolbar-main": "url:../components/cc-toolbar-main.vue",
    "cc-toolbar-infor": "url:../components/cc-toolbar-infor.vue",
    "cc-toolbar-view": "url:../components/cc-toolbar-view.vue",
  },
  data() {
    return {
      搜索关键词: "测试",
      搜索结果列表: [],
      窗口状态数组: [],
      操作历史数组: [],
      当前卡片数据id: "",
      当前链接数据id: "",
      窗口状态获取器: {},
      操作历史获取器: {},
      最近窗口状态: {},
      数据获取器: "",
      待发送数据: {},
      /*操作面板显示*/
      显示详情面板: false,
      显示发送对话框: false,
    };
  },
  mounted() {
    this.窗口状态获取器 = liveQuery(() => this.$数据库.states.toArray()).subscribe({
      next: (result) => {
        result ? (this.窗口状态数组 = result) : null;
      },
    });
    this.$事件总线.$on("打开发送对话框", this.发送对话框显示);
  },
  methods: {
    链接内容到: async function (item) {
      if (!this.待发送数据.attrs.def_block) {
        await this.发送内容到(item);
      } else {
        let id = "";
        if (item.path != "/" && item.path) {
          id = item.path.replace(".sy", "").slice(item.path.lastIndexOf("/") + 1);
        } else {
          alert("笔记本是没有对应的文档的,另选一个吧");
        }
        if (id) {
          this.待发送数据.attrs.def_block = id;
          this.待发送数据 = this.$更新数据时间戳(this.待发送数据);
          this.$事件总线.$emit("保存数据", this.待发送数据);
          this.显示发送对话框 = false;
          this.$窗口内打开思源块(id);
        }
      }
    },
    发送内容到: async function (item) {
      let markdown = this.待发送数据.markdown;
      let title = this.待发送数据.name;
      let notebook = item.box;
      let path = item.path.replace(".sy", "");
      let 思源伺服ip = window.location.host;
      let apitoken = "";

      console.log(path, markdown);
      let res = await 通过markdown创建文档(
        思源伺服ip,
        apitoken,
        notebook,
        path,
        markdown
      );
      console.log("成功", res.data);
      if (res.code == 0) {
        let res1 = await 重命名思源文档(
          思源伺服ip,
          apitoken,
          notebook,
          path + "/" + res.data + ".sy",
          title
        );
        console.log(res1.data);
      }
      if (res.data) {
        this.待发送数据.attrs.def_block = res.data;
        this.待发送数据 = this.$更新数据时间戳(this.待发送数据);
        this.$事件总线.$emit("保存数据", this.待发送数据);
        this.显示发送对话框 = false;
        this.$窗口内打开思源块(res.data);
      }
    },
    发送对话框显示($event) {
      this.显示发送对话框 = true;
      this.待发送数据 = $event;
    },
  },
  watch: {
    搜索关键词: {
      handler: async function (val) {
        let 思源伺服ip = window.location.host;
        let apitoken = "";
        let 搜索结果列表 = await 以关键词搜索文档(思源伺服ip, apitoken, val);
        this.搜索结果列表 = 搜索结果列表.data;
        console.log(this.搜索结果列表);
      },
    },
    窗口状态数组: {
      handler: function (val, oldval) {
        let that = this;
        let 最近窗口状态 = val[val.length - 1];
        if (最近窗口状态) {
          that.当前卡片数据id = 最近窗口状态["current_cardid"] + "";
          that.当前链接数据id = 最近窗口状态["current_linkid"] + "";
        } else {
          that.当前卡片数据id = "";
          that.当前链接数据id = "";
        }
        //  console.log("当前卡片", that.当前卡片数据id);
        //  console.log("当前链接", that.当前链接数据id);
      },
    },
    当前链接数据id: {
      handler: function (val) {
        if (val) {
          // console.log(val);
          this.数据获取器 = liveQuery(() => this.$数据库.links.get(val)).subscribe({
            next: (result) => {
              result ? (this.当前数据 = result) : null;
            },
          });
        }
      },
    },
    当前卡片数据id: {
      handler: function (val) {
        if (val) {
          // console.log(val);

          this.数据获取器 = liveQuery(() => this.$数据库.cards.get(val)).subscribe({
            next: (result) => {
              result ? (this.当前数据 = result) : null;
            },
          });
        }
      },
    },
  },
};
</script>
<style scoped>
.front {
  z-index: 300;
}
</style>
