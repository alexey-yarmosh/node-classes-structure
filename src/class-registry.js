const { String2HexCodeColor } = require('string-to-hex-code-color');

class ClassRegistry {
  constructor () {
    this.string2color = new String2HexCodeColor();
    this.classesMap = new Map();
    this.classesMap.set(Object, Object.name);
  }

  register (classes, moduleName) {
    for (const cl of classes) {
      this.classesMap.set(cl, `${moduleName}.${cl.name}`);
    }
  }

  getName (cl) {
    const name = this.classesMap.get(cl);
    if (name === 'Object') {
      return 'global.Object';
    }
    if (name) {
      return name;
    }
    try {
      eval(cl.name);
    } catch (error) {
      return `hidden.${cl.name}`;
    }
    return cl.name ? `global.${cl.name}` : '[Function (anonymous)]';
  }

  getColor (cl) {
    const name = this.getName(cl);
    const moduleName = name.split('.')[0];
    return this.string2color.stringToColor(moduleName, 0.6);
  }

  getOutlineColor (cl) {
    const name = this.getName(cl);
    const moduleName = name.split('.')[0];
    return this.string2color.stringToColor(moduleName, -0.1);
  }
}

const classRegistry = new ClassRegistry();

module.exports = classRegistry;
