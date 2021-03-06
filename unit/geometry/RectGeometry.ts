import { 
  Scene,
  Shape,
  OrthoViewer
} from '../../src/index'

// 测试程序，测试Tree/Leaf结构API的正确性
export default function main(canvas: HTMLCanvasElement) {
  const scene:Scene = new Scene({ canvas, stats: false })
  const viewer:OrthoViewer = new OrthoViewer({ far: 4000 })
  scene.viewer= viewer
  const viewMatrix = viewer.viewMatrix

  const rect1:Shape = new Shape({
    name: 'test',
    geometry: { type: 'rect', width: 100, height: 100, stroke: 0, x: 0, y: 0, rotate: 0 },
    material: { type: 'pure', color: [1, 0.3, 0.2, 1] }
  })
  scene.add(rect1)

  scene.tick(({ time }) => {
    let anime1Time = Math.min(time, 2000) / 1000
    viewMatrix.lookAt({ eye: [anime1Time * 100, anime1Time * -100, 500 + 100 * anime1Time], center: [0, 0, 0], up: [0, 1, 0] })
    // rect1.x = Math.sin(time * 0.002 + Math.PI * 0.5) * 200
    // rect1.y = Math.sin(time * 0.002 + Math.PI * 0.5) * 200
    // rect1.rotate = time * 0.002
  })
}
