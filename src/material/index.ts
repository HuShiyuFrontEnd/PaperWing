import { PureColorMaterial, PureColorMaterialConfig } from './PureColorMaterial'
import { Texture2DMaterial, Texture2DMaterialConfig } from './Texture2DMaterial'
import { StandardMaterial, StandardMaterialConfig } from './StandardMaterial'

export type MaterialType = PureColorMaterial | Texture2DMaterial | StandardMaterial

export type MaterialConfig = PureColorMaterialConfig | Texture2DMaterialConfig | StandardMaterialConfig

export function getMaterial(config:MaterialConfig) {
  let prototype
  switch(config.type) {
    case 'pure': prototype = PureColorMaterial; break
    case 'texture2d': prototype = Texture2DMaterial; break
    case 'standard': prototype = StandardMaterial; break
  }
  return new prototype(config)
}