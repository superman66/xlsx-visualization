var xlsx = require('node-xlsx');
var fs = require('fs');

//读取文件内容
var obj = xlsx.parse(__dirname + '/data/demo.xlsx');
var excelObj = obj[0].data;
// console.log(excelObj);

var data = [];
for (var i in excelObj) {
    var arr = [];
    var value = excelObj[i];
    for (var j in value) {
        arr.push(value[j]);
    }
    data.push(arr);
}

function writeFileSync(data, fileName) {
    data = JSON.stringify(data);
    fs.writeFileSync(fileName, data);
}

function generateTree(data) {
    LabelTree.init(data);
    var tree = LabelTree.arrayToTree(LabelTree.labelTree);
    var data = {
        name: "用户属性标签",
        children: tree
    }
    writeFileSync(data, './data/tree.json')
}

function generateUV(data) {
    LabelTree.init(data)
    var uvs = JSON.stringify(LabelTree.uvHash);
    writeFileSync(uvs, './data/uv.json')
}

function addUvToLabel(tree) {

}



// writeFileSync(data, './data/data.json')
 generateTree(data)
//generateUV(data);