
let 应用组件列表 = [
    "cc-dragable-block-combo",
    "cc-dragable-block-card",
    "cc-graph-link-path-konva",
    "cc-layers-background",
    "cc-layers-toolbar",
    "cc-layers-cards",
    "cc-layers-graph",
    "cc-layers-tooltip",
    "cc-layers-konva-graph",
    "cc-presets-selector",
    "cc-sydoc-searcher",
    "cc-sydoc-searcherdialog",

    "cc-setter-anchor",
    "cc-setter-board-background",
    "cc-setter-path-dash",
    "cc-setter-presets",
    "cc-graphlink-infor",
    "cc-toolbar-history",
    "cc-toolbar-link",
    "cc-toolbar-ref",
    "cc-toolbar-set",
    "cc-toolbar-main",
    "cc-toolbar-infor",
    "cc-toolbar-view",
    "cc-toolbar-trigger",
    "cc-toolbar-draw",
    "cc-toolbar-boards",
    "cc-toolbar-presets",
    "cc-loader-file",
    "cc-select-boards",
    "cc-shower-board",
    "cc-shower-ref",

    "cc-draw"
  ]
  应用组件列表.forEach(组件名 => {
   Vue.component(组件名, `url:/widgets/cc-image-tag-new/PrivateSrc/components/${组件名}.vue`)}
  )
  Vue.prototype.baseLibPath=`/widgets/cc-image-tag-new/cc-baselib`