<template>
  <cc-dragable-block-linklabel
    v-if="链接数据 && !链接数据.hide"
    v-model="链接数据"
    :index="index"
  ></cc-dragable-block-linklabel>
</template>
<script>
module.exports = {
  name: "cc-graph-link-label",
  props: ["link", "index"],
  components: {
    "cc-color-pane": "url:/widgets/cc-baselib/components/cc-color-pane.vue",
    "cc-dragable-block-linklabel": "url:../components/cc-dragable-block-linklabel.vue",
  },
  async mounted() {
    //    console.log("加载卡片", this.value)
    this.链接数据 = this.link;
    this.链接数据 = await this.$数据库.links.get(this.link.id);
    this.生成html();
    //  console.log(this.代理起始标记, this.代理结束标记)
  },
  data() {
    return {
      属性对象: {},
      链接数据: {},
      路径: "",
      width: 0,
      代理起始标记: {},
      代理结束标记: {},
      timer: "",
      html: "",
    };
  },
  watch: {
    link: {
      handler(val, oldval) {
        if (val.updated > oldval.updated) {
          this.链接数据 = val;
          if (!val.type) {
            this.链接数据.type = "link";
          }
        }
      },
      deep: true,
    },
    链接数据: {
      handler(val, oldval) {
        this.生成html();

        if (val != oldval) {
          this.属性对象 = val.attrs;
          this.保存链接数据修改();
        }
        if (!val.type) {
          this.链接数据.type = "包含";
        }
      },
      deep: true,
    },
  },
  methods: {
    保存链接数据修改: async function () {
      this.$事件总线.$emit("保存链接", this.链接数据);
    },
    生成html: async function () {
      if (this.链接数据.markdown) {
        // console.log*(this.链接数据.markdown)
        this.预览HTML = await Vditor.md2html(this.链接数据.markdown);
      } else this.预览HTML = "有关";
    },
  },
};
</script>
