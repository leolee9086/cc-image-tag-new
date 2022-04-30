<template>
  <div v-if="blocklist&&blocklist[0]" class="protyle-wysiwyg protyle-wysiwyg--attr">
    <div v-if="title">
      <h3 style="margin: 0px">
        <span>
          <el-tooltip effect="dark" v-if="展开" content="收起" placement="top-start">
            <span class="el-icon-arrow-up" @click="展开 = 展开 ? false : true"></span>
          </el-tooltip>
          <el-tooltip effect="dark" v-if="!展开" content="展开" placement="top-start">
            <span class="el-icon-arrow-down" @click="展开 = 展开 ? false : true"></span>
          </el-tooltip>
        </span>
        {{ title }}:
        <span v-if="blocklist">{{ count || blocklist.length }}</span>
      </h3>
    </div>
    <div
      class="cc-list-item"
      v-if="展开"
      style="margin: 5px 0px"
      v-for="item in 对象列表"
      :key="item.id"
      data-node-id="item.id"
    >
      <el-tooltip
        effect="dark"
        v-if="可见性列表[item.id]"
        content="收起"
        placement="top-start"
      >
        <span
          class="el-icon-arrow-up"
          @click="可见性列表[item.id] = 可见性列表[item.id] ? false : true"
        ></span>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        v-if="!可见性列表[item.id]"
        content="展开"
        placement="top-start"
      >
        <span
          class="el-icon-arrow-down"
          @click="可见性列表[item.id] = 可见性列表[item.id] ? false : true"
        ></span>
      </el-tooltip>
      <svg
        @click="clickcallback ? clickcallback(item) : null"
        :aria-label="buttontip"
        class="b3-list-item__graphic popover__block cc-list-item-icon"
        :data-id="item.id"
      >
        <use :xlink:href="生成图标属性(item)" />
      </svg>

      <cc-link-siyuan
        :链接id="item.id"
        :锚文本="item.name || item.content"
        :最大文字长度="可见性列表[item.id] ? undefined : 23"
      ></cc-link-siyuan>
      <div
        style="
          font-size: x-small;
          margin: 5px 10px;
          color: gray;
          overflow: hidden;
          text-overflow: ellipsis;
        "
        v-for="block in item.blocks"
        v-if="可见性列表[item.id]"
        data-node-id="block.id"
      >
        <el-tooltip
          effect="dark"
          v-if="block && !可见性列表[block.id] && block.content.length > 23"
          content="展开"
          placement="top-start"
        >
          <span
            class="el-icon-arrow-up"
            @click="可见性列表[block.id] = 可见性列表[block.id] ? false : true"
          ></span>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          v-if="block && 可见性列表[block.id] && block.content.length > 23"
          content="收起"
          placement="top-start"
        >
          <span
            class="el-icon-arrow-down"
            @click="可见性列表[block.id] = 可见性列表[block.id] ? false : true"
          ></span>
        </el-tooltip>
        <svg
          @click="clickcallback ? clickcallback(block) : null"
          :aria-label="buttontip"
          class="b3-list-item__graphic popover__block cc-list-icon"
          :data-id="block.id"
        >
          <use :xlink:href="生成图标属性(block)" />
        </svg>

        <cc-link-siyuan
          :链接id="block.id"
          :最大文字长度="可见性列表[block.id] ? null : 23"
        ></cc-link-siyuan>

        <cc-block-list
          :blocklist="block.children || []"
          v-if="可见性列表[block.id]"
          :buttonicon="buttonicon"
          :clickcallback="clickcallback"
          :buttontip="buttontip"
        ></cc-block-list>
      </div>
      <div
        style="
          font-size: x-small;
          margin: 5px 10px;
          color: gray;
          overflow: hidden;
          text-overflow: ellipsis;
        "
      >
        <cc-block-list
          :blocklist="item.children || []"
          v-if="item.children && 可见性列表[item.id]"
          :buttonicon="buttonicon"
          :clickcallback="clickcallback"
          :buttontip="buttontip"
        ></cc-block-list>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "cc-block-list",
  props: [
    "blocklist",
    "title",
    "count",
    "buttonicon",
    "clickcallback",
    "buttontip",
    "type",
    "linkcallback",
  ],
  components: componentsList,
  data() {
    return {
      可见性列表: {},
      对象列表: [],
      展开: true,
      反链图标对照: {
        NodeDocument: "#iconFile",
        NodeParagraph: "#iconParagraph",
        NodeListItem: "#iconListItem",
        NodeH1: "#iconH1",
        NodeH2: "#iconH2",
        NodeH3: "#iconH3",
        NodeH4: "#iconH4",
        NodeH5: "#iconH5",
        NodeH6: "#iconH6",
        NodeTable: "#iconTable",
        NodeSql: "#iconSQL",
        NodeEmbed: "#iconEmbed",
        NodeMath: "#iconMath",
        NodeCode: "#iconCode",
        NodeBlockquote: "#iconQuote",
      },
      块子类型图标对照: {
        h1: "#iconH1",
        h2: "#iconH2",
        h3: "#iconH3",
        h4: "#iconH4",
        h5: "#iconH5",
        h6: "#iconH6",
        p: "#iconParagraph",
      },
      块类型图标对照: {
        p: "#iconParagraph",
        d: "#iconFile",
        u: "#iconListItem",
        t: "#iconUncheck",
      },
    };
  },
  mounted() {
    this.对象列表 = this.blocklist;
  },
  watch: {
    blocklist: {
      handler: function (val, oldval) {
        if (!val){return null}
        this.对象列表 = val || [];
        let 可见性列表 = {};
        if (this.对象列表[0]) {
          this.对象列表.forEach((item) => {
            if (item.blocks) {
              可见性列表[item.id] = true;
              item.blocks.forEach((block) => (可见性列表[block.id] = true));
            }
            if (item.children) {
              可见性列表[item.id] = true;
              item.children.forEach((block) => (可见性列表[block.id] = true));
            }
          });
          this.可见性列表 = JSON.parse(JSON.stringify(可见性列表));
          console.log(this.可见性列表);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    展开切换(block) {
      let temp = JSON.parse(JSON.stringify(block));
      temp.展开 = block.展开 ? false : true;

      block = JSON.parse(JSON.stringify(temp));
    },
    生成图标属性(item) {
      if (item.nodeType) {
        return this.反链图标对照[item.nodeType] || "#iconFile";
      } else if (item.depth) {
        return this.反链图标对照[item.type] || "#iconFile";
      } else if (item.subtype) {
        return this.块子类型图标对照[item.subType] || "#iconFile";
      } else if (item.type) {
        return this.块类型图标对照[item.type] || "#iconFile";
      }
    },
  },
};
</script>
<style scoped>
div {
  max-height: auto !important;
}
.b3-list-item__graphic {
  color: black !important;
}
</style>
