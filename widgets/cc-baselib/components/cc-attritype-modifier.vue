<template>
    
</template>
<script>
module.export={
    name:"cc-sql-modifier",
    data(){
        return{
            sql:"select * from blocks where id in select ",
            基础属性对照:[
                {"属性名":"name","中文名":"命名","只读":false,"基础属性":true,"属性类型":"string","多值":false,"可配置":false},
                {"属性名":"alias","中文名":"别名","只读":false,"基础属性":true,"属性类型":"string","多值":true,"可配置":false},
            
            ],
            块类型对照:[
                {"type":"d","label":"段落块"},
                {"type":"h","label":"标题块"},
                {"type":"l","label":"列表块"},
                {"type":"i","label":"列表项块"},
                {"type":"c","label":"代码块"},
                {"type":"m","label":"数学公式块"},
                {"type":"t","label":"表格块"},
                {"type":"b","label":"引述块"},
                {"type":"s","label":"超级块"},
                {"type":"p","label":"段落块"}
            ]
        }
    },
}
</script>
<style scoped>

</style>