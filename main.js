import { create } from './createElement';

class Carousel {
  constructor(type) {
    this.children = [];
    this.attribute = new Map();
  }

  setAttribute(name, value) { // attribute
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    const children = this.data.map(url => {
      const element = <img src={url} />
      element.addEventListener('dragstart', e => e.preventDefault());
      return element;
    });
    const root = (
      <div class="carousel">
        {children}
      </div>
    );

    let position = 0;

    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      current.style.transition = "none";
      next.style.transition = "none";

      current.style.transform = `translateX(${- 100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      requestAnimationFrame(() => {
        // 第一个 requestAnimationFrame 是上面设置style的一帧，下一帧就要再套一个
        requestAnimationFrame(() => {
          current.style.transition = "ease 0.5s";
          next.style.transition = "ease 0.5s";

          current.style.transform = `translateX(${-100 - 100 * position}%)`;
          next.style.transform = `translateX(${-100 * nextPosition}%)`;

          position = nextPosition; // 让 position 循环
        });
      });


      // setTimeout(() => {

      //   current.style.transition = "ease 0.5s";
      //   next.style.transition = "ease 0.5s";

      //   current.style.transform = `translateX(${-100 - 100 * position}%)`;
      //   next.style.transform = `translateX(${-100 * nextPosition}%)`;

      //   position = nextPosition; // 让 position 循环

      // }, 16);

      setTimeout(nextPic, 3000);
    }
    setTimeout(nextPic, 3000);

    root.addEventListener('mousedown', (event) => {
      const startX = event.clientX;
      const startY = event.clientY;

      let nextPosition = (position + 1) % this.data.length;
      let lastPosition = (position - 1 + this.data.length) % this.data.length;

      let current = children[position];
      let last = children[lastPosition];
      let next = children[nextPosition];

      current.style.transition = "none";
      last.style.transition = "none";
      next.style.transition = "none";

      current.style.transform = `translateX(${- 500 * position}px)`;
      last.style.transform = `translateX(${- 500 - 500 * position}px)`;
      next.style.transform = `translateX(${500 - 500 * position}px)`;


      let move = (event) => {
        const { clientX, clientY } = event;

        current.style.transform = `translateX(${clientX - startX - 500 * position}px)`;
        last.style.transform = `translateX(${clientX - startX - 500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${clientX - startX + 500 - 500 * nextPosition}px)`;

      };

      let up = (event) => {
        const { clientX, clientY } = event;

        let offset = 0;

        if (clientX - startX > 150) {
          offset = 1;
        } else if (clientX - startX < -150) {
          offset = -1;
        }

        current.style.transition = "ease 0.5s";
        last.style.transition = "ease 0.5s";
        next.style.transition = "ease 0.5s";

        current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;


        position = (position - offset + this.data.length) % this.data.length;

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    return root;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

const data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

const component = <Carousel data={data} />;

component.mountTo(document.getElementById('root'));
