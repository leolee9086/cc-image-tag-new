<template>
  <div
    @dblclick="添加卡片($event)"
    class="cardscontainer"
    :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width / $当前窗口状态.缩放倍数}px; 
        height: ${窗口大小.height / $当前窗口状态.缩放倍数}px;
        transform:scale(${$当前窗口状态.缩放倍数});
        transform-origin:0% 0%;
        z-index:200`"
  >
    <cc-dragable-block-card
      :data-node-id="item.id"
      :ref="item.id"
      v-for="(item, i) in 卡片数组"
      v-if="item && !item.hide"
      :key="卡片数组[i]['id']"
      v-model="卡片数组[i]"
      :index="i"
      @activated="当前激活标签id = i"
      :窗口缩放倍数="窗口缩放倍数"
    ></cc-dragable-block-card>
    <cc-dragable-block-linklabel
      :ref="item.id"
      :data-node-id="item.id"
      v-for="(item, i) in 链接数组"
      :key="链接数组[i]['id'] + 'label'"
      v-model="链接数组[i]"
      :index="i"
      @activated="当前激活链接id = i"
      style="z-index: 200"
      :窗口缩放倍数="$当前窗口状态.缩放倍数"
    ></cc-dragable-block-linklabel>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-cards",
  props: ["窗口大小"],
  components: {
    "cc-dragable-block-card": "url:../components/cc-dragable-block-card.vue",
    "cc-dragable-block-linklabel": "url:../components/cc-dragable-block-linklabel.vue",
  },
  data() {
    return {
      当前激活标签id: "",
      当前激活链接id: "",
      窗口缩放倍数: 1,
      卡片数组: [],
      链接数组: [],
      卡片获取器: {},
      卡片订阅器: {},
      链接获取器: {},
      链接订阅器: {},
    };
  },
  mounted() {
    this.卡片获取器 = liveQuery(() => this.$数据库.cards.toArray());
    this.卡片订阅器 = this.卡片获取器.subscribe({
      next: (result) => (this.卡片数组 = result),
    });
    this.链接获取器 = liveQuery(() => this.$数据库.links.toArray());
    this.链接订阅器 = this.链接获取器.subscribe({
      next: (result) => {
        this.链接数组 = result;
      },
    });
  },
  watch: {
    当前激活标签id: {
      handler: function (val, oldval) {
        this.$事件总线.$emit("激活卡片", val);
      },
    },
  },
  computed: {},
  methods: {
    添加卡片: function ($event) {
      console.log($event.target);
      if ($event.target.className != "cardscontainer layer") {
        return null;
      }
      let 卡片数据 = this.$根据属性生成卡片();
      (卡片数据.attrs.top =
        (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数),
        (卡片数据.attrs.left =
          (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数),
        this.$事件总线.$emit("添加卡片", 卡片数据);
    },
  },
};
</script>
