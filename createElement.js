
export class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  setAttribute(name, value) { // attribute
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  addEventListener(...args) {
    this.root.addEventListener(...args);
  }

  get style() {
    return this.root.style;
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for(let child of this.children) {
      child.mountTo(this.root);
    }
  }
}

export class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export function create(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls();
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  const visit = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new Text(child);
      }
      if (Array.isArray(child)) {
        visit(child);
        continue;
      }
      o.appendChild(child);
    }
  }

  visit(children);

  return o;
}
