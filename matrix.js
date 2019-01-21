class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = new Array(this.rows).fill().map(() => new Array(this.cols).fill(0));
  }

  copy() {
    let nm = new Matrix(this.rows, this.cols);
    //nm.data = this.data.map(arr => arr.slice()).slice();
    nm.data = this.data.map(arr => arr.map(el => el));
    return nm;
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((el, i) => arr[i]);
  }

  static subtract(a, b) {
    if(a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Invalid Operation: Columns and Rows of A must match Columns and Rows of B');
      return;
    }

    return new Matrix(a.rows, a.cols).map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let nArr = [];
    this.data.forEach(arr => arr.forEach(el => nArr.push(el)));
    return nArr;
  }

  randomize() {
    return this.map(el => Math.random() * 2 - 1)
  }

  add(n) {
    if (n instanceof Matrix) {
      if(this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Invalid Operation: Columns and Rows of This must match Columns and Rows of N');
        return;
      }
      return this.map((el, i, j) => el + n.data[i][j]);
    } else {
      return this.map(el => el + n);
    }
  }

  static transpose(m) {
    return new Matrix(m.cols, m.rows).map((_, i, j) => m.data[j][i]);
  }

  static multiply(a, b) {
    if (a.cols !== b.rows) {
      console.log('Invalid Operation: Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((el, i, j) => {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if(this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Invalid Operation: Columns and Rows of This must match Columns and Rows of N');
        return;
      }
      return this.map((el, i, j) => el * n.data[i][j]);
    } else {
      return this.map(el => el * n);
    }
  }

  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(m, func) {
    return new Matrix(m.rows, m.cols).map((el, i, j) => func(m.data[i][j], i, j))
  }

  print() {
    console.table(this.data);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let m = new Matrix(data.rows, data.cols);
    m.data = data.data;
    return m;
  }
}
