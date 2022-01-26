<template>
  <el-drawer :modal="false" title="预设管理" size="100%" :visible="显示">
    <el-row>
      <el-input v-model="当前预设名">
        <span @click="新建预设()" slot="append">创建新预设</span>
      </el-input>
    </el-row>
    <cc-setter-presets></cc-setter-presets>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-presets",
  props: ["显示"],
  data() {
    return {
      卡片预设列表: [],
      链接预设列表: [],
      预设列表: [],
      当前预设: {},
      当前预设名: "",
      当前对象数据: {},
    };
  },
  async mounted() {
    this.$事件总线.$on("激活卡片", ($event) => (this.当前对象数据 = $event));
    this.$事件总线.$on("激活链接", ($event) => (this.当前对象数据 = $event));
    this.$事件总线.$on("保存数据", ($event) =>
      this.$根据时间戳更新本地数据($event, this.当前对象数据)
    );
  },
  methods: {
    创建新预设() {},
  },
  watch: {
    当前对象数据: {
      handler(val) {
        this.当前预设名 = val.subtype;
        this.预设列表 = val.type == "card" ? this.卡片预设列表 : this.链接预设列表;
      },
      deep: true,
    },
    当前预设名: {
      async handler(val) {
        let 预设表名 = this.当前对象数据.type + "presets";
        if (预设表名) {
          this.当前预设 = await this.$数据库[预设表名].filter((data) => {
            return data.name == val;
          });
          this.事件总线.$emit("当前预设改变", this.当前预设, this.当前对象数据.type);
          console.log(this.当前预设);
        }
      },
    },
  },
};
</script>
