const baseLibPath = Vue.prototype.baseLibPath
const componentsList = {
    "cc-csscons-font":`url:${baseLibPath}/components/cc-csscons-font.vue`,
    "cc-color-pane":`url:${baseLibPath}/components/cc-color-pane.vue`,
    "cc-knob":`url:${baseLibPath}/components/cc-knob.vue`,
    "cc-gradient-setter":`url:${baseLibPath}/components/cc-gradient-setter.vue`,
    "cc-border-setter":`url:${baseLibPath}/components/cc-border-setter.vue`,
    "cc-cssimage":`url:${baseLibPath}/components/cc-cssimage.vue`,
    "cc-assets-selector":`url:${baseLibPath}/components/cc-assets-selector.vue`,
    "cc-gradient-setter":`url:${baseLibPath}/components/cc-gradient-setter.vue`,
    "cc-knob":`url:${baseLibPath}/components/cc-knob.vue`,
    "cc-block-attr-form":`url:${baseLibPath}/components/cc-block-attr-form.vue`,
    "custom-attr-shower":`url:${baseLibPath}/components/custom-attr-shower.vue`,
    "custom-attr-constructor":`url:${baseLibPath}/components/custom-attr-constructor.vue`,
    "cc-block-attr-table":`url:${baseLibPath}/components/cc-block-attr-table.vue`,
    "cc-block-kanban":`url:${baseLibPath}/components/cc-block-kanban.vue`,
    "cc-link-siyuan":`url:${baseLibPath}/components/cc-link-siyuan.vue`,
    "cc-block-list":`url:${baseLibPath}/components/cc-block-list.vue`,
    "cc-image-card":`url:${baseLibPath}/components/cc-image-card.vue`,
    "cc-vditor-vue":`url:${baseLibPath}/components/cc-vditor-vue.vue`,    
}

Vue.use(httpVueLoader);

for (component in componentsList){
    Vue.component(component,componentsList[component])
}