var xlsx = require('node-xlsx');
var fs = require('fs');
import LabelTree from './LabelTree'

//读取文件内容
var obj = xlsx.parse(__dirname + '/data/user-label.xlsx');
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
    const labelTree = new LabelTree(data);
    var data = {
        name: "用户属性标签",
        children: labelTree.tree
    }
    writeFileSync(data, './dist/user-tree.json')
}

function generateUV(data) {
    LabelTree.init(data)
    var uvs = JSON.stringify(LabelTree.uvHash);
    writeFileSync(uvs, './data/uv.json')
}




// writeFileSync(data, './data/data.json')
 generateTree(data)
//generateUV(data);