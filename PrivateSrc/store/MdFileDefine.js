const ccmarkdown ={}
ccmarkdown.生成yaml=
    function(对象数据){
        let yaml = `---
id:"${对象数据.id}"
parent_id:"${对象数据.parent_id}"
root_id:"${对象数据.root_id}"
hash:"${对象数据.hash}"
box:"${对象数据.box}"
path:"${对象数据.path}"
name:"${对象数据.name}"
alias:"${对象数据.alias}"
memo:"${对象数据.memo}"
content:"${对象数据.content}"
length:"${对象数据.length}"
type:"${对象数据.type}"
subtype:"${对象数据.subtype}"
ial:"${对象数据.ial}"
sort:"${对象数据.sort}"
created:"${对象数据.created}"
updated:"${对象数据.updated}"
attrs:'${JSON.stringify(对象数据.attrs)}'
        ---
        `;
        return yaml;
}
ccmarkdown.解析yaml=function(yaml字符串){
    //去除开头的---
    yaml字符串  = yaml字符串.replace(/^\-\-\-/,'{')
    .replace()//去除结尾的---
    
}