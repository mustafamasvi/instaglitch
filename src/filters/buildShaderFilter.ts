
import { defaultFragmentShader, defaultVertexShader } from '../fxGlue/GlueShaderSources';
import { Filter, FilterSettingType } from '../types';

function uniformType(type: FilterSettingType) {
  switch (type) {
    case FilterSettingType.BOOLEAN:
      return 'bool';
    case FilterSettingType.OFFSET:
      return 'vec2';
    case FilterSettingType.FLOAT:
    case FilterSettingType.TIME:
    case FilterSettingType.ANGLE:
      return 'float';
    case FilterSettingType.INTEGER:
    case FilterSettingType.SELECT:
      return 'int';
    case FilterSettingType.COLOR:
      return 'vec4';
    case FilterSettingType.Channel:
      return 'sampler2D';
  }
  return 'unknown';
}

export function buildShaderFilter(props: any): Filter {
  let shaderPrefix = '';

  if (props.settings) {
    for (const setting of props.settings) {
      shaderPrefix += `uniform ${uniformType(setting.type)} ${setting.key};\n`;
    }
    
    props.settings.push({ id: "iTexture",
    key: "iTexture",
    name: "iTexture",
    type: FilterSettingType.Channel})
  }

  return {
    id: props.id,
    name: props.name,
    description: props.description,
    settings: props.settings,
    fragmentShader: props.fragmentShader
      ? shaderPrefix + props.fragmentShader
      : defaultFragmentShader,
    vertexShader: props.vertexShader
      ? shaderPrefix + props.vertexShader
      : defaultVertexShader,
  };
}
