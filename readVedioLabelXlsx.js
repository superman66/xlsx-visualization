var xlsx = require('node-xlsx');
var fs = require('fs');
import VideoLabelTree from './VideoLabelTree'

//读取文件内容
var obj = xlsx.parse(__dirname + '/data/video-label.xls');
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
console.log(data);

function writeFileSync(data, fileName) {
    data = JSON.stringify(data);
    fs.writeFileSync(fileName, data);
}

function generateTree(data) {
    const labelTree = new VideoLabelTree(data);
    var data = {
        name: "OTV观影行为标签",
        children: labelTree.tree
    }
    writeFileSync(data, './dist/video-tree.json')
}



// writeFileSync(data, './data/data.json')
 generateTree(data)
//generateUV(data);
