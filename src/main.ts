import { 
  Scene,
  Container2DGroup,
  Shape,
  OrthoViewer,
  Texture2D,
  ComputeTexture
} from './index'
import * as dat from 'dat.gui'
import { StarTrack, StarTrackConfig, Brush, Atom } from './starTracker'

interface EntryConfig {
  canvas: HTMLCanvasElement
}

// 以下用于测试
declare global {
  interface Window {
    setPaperWingEntry(EntryConfig)
  }
}

const defaultData = {
  width: 600,
  height: 360
}
const handlers:any = {}
const controlls:any = {}

window.setPaperWingEntry = function(config: EntryConfig) {
  const { canvas } = config
  main(canvas)
}

// 测试程序，测试Tree/Leaf结构API的正确性
function main(canvas: HTMLCanvasElement) {
  // style modify
  document.body.style.backgroundColor = '#000'

  // main code
  const scene:Scene = new Scene({
    canvas,
    stats: true,
    glParams: { depth: false },
    assets: {
      corner: {
        example1: '/assets/corner/example1.png'
      },
      atom: {
        solid: '/assets/atom/solid.png',
        linearGradient: '/assets/atom/linearGradient.png'
      }
    }
  }) // 二维内容关闭深度测试
  const viewer:OrthoViewer = new OrthoViewer({ far: 4000 })
  scene.viewer= viewer

  scene.onReady(() => {
    const brush = new Brush({
      name: 'brush_1', width: 1, height: 1, subscriber: scene.getSubscriber()
    })

    const atom1 = new Atom({
      name: 'a_1_1',
      type: 'solid',
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      grey: 1
    })
    brush.add(atom1)
    brush.render()

    const rect1 = new Shape({
      name: 'rect1',
      geometry: { type: 'rect', width: 200, height: 200 },
      material: {
        type: 'standard',
        texture: 'brush_1',
        vs: `#version 300 es
          layout (location = 0) in vec4 positions;
          layout (location = 1) in vec2 uv;

          uniform mat4 u_projectionMatrix;
          uniform mat4 u_viewMatrix;
          uniform mat4 u_modelMatrix;
          uniform float u_textureHeight;

          out vec2 v_uv;

          void main() {
            gl_Position = vec4((u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(positions.xyz, f1)).xyz, f1);
            v_uv = uv; // vec2(gl_Position.x, uv.y);
          }
        `,
        fs: `#version 300 es
          
          uniform vec4 u_color;
          uniform sampler2D u_texture;
  
          in vec2 v_uv;
  
          out vec4 fragColor;
  
          void main() {
            #if (RENDER_CHANNEL == 100) // 仅仅开启alpha通道
              fragColor = mix(texture2D(u_texture, v_uv), vec4(0.3, 0.3, 0.3, 1.0), 0.5);
            #endif
          }
        `,
        uniforms: {
          u_textureHeight: 10
        },
        defines: {
          // 星轨的渲染通道控制，alpha通道/height通道/颜色通道
          RENDER_CHANNEL: 100
        }
      }
    })
    scene.add(rect1)
  })
}
