<template>
  <el-drawer :modal="false" title="历史版本" size="100%" :visible="显示">
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
    };
  },
  mounted() {
    this.获取历史();
  },
  methods: {
    获取历史: async function () {
      this.文件历史列表 = (await this.$数据库.history.toArray()) || [];
    },
    删除版本数据: async function (版本数据) {
      await this.$数据库.history.delete(版本数据.id);
      this.文件历史列表 = (await this.$数据库.history.toArray()) || [];
    },
    应用版本数据: async function (版本) {
      await this.$应用版本数据(版本);
    },
    导出版本数据(版本) {},
    导出版本markdwon(版本) {},
  },
};
</script>
