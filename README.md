# practice-graphical

记录练习图形化相关内容

## 可视化知识点

- [可视化定义与分类](https://github.com/XieZongChen/review-notes/blob/main/Graphics.mm.md#%E5%8F%AF%E8%A7%86%E5%8C%96%E5%AE%9A%E4%B9%89%E4%B8%8E%E5%88%86%E7%B1%BB)
- [可视化技术与开发选型](https://github.com/XieZongChen/review-notes/blob/main/Graphics.mm.md#%E5%8F%AF%E8%A7%86%E5%8C%96%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%BC%80%E5%8F%91%E9%80%89%E5%9E%8B)
- [浏览器的图形渲染原理](https://github.com/XieZongChen/review-notes/blob/main/Graphics.mm.md#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E5%9B%BE%E5%BD%A2%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86)
- [图表设计](https://github.com/XieZongChen/review-notes/blob/main/Graphics.mm.md#%E5%9B%BE%E8%A1%A8%E8%AE%BE%E8%AE%A1)

## CSS 可视化

### 知识点

- [Transform 的矩阵变换](https://github.com/XieZongChen/review-notes/blob/main/Graphics.mm.md#transform-%E7%9A%84%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2md-%E6%9F%A5%E7%9C%8B%E8%BD%AF%E4%BB%B6%E9%9C%80%E8%A6%81%E6%94%AF%E6%8C%81-latex)

### 技巧与疑难问题汇总

#### Transform 字体模糊问题

transform2D 一般用于 2D 场景的变换，transform3D 用于 3D 场景的变换，但是在一些特殊场景 transform2D 会字体模糊问题，比如使用 `transform: translate(-50%, -50%)`。

**导致字体模糊的原因是**：这个变换会触发浏览器对元素进行硬件加速。在某些浏览器中，硬件加速可能会导致更简化的文本渲染方法，从而出现字体模糊的情况。

解决方法一：使用 `transform: translate3d(-50%, -50%, 0)`，将元素的变换转换为 3D 变换。这样可以强制浏览器使用更高质量的文本渲染，从而避免字体模糊的问题。

解决方法二：使用 `backface-visibility: hidden` 属性，将元素的背面隐藏起来，这有助于提高字体的清晰度。

#### Transform 导致 z-index 不生效

[元素的层叠上下文、层叠顺序](https://github.com/XieZongChen/review-notes/blob/main/CSS.mm.md#%E5%85%83%E7%B4%A0%E7%9A%84%E5%B1%82%E5%8F%A0%E4%B8%8A%E4%B8%8B%E6%96%87%E5%B1%82%E5%8F%A0%E9%A1%BA%E5%BA%8F)

transform 属性会导致子元素的 z-index 失效的原因是：transform 属性会创建一个新的渲染上下文，这个新的上下文会将元素的层叠上下文分离出去，从而导致原来上下文中 z-index 属性失效。除此之外，比如 `perspective`、`isolation` 等属性都会导致此问题。

解决方法一：更改 HTML 结构，将需要较高 z-index 的子元素移出应用了 transform 属性的父元素

解决方法二：避免使用创建新的上下文的属性

解决方法三：给父容器添加更高层级的 z-index

#### 合理使用 Transform 的渲染优化

`transform` 拥有自身独立上下文是渲染优化的关键，它可以轻易地与原视图组合重绘而不用花费主线程大量计算时间进行 [重排](https://github.com/XieZongChen/review-notes/blob/main/Browser.mm.md#%E9%87%8D%E6%8E%92)。

使用 transform 属性时，浏览器会创建一个 **新的渲染层（也称为合成层或者 GPU 层）**。这个渲染层是在页面的元素上进行变换操作时创建的，它在浏览器窗口的层次结构中处于独立的层级。

这个新的渲染层可以提供更高效的渲染和动画效果，因为它可以利用硬件加速来进行图形计算和渲染。创建新的渲染层也会带来一些性能开销。过多地创建渲染层可能会消耗更多的内存和处理资源，从而影响页面的性能。因此，在使用 transform 属性时，**需要谨慎使用，并避免不必要的渲染层的创建**。

如果只涉及到简单的平面变换，如旋转、缩放和平移等，2D 变换通常会更高效。而如果需要实现更复杂的三维效果或者涉及到透视变换等情况，3D 变换可能更适合。

### 练习

#### 实现一个带透视的立方体

[实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/cube.html)

[效果](https://xiezongchen.github.io/practice-graphical/cube)
