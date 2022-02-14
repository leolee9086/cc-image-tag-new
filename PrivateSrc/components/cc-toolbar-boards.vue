<template>
  <el-drawer :modal="false" title="画板列表" size="100%" :visible="显示">
    <el-timeline v-if="画板列表">
      <el-timeline-item
        v-for="(画板, 序号) in 画板列表"
        :key="画板.id"
        v-if="!画板列表[序号].hide"
        :timestamp="`${画板.id.slice(0, 4)}年${画板.id.slice(4, 6)}月${画板.id.slice(
          6,
          8
        )}日${画板.id.slice(8, 10)}时${画板.id.slice(10, 12)}分${画板.id.slice(
          12,
          14
        )}秒 `"
        placement="top"
      >
        <cc-shower-board
          @隐藏="隐藏画板(序号)"
          @删除="刷新画板列表()"
          :画板="画板"
        ></cc-shower-board>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-boards",
  props: ["显示"],
  data() {
    return {
      画板列表: [],
    };
  },
  async mounted() {
    await this.获取数据();
    await this.获取画板列表();
    await this.修复画板列表();
  },
  methods: {
    隐藏画板: function (序号) {
      console.log(序号);
      this.画板列表[序号].hide = true;
      this.画板列表 = JSON.parse(JSON.stringify(this.画板列表));
    },
    获取数据: async function () {
      this.当前画板id = this.$baseid;
      this.当前画板名称 = await this.$数据库.metadata.get("name").then((data) => {
        return data ? data.value : "未命名";
      });
    },
    获取画板列表: function () {
      this.$获取画板列表().then((data) => {
        console.log(data);
        this.画板列表 = data;
      });
    },
    刷新画板列表: async function () {
      await this.获取数据();
      await this.获取画板列表();
    },
    修复画板列表: async function () {
      let databases = await Dexie.getDatabaseNames();
      databases.forEach((element) => {
        this.$画板元数据库.boards.put({ id: element });
      });
      console.log(databases);
    },
  },
};
</script>
