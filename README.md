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

#### filter 过滤器

css 的 `filter` 的属性有：`blur()` 模糊度、`brightness()` 明度、`contrast()` 对比度、`drop-shadow()` 显示元素后面的阴影、`grayscale()` 灰度、`hue-rotate()` 正负值旋转的色轮、`invert()` 反相、`opacity()` 透明度、`sepia()` 棕褐色程度、`saturate()` 饱和度、`url()` 允许应用 SVG 文件中定义的过滤器，其中：

- CSS 的过滤器其实是 SVG 的子集，在矢量化图形上过滤器有非常大的作用，SVG 和 CSS 的结合能实现更强大的效果
- 通过 `blur` 和 `contrast` 可以实现交融的效果，比如将锐角转为圆弧、充电特效
- 通过 `drop-shadow` 可以让元素的背面呈现模糊，而元素上层的元素不受影响，这点可以用在毛玻璃特效上

#### 实用函数

- `calc()`：计算函数，用于动态计算，一般用于固定尺寸的计算
- `attr()`：属性函数，可以更方便引用 HTML 的自定义属性
- `clamp()`：比较函数，`clamp(<首选值>, <最小值>, <最大值>)` 只要尺寸不超过最小和最大边界，就会遵循首选值。相比媒体查询，可以更简洁方便地处理响应式

#### 伪类 `:is` 和 `:where` 的逻辑函数和条件函数

`:is()` 和 `:where()` 是 CSS 中的伪类选择器，允许以一种高效的方式对一系列选择器进行分组和定位。两者唯一区别在于 **权重**，`:where()` 的权重为 0，`:is()` 作为伪类选择器的权重为 10。

```css
button.focus,
button:focus {
}
- > button:is(.focus, :focus) {
}

content > h1,
content > h2,
content > h3,
content > h4 {
}
- > content > :is(h1, h2, h3, h4) {
}
```

### 练习

#### 实现一个带透视的立方体

- [效果](https://xiezongchen.github.io/practice-graphical/css/cube) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/cube.html)

#### Gradient 渐变练习

- [重复渐变与进度条](https://xiezongchen.github.io/practice-graphical/css/progress) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/progress.html)

- [特殊渐变练习](https://xiezongchen.github.io/practice-graphical/css/specific-gradient) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/specific-gradient.html)

#### 遮罩练习

注意：**遮罩图像中的不透明部分将显示出元素的内容，透明部分将隐藏元素的内容**

- [效果](https://xiezongchen.github.io/practice-graphical/css/mask) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/mask.html)

#### Houdini 练习

经过尝试，只有 Paint Worklet 可以使用，而且兼容性很差，chrome 倒是能生效。这个 API 算是 MDN 给前端画的大饼吧

- [效果](https://xiezongchen.github.io/practice-graphical/css/houdini) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/houdini.html)

#### 实现 2d 柱状图

- [效果](https://xiezongchen.github.io/practice-graphical/css/css-bar-chart) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/css-bar-chart.html)

#### 实现 2d 饼图和环形图

- [基于 clip-path 裁剪 + transform 变换实现](https://xiezongchen.github.io/practice-graphical/css/css-pie-chart1) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/css-pie-chart1.html)

- [基于 conic-gradient 圆锥渐变实现](https://xiezongchen.github.io/practice-graphical/css/css-pie-chart2) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/css-pie-chart2.html)

#### 实现 2d 散点图和折线图

- [效果](https://xiezongchen.github.io/practice-graphical/css/css-line-chart) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/css-line-chart.html)

#### 实现 3d 柱状图

- [效果](https://xiezongchen.github.io/practice-graphical/css/css-3d-bar) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/css/css-3d-bar.html)

## SVG

- [基础练习](https://xiezongchen.github.io/practice-graphical/svg/first.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/first.svg)

### 过滤器

- [练习](https://xiezongchen.github.io/practice-graphical/svg/filter.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/filter.svg)

### 遮罩

- [练习](https://xiezongchen.github.io/practice-graphical/svg/mask.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/mask.svg)

> xmlns 和 xmlns:xlink：
>
> - xmlns 属性用于定义 XML 文档中的默认命名空间。它指定了 XML 元素和属性的命名空间，如果没有指定其他命名空间，则默认使用该命名空间。
> - xmlns:xlink 属性也是用于定义 XML 文档中的命名空间，但它是为了支持 XLink（XML 链接）规范而定义的。xmlns:xlink 属性指定了用于解析和处理 XLink 链接的命名空间。

### 分组与引用

- [练习](https://xiezongchen.github.io/practice-graphical/svg/group.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/group.svg)

### 横纵比练习

- [练习](https://xiezongchen.github.io/practice-graphical/svg/aspect-ratio.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/aspect-ratio.svg)

### 文字相关练习

- [文本跟随路径运动动画](https://xiezongchen.github.io/practice-graphical/svg/text-animate.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/text-animate.svg)

- [剪裁路径使用文本](https://xiezongchen.github.io/practice-graphical/svg/text-clip.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/text-clip.svg)

### 动画相关练习

- [一个简单的声音播放动画](https://xiezongchen.github.io/practice-graphical/svg/animation-play-audio.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/animation-play-audio.svg)

- [一个简单的 loading 动画](https://xiezongchen.github.io/practice-graphical/svg/animation-loading.svg) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/animation-loading.svg)

- [一个炫酷的提交按钮](https://xiezongchen.github.io/practice-graphical/svg/submit-btn) | [实现代码](https://github.com/XieZongChen/practice-graphical/blob/main/svg/submit-btn.html)
