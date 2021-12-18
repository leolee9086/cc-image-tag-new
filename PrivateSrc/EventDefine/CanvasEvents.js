canvas = this.$graph.canvas
let option = {}
let tooltip = {
    type : "tooltip",
    formatText : "HTML",
    shouldBegin : true,
    shouldUpdate : true,
}
option.modes={
    default:['drag-canvas', 'zoom-canvas',tooltip],
    NodeEdit:['click-select','drag-node'],
    
    
}
