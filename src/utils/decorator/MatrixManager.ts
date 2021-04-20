import { Matrix4 } from 'math.gl'
import { Length16NumberArray } from '../../common'

// 用于描述
export class MatrixManager2D {
  needRefreshMatrix:boolean
  _matrix:Matrix4
  computeMatrix() {}
  // 平移
  _x:number
  x:number
  _y:number
  y:number
  // 缩放
  _scaleX:number
  scaleX:number
  _scaleY:number
  scaleY:number
  // 旋转
  _rotate:number
  rotate:number
}

// 目前暂且没有参数
export function BuildMatrixManager2D() {
  return function<T extends {new(...args:any[]):{}}>(constructor:T) {
    const defines = {
      needRefreshMatrix: { value: true, writable: true },
      _matrix: { value: null, writable: true },
      computeMatrix: {
        value: function() {
          this.needRefreshMatrix = false
          
          // 首先，计算出本身的matrix
          const ax = 0.5 // anchor x
          const ay = 0.5
          const sx = this._scaleX // scale x
          const sy = this._scaleY
          const sina = Math.sin(this._rotate / 180 * Math.PI)
          const cosa = Math.cos(this._rotate / 180 * Math.PI)
          const matrixArray:Length16NumberArray = [
            sx * cosa, sx * -sina, 0, 0,
            sy * sina, sy * cosa, 0, 0,
            0, 0, 1, 0,
            this._x, this._y, 0, 1
          ]
          if (this._matrix) {
            this._matrix.set(...matrixArray)
          } else {
            this._matrix = new Matrix4(matrixArray)
          }
          // 如果父级有matrix，要乘以父级的matrix，另外进入父容器以后，
          if (this.parent && this.parent._matrix) {
            // if (this.classTypeName === 'shape') console.log(this._matrix, this.parent._matrix)
            this._matrix.multiplyLeft(this.parent._matrix)
            // this._matrix.multiplyLeft(new Matrix4([
            //   1, 0, 0, 0,
            //   0, 1, 0, 0,
            //   0, 0, 1, 0,
            //   -this.parent.width * 0.5, -this.parent.height * 0.5, 0, 0
            // ]))
            // if (this.classTypeName === 'shape') console.log(this._matrix)
          } // this._matrix.mutiplyLeft(this.parent._matrix)
        },
        writable: false
      }
    }

    const attrs = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }
    for (const attr in attrs) {
      const value = attrs[attr]
      defines[`_${attr}`] = { value: value, writable: true }
      defines[attr] = {
        get():number { return this[`_${attr}`] },
        set(at:number) {
          this[`_${attr}`] = at
          this.needRefreshMatrix = true
        }
      }
    }

    Object.defineProperties(constructor.prototype, defines)
    return constructor
  }
}