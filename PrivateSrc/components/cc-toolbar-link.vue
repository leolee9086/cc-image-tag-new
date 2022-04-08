<template>
  <el-drawer :modal="false" title="链接" size="100%" :visible="显示" :show-close="false">
    <div style="margin-bottom: 10px">
      <strong>图上入链</strong>
    </div>
    <template v-if="展开反向链接" v-for="链接 in 当前图上反向链接列表">
      <cc-graphlink-infor
        direction="from"
        v-if="链接"
        :linkdata="链接"
        :cardid="链接.attrs ? 链接.attrs.from_id : null"
      >
      </cc-graphlink-infor>
    </template>
    <el-divider></el-divider>
    <div style="margin-bottom: 10px">
      <strong>图上出链</strong>
    </div>
    <template v-if="展开正向链接" v-for="链接 in 当前图上正向链接列表">
      <cc-graphlink-infor
        direction="to"
        v-if="链接"
        :linkdata="链接"
        :cardid="链接.attrs ? 链接.attrs.to_id : null"
      >
      </cc-graphlink-infor>
    </template>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-history",
  props: ["显示"],
  data() {
    return {
      当前反向链接列表: [],
      当前正向链接列表: [],
      当前图上正向链接列表: [],
      当前图上反向链接列表: [],
      当前思源块id: "",
      当前对象数据: {},
      思源伺服ip: "",
      展开正向链接: true,
      展开反向链接: true,
    };
  },
  mounted() {
    this.$事件总线.$on("激活数据", ($event) => (this.当前对象数据 = $event));
  },
  methods: {
    以id获取图上反向链接: async function (id) {
      if (id) {
        return (
          (await this.$数据库.links
            .filter((data) => {
              return data.attrs ? data.attrs.to_id == id : null;
            })
            .toArray()) || []
        );
      }
    },
    以id获取图上正向链接: async function (id) {
      if (id) {
        return (
          (await this.$数据库.links
            .filter((data) => {
              return data.attrs ? data.attrs.from_id == id : null;
            })
            .toArray()) || []
        );
      }
    },
  },
  computed: {},
  watch: {
    当前对象数据: {
      async handler(val) {
        if (val && val.attrs) {
          this.当前思源块id = val.attrs.def_block;
          this.当前图上反向链接列表 = await this.以id获取图上反向链接(val.id);
          this.当前图上正向链接列表 = await this.以id获取图上正向链接(val.id);
        }
      },
    },
  },
};
</script>
