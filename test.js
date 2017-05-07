class Test(){
    constructor(){
        tree = [3, 12, 4, 345, 5, 3];
    }
    quickSort(arr) {
        if (arr.length <= 1) { return arr; }
        const pivotIndex = Math.floor(arr.length / 2);
        const pivot = arr.splice(pivotIndex, 1)[0];
        const left = [];
        const right = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right));
    }
}
console.log(quickSort(tree));