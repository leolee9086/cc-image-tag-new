<template>
  <el-drawer :modal="false" title="预设管理" size="100%" :visible="显示">
    <el-row v-if="!正在新建预设">
      <el-input v-model="当前预设名" disabled>
        <span @click="开始新建预设()" slot="append">创建新预设</span>
      </el-input>
    </el-row>
    <el-row v-if="正在新建预设">
      <el-input v-model="新预设名">
        <span @click="新建预设(新预设名)" slot="append">提交</span>
      </el-input>
    </el-row>
    <cc-setter-presets :当前对象数据="当前对象数据"></cc-setter-presets>
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
      正在新建预设: false,
      新预设名: "新预设",
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
    开始新建预设() {
      this.新预设名 = "";
      this.正在新建预设 = true;
    },
    新建预设(预设名) {
      if (!预设名) {
        return null;
      }
      let 预设类型 = this.当前对象数据.type;
      let 新预设数据 = JSON.parse(JSON.stringify(this.当前对象数据.attrs));
      新预设数据.def_block = "byref";
      this.$事件总线.$emit("新建预设", 新预设数据, 预设名, 预设类型);
      this.正在新建预设 = false;
    },
  },
  watch: {
    当前对象数据: {
      handler(val) {
        if (val) {
          return;
        }
        this.当前预设名 = val.subtype;
        this.预设列表 = val.type == "card" ? this.卡片预设列表 : this.链接预设列表;
      },
      deep: true,
      immediate: true,
    },
    当前预设名: {
      async handler(val) {
        let 预设表名 = this.当前对象数据.type + "presets";
        if (预设表名) {
          let res = await this.$数据库[预设表名]
            .filter((data) => {
              return data.name == val;
            })
            .toArray();
          this.当前预设 = res[0];
          this.$事件总线.$emit("当前预设改变", this.当前预设, this.当前对象数据.type);
          //console.log(this.当前预设);
        }
      },
    },
  },
};
</script>
