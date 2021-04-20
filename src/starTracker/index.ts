import { Shape, Flex2DGroup, Container2DGroup, Container2DGroupConfig, FlexParams, FlexItemConfig } from '../index'
import { RGBAColorObject, Orientation } from '../common'
import { GetSetNumber, GetSetSize } from '../utils'

export { Brush, Atom } from './Brush'
export { STShape } from './STShape'

const templates = []

// 基础数据格式定义：
// const AStarTrack = {
//   name: '', // 这个不必要
//   title: '四方型边框',
//   width: 400,
//   height: 240,
//   items: [
//     {
//       id: 1,
//       // 描述了这段路径的视觉容器（内部的话还需要路径位置展示）
//       type: 'rect',
//       // 描述了颜色
//       fill: { r: 1, g: 1, b: 1, a: 0.4 },
//        // 默认的grow和shrink就是0
//       h: { grow: 0, shrink: 0, basic: 20 },
//       v: { basic: 20 }
//     },
//     {
//       id: 2,
//       type: 'rect',
//       fill: { r: 1, g: 1, b: 1, a: 0.4 },
//       h: { grow: 1, shrink: 1, basic: 0 },
//       v: { grow: 1, shrink: 1, basic: 0 }
//     },
//     {
//       id: 3,
//       type: 'rect',
//       fill: { r: 1, g: 1, b: 1, a: 0.4 },
//       // 默认的grow和shrink就是0
//       h: { grow: 0, shrink: 0, basic: 20 },
//       v: { basic: 20 }
//     }
//   ],
//   flexs: [
//     {
//       items: [1, 2, 3],
//       direction: 'h'
//     }
//   ]
// }

type StarTrackContainerType = 'flex' | 'equal'

interface StarTrackItem {
  identity:number // 物件的唯一id
  desc?:string // 数据里的描述文本
  fill?:RGBAColorObject // 区域表示的颜色
  h:FlexParams
  v:FlexParams
  extends?:Orientation
  type?:StarTrackContainerType
}

export interface StarTrackConfig {
  name?:string // 这条星轨的英文名
  title?:string // 这条星轨的中文名
  width:number // 初始容器宽
  height:number
  items:Array<StarTrackItem>
  flexs:Array<FlexItemConfig>
}

// 专用于StarTrack的定制Flex2DGroup，它和原本的Flex2DGroup有一些核心区别：
// 1. 可以预制方向，并且添加的内容将会按照这个方向运行
// 2. 不支持多方向，会尽量简化成一个单一flex关系
interface StarTrackSegmentGroupConfig extends Container2DGroupConfig {

}

export class StarTrackSegmentGroup extends Flex2DGroup {
  constructor({ width, height, helper, name }:StarTrackSegmentGroupConfig) {
    super({ width, height, helper, name })
  }
}

export class StarTrackEqualRatioGroup extends Container2DGroup {

}

export interface StarTrack extends GetSetSize {}

@GetSetNumber('width', 0)
@GetSetNumber('height', 0)
export class StarTrack {
  public name:string
  public title:string

  public container:Flex2DGroup

  public assets = {
    corner: {
      1: '1.png'
    },
    line: {
      dot: 'dot.png',
      normal: 'normal.png'
    }
  }

  constructor({
    name = '',
    title = '',
    width,
    height,
    items,
    flexs
  }:StarTrackConfig) {
    this.name = name
    this.title = title
    this.width = width
    this.height = height

    this.createContainer(width, height)
    this.createItems(items)
    this.container.addFlex(flexs)
  }

  protected createContainer(width:number, height:number) {
    this.container = new Flex2DGroup({
      name: 'container',
      width,
      height,
      // helper: {
      //   stroke: { r: 1, g: 1, b: 1, a: 0.4 },
      //   strokeWidth: 4
      // }
    })
  }

  // starTrack的本质是一个单轴的flex容器
  protected createItems(items:Array<StarTrackItem>) {
    for (const item of items) {
      const container = new (item.type === 'flex' ? StarTrackSegmentGroup : StarTrackEqualRatioGroup)({
        name: `starItem_${item.identity}`,
        width: item.h.basic,
        height: item.v.basic,
        helper: item.fill ? { fill: item.fill } : null
      })
      // const shape = new Shape({
      //   name: 
      //   geometry: { type: item.type, width: item.h.basic, height: item.v.basic },
      //   fill: Object.assign({ type: 'pure' }, item.fill)
      // })
      this.container.add(container)
      this.container.addFlexItem(container, item)
    }
  }

  public getChildByIdentity(identity:number):Flex2DGroup {
    return this.container.getChildByIdentity(identity).target as Flex2DGroup
  }
}
