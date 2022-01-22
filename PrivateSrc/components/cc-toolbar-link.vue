<template>
  <el-drawer :modal="false" title="历史版本" size="100%" :visible="显示">
    <strong slot="title">思源连接属性</strong>
    <el-input size="mini" v-model="当前思源块id">
      <span slot="prepend">
        <span class="el-icon-siyuan"></span>
        <span>id:</span>
      </span>
    </el-input>
    <el-card>
      <cc-block-list
        title="反向链接"
        :blocklist="当前反向链接列表['backlinks']"
        :count="当前反向链接列表['linkRefsCount']"
        buttonicon="el-icon-plus"
        :clickcallback="
          (data) => {
            思源链接上图(data.id, '链接', true);
          }
        "
        buttontip="上图"
      >
      </cc-block-list>

      <cc-block-list
        :blocklist="当前反向链接列表['backmentions']"
        :count="当前反向链接列表['mentionsCount']"
        title="提及"
        buttonicon="el-icon-plus"
        :clickcallback="
          (data) => {
            思源链接上图(data.id, '链接', true);
          }
        "
        buttontip="上图"
      >
      </cc-block-list>
      <cc-block-list
        :blocklist="当前正向链接列表"
        :count="当前正向链接列表.length"
        title="正向链接"
        buttonicon="el-icon-plus"
        :clickcallback="
          (data) => {
            思源链接上图(data.id, '链接', true);
          }
        "
        buttontip="上图"
      >
      </cc-block-list>
    </el-card>
    <strong slot="title">图上连接</strong>
    <cc-block-list
      :blocklist="当前图上正向链接列表"
      :count="当前图上正向链接列表.length"
      title="出链"
      buttonicon="el-icon-plus"
      buttontip="显示/隐藏链接提示"
      type="cc"
    >
      <template slot="parent" slot-scope="链接">
        <cc-graphlink-infor
          v-if="链接.data"
          :linkdata="链接.data"
          :cardid="链接.data.attrs ? 链接.data.attrs.to_id : null"
        >
        </cc-graphlink-infor>
      </template>
    </cc-block-list>
    <cc-block-list
      :blocklist="当前图上反向链接列表"
      :count="当前图上反向链接列表.length"
      title="入链"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          this.$事件总线.$emit('切换链接显示', data);
        }
      "
      type="cc"
      buttontip="显示/隐藏链接提示"
    >
      <template slot="parent" slot-scope="链接">
        <strong aria-label="定位" @click="$事件总线.$emit('定位至卡片', 链接.data)"
          >{{ 链接.data.name }}
        </strong>
        <span aria-label="定位" @click="$事件总线.$emit('定位至卡片', 链接.data)"
          >{{ 链接.data.subtype }}
        </span>
        <div>
          {{ 链接.data.content }}
        </div>
      </template>
    </cc-block-list>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-history",
  props: ["显示"],
  data() {
    return {
      当前思源块id: "",
      当前对象数据: "",
      当前反向链接列表: [],
      当前正向链接列表: [],
      当前图上正向链接列表: [],
      当前图上反向链接列表: [],
    };
  },
  mounted() {},
  methods: {
    思源链接上图() {},
  },
};
</script>
