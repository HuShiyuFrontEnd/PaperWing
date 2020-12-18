import { Leaflike, Treelike } from '../utils'
import { mixin } from '../utils/mixin'
import { Renderer } from './Renderer'
import { RenderLoop, AnimationLoopStartOptions, RenderLoopCarrier } from './RenderLoop'
import Subscriber from './Subscriber'

interface SceneInitConifg {
  canvas?: HTMLCanvasElement
  options?: AnimationLoopStartOptions
}

// export interface ListenGL {
//   get():GLContext
// }

interface SceneChild extends Leaflike {
  render()
}

// 将RenderLoopCarrier这个扩展混合进Treelike
class SceneTreelike extends Treelike {}
interface SceneTreelike extends RenderLoopCarrier {}
mixin(SceneTreelike, [RenderLoopCarrier])

export class Scene extends SceneTreelike {
  public canvas: HTMLCanvasElement
  public renderer:Renderer
  public children:Array<SceneChild> = []
  public get is2() { return this.loop && this.loop.version === 2 }
  protected subscriber:Subscriber
  
  constructor({ canvas, options = {} }: SceneInitConifg) {
    super()
    
    this.canvas = canvas
    this.subscriber = new Subscriber()

    this.loop = new RenderLoop({ canvas, subscriber: this.subscriber, options })

    this.renderer = new Renderer({ scene: this })
  }

  public add(child:SceneChild):number {
    const index = super.add(child)
    child.setSubscriber(this.subscriber)

    return index
  }

  public destroy() {
    this.subscriber.clear()
  }
}
