import { Component } from '@angular/core';
import { GPU } from 'gpu.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'gpujs';

  gpu: GPU;
  matrices: Array<Array<Array<number>>> = [[], []]
  matrixSize = 1000;

  cpuProduct: number[][];
  gpuProduct: number[][];

  cpuTime = '';
  gpuTime = '';

  constructor() {
    this.gpu = new GPU();
    console.log(this.gpu);
    this.generateMatrices();
    this.cpuMutiplyMatrix();
    this.gpuMultiplyMatrix();
  }

  generateMatrices() {
    this.matrices = [[], []];
    for (let y = 0; y < this.matrixSize; y++) {
      this.matrices[0].push([])
      this.matrices[1].push([])
      for (let x = 0; x < this.matrixSize; x++) {
        const value1 = parseInt((Math.random() * 10).toString())
        const value2 = parseInt((Math.random() * 10).toString())
        this.matrices[0][y].push(value1)
        this.matrices[1][y].push(value2)
      }
    }
  }

  cpuMutiplyMatrix() {
    const startTime = performance.now();
    const a = this.matrices[0];
    const b = this.matrices[1];

    let productRow = Array.apply(null, new Array(this.matrixSize)).map(Number.prototype.valueOf, 0);
    let product = new Array(this.matrixSize);
    for (let p = 0; p < this.matrixSize; p++) {
      product[p] = productRow.slice();
    }

    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        for (let k = 0; k < this.matrixSize; k++) {
          product[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    const endTime = performance.now();
    this.cpuTime = (endTime - startTime) + " ms";
    console.log("CPU TIME : "+ this.cpuTime);
    this.cpuProduct = product;
  }

  gpuMultiplyMatrix() {
    const gpu = new GPU();
    const multiplyMatrix = gpu.createKernel(function (a: number[][], b: number[][], matrixSize: number) {
      let sum = 0;
      for (let i = 0; i < matrixSize; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    }).setOutput([this.matrixSize, this.matrixSize])

    const startTime = performance.now();
    const resultMatrix = multiplyMatrix(this.matrices[0], this.matrices[1], this.matrixSize);
    const endTime = performance.now();
    this.gpuTime = (endTime - startTime) + " ms";
    console.log("GPU TIME : "+ this.gpuTime);
    this.gpuProduct = resultMatrix as number[][];
  }

}
