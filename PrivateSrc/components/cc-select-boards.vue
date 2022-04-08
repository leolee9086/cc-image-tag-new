<template>
  <el-select v-model="当前画板id" @focus="获取画板列表;" size="mini">
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
</template>
<script>
module.exports = {
  name: "cc-select-boards",
  data() {
    return {
      当前画板名称: "",
      当前画板id: this.$baseid,
      画板列表: "",
    };
  },
  async mounted() {
    await this.获取数据();
    this.获取画板列表();
  },
  methods: {
    获取数据: async function () {
      this.画板列表 = await this.$获取画板列表();
      this.当前画板id = this.$baseid;
      this.当前画板名称 = await this.$数据库.metadata.get("name").then((data) => {
        return data ? data.value : "未命名";
      });
    },
    获取画板列表: function () {
      this.$获取画板列表().then((data) => {
        //console.log(data);
        this.画板列表 = data;
      });
    },
  },
  watch: {
    当前画板id: {
      handler: function (val) {
        this.$窗口内打开超链接(`/widgets/cc-image-tag-new/?baseid=${val}`);
      },
    },
  },
};
</script>
