# practice-graphical

记录练习图形化相关内容

# 笔记

## 可视化定义与分类

**可视化** 是一种把复杂的数据和信息通过图像形式表现出来的方法

可视化可以根据不同的分类方式进行归类，主要有以下几种：

- 根据 **维度** 的不同，可视化可以分为 `一维`、`二维`、`三维` 可视化。一维可视化指的是将数据按照一个维度进行表示，例如条形图、饼图、环形图等；二维可视化指的是将数据按照两个维度进行表示，例如散点图、折线图、柱状图等；三维可视化指的是将数据按照三个维度进行表示，例如立体图、三维散点图等。

- 根据 **形式** 的不同，可视化可以分为 `静态可视化` 和 `动态可视化`。静态可视化通过一张图像来呈现数据和信息，例如图表、图形等；动态可视化则可以通过时间轴、地图等动态展现数据和信息的变化趋势。

- 根据 **数据结构** 不同，可视化可以分为 `有结构数据` 和 `无结构数据` 的可视化。有结构数据指的是数据有固定的列和行的形式，例如数据库表格、折线图、雷达图等，这类数据的可视化需要根据数据的结构和属性进行分析和处理；无结构数据则指的是没有固定的格式和组织结构的数据，如音频、图像、文本、网络数据等。这些数据通常需要使用数据挖掘、机器学习、自然语言处理等手段进行分析和处理，再根据不同的可视化目的选择合适的技术将数据转化成可视化的图像、图表、地图等。

## 可视化技术与开发选型

下面是一些常用的在 Web 端的可视化技术：

- **SVG**：一种基于 XML 的图形格式，可以用于创建向量图像。与位图不同，SVG 图像使用数学方程式描述图形，因此它们可以无损放大或缩小。SVG 图像也可以使用 JavaScript 进行动画和交互。

- **D3.js**：基于 JavaScript 的可视化编程库，可以帮助开发人员创建交互式数据可视化。D3.js 提供了强大的 SVG 和 CSS 支持，使得用户能够轻松创建高品质的可视化图表。

- **Canvas**：一种 HTML5 元素，允许通过 JavaScript 绘制 2D 图形。相较于 SVG，Canvas 的渲染速度更快，但它不支持与 DOM 的交互。Canvas 图形也可以使用 JavaScript 进行动画和交互。

- **Three.js**：基于 WebGL 实现的 JavaScript 3D 引擎库，使开发人员能够轻松创建 3D 图形、动画和交互式场景。它提供了一系列强大的工具和 API，可以在浏览器中创建出高质量的 3D 应用程序。

- **WebGL**：一种基于 OpenGL ES 2.0 的 3D 图形库，通过 JavaScript API 在浏览器中实现硬件加速的 3D 绘图。WebGL 可以与 Canvas 和 SVG 结合使用，创造出更加复杂和逼真的交互式 3D 场景。

业务开发的技术选型：

- **CSS** 其实也可以做可视化的图表，只不过浏览器的 DOM 计算更影响性能并且没有图形化 API 接口规范，不太适合我们业务场景的使用。

- **SVG** 是矢量图，区别于位图缩放不会有精度丢失，使用 SVG 我们可以像操作 DOM 一样方便我们监听事件等，`适合图形数量少的场景`。

- **Canvas** 是一个画布，你可以简单想象自己是一个画家在画布上不断增加内容，没有 DOM 的回流重绘等复杂的布局计算，大批量的图形绘制在 Canvas 里只是一个图形，我们只要保证每一帧的绘制即可，所以 `更适合大量图形的场景`。

- 前面的是二维场景下，而在 `三维场景` 下 WebGL 和 Three.js 是父子关系。**WebGL** 是基于 OpenGL 的 3D 图形接口标准在 Web 端的实现，通过 Shader 着色器的编写，我们能直接操作 GPU 渲染。而 **Three.js** 是 WebGL 的封装，我们平常业务会使用 Three.js 这种成熟的框架来快速开发三维应用。

## 浏览器的图形渲染原理

[浏览器渲染过程](https://github.com/XieZongChen/review-notes/blob/main/Browser.mm.md#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E6%B8%B2%E6%9F%93)

**光栅化**（rasterization）又称栅格化，`是将矢量图形转换为像素图形的过程`。在计算机图形学中，图形需要经过光栅化才能在屏幕上显示或输出，因为计算机屏幕上显示的图像是由一系列像素点组成的，而矢量图形都是由图形语言表达的点线面，无法直接显示。光栅化是由 GPU 计算的，CPU 核心数量是不足以快速计算每一个三角面的，GPU 会有大量的核心来高效并行计算。光栅化不仅仅用来转换像素，同时也可以深度跟踪、遮挡检测、阴影计算等，这块在 WebGL 就可以一探究竟。

**光栅化的过程**:

- 确定图形的布局位置及大小
- 根据三角面的射线到屏幕位置，将颜色信息、深度信息填充到对应位置
- 合并所有三角形的像素值，生成最终的像素图形

## 图表设计

本节从 Edward R. Tufte 所著的《The Visual Display of Quantitative Information》 摘取汇总，这本书被广泛认为是数据可视化领域的必读之一，其深入探讨了图表的设计原则、数据编码、视觉通道、图表类型选择等方面的内容；还讨论了图表中的标签、颜色、布局等元素的使用，并提供了关于图表评估和改进的指导。

### 数据图形化

**数据图形化** 是指使用图形和可视元素来呈现数据，以便更直观地理解和传达数据的含义。数据图形化的目标是 **通过视觉表达来传达数据的含义**，而不仅仅是简单地呈现原始数据。通过将数据转化为图形，可以更容易地观察和理解数据的特征，以及数据之间的关系。

**常用图形元素**：

- **点（Dot）**：用来表示单个数据点或观测值。它们可以根据数据的某个属性进行定位，如在散点图中使用 x 和 y 坐标来表示两个变量之间的关系。

- **线（Line）**：用来表示数据之间的趋势和变化。例如，在折线图中，我们可以使用线来连接不同时间点的数据点，以显示随时间变化的趋势。

- **条（Bar）**：条形图是一种常见的图表类型，用于比较不同类别或组之间的数据。每个条形的高度可以表示数据的大小。

- **饼（Pie）**：饼图用于显示不同类别在总体中的比例关系。每个类别被表示为一个扇形，其角度大小与该类别所占比例成正比。

- **区域（Area）**：区域图可以用来表示数据的累积值或分布情况。它可以帮助我们观察数据的总体趋势和变化。

在数据图形化中，还需要考虑如何使用颜色、形状、大小和标签等视觉属性来编码数据。例如，可以使用不同的颜色来表示不同的类别或分组，使用点的大小来表示数据的重要性或权重

### 数据编码

**数据编码** 是将数据值转换为图形属性（如位置、长度、颜色等）的过程。通过正确选择和使用数据编码方式，可以将抽象的数据转化为可视化元素，使其更具 **信息量** 和 **可解释性**，从而更好地理解和传达数据

**常见的数据编码方式**：

- **位置（Position）**：位置编码是将数据值映射到图形元素的位置上。例如，在散点图中，我们可以使用数据的 x 和 y 值来确定点的位置。通过位置编码，我们可以比较不同数据点之间的差异和关系。

- **长度（Length）**：长度编码是将数据值映射到图形元素的长度上。例如，在条形图中，我们可以使用条的高度来表示数据的大小。通过长度编码，我们可以直观地比较不同数据之间的差异。

- **颜色（Color）**：颜色编码是将数据值映射到图形元素的颜色上。通过选择不同的颜色，我们可以表示不同的类别、分组或数值范围。颜色编码可以帮助我们识别不同数据之间的模式和关联。

- **形状（Shape）**：形状编码是将数据值映射到图形元素的形状上。通过使用不同的形状，我们可以表示不同的类别或分组。形状编码可以帮助我们区分不同的数据点或数据组。

- **大小（Size）**：大小编码是将数据值映射到图形元素的大小上。通过选择不同的大小，我们可以表示数据的重要性、权重或数量。大小编码可以帮助我们比较不同数据之间的相对大小。

这些编码方式可以单独使用，也可以组合使用，以便更好地传达数据的含义。在选择数据编码方式时，应考虑数据的特性和目标，能够准确地表示数据的特征，并使其易于理解和解释。同时，还应注意避免误导或混淆，确保所选择的编码方式与数据的含义相符。

### 视觉通道

**视觉通道** 是用于表示数据的可视属性，如位置、长度、角度、颜色、形状、纹理等。在代码中，视觉通道可以存储在图表的数据结构中，合理的构建视觉通道相关的结构并保存对应数据，可以提升图表的性能，以承载更多数据

**常见的视觉通道**：

- **位置（Position）**：最常用的视觉通道之一。通过将数据值映射到图形元素的位置上，我们可以比较不同数据之间的差异和关系。例如，在散点图中，我们可以使用数据的 x 和 y 值来确定点的位置。

- **长度（Length）**：另一个常用的视觉通道。通过将数据值映射到图形元素的长度上，我们可以直观地比较不同数据之间的差异。例如，在条形图中，我们可以使用条的高度来表示数据的大小。

- **角度（Angle）**：用于表示数据之间的相对关系和比例。通过将数据值映射到图形元素的角度上，我们可以观察到数据之间的相对大小和分布。例如，在雷达图中，我们可以使用不同的角度来表示不同的数据维度。

- **颜色（Color）**：可以用来表示不同的类别、分组或数值范围。通过选择不同的颜色，我们可以区分不同的数据，并传达数据的特征和关系。颜色通道可以帮助我们识别模式、趋势和关联。

- **形状（Shape）**：用于表示不同的类别或分组。通过使用不同的形状，我们可以区分不同的数据点或数据组。形状通道可以增加数据的可区分性和可辨识性。

选择合适的视觉通道取决于数据的特性和目标，以及设计师的判断和创造力。工程化的过程中，还要考虑目标机器的性能。

### 图表类型

- **线图（Line Chart）**：用于显示随时间或其他连续变量变化的趋势。通过连接数据点，我们可以观察到数据的演变和趋势。

- **条形图（Bar Chart）**：用于比较不同类别或组之间的数据。每个条形的高度可以表示数据的大小或数量。

- **散点图（Scatter Plot）**：用于显示两个变量之间的关系。每个数据点在图上由其对应的 x 和 y 值决定，可以帮助我们观察到数据的分布和相关性。

- **饼图（Pie Chart）**：用于显示不同类别在总体中的比例关系。每个类别被表示为一个扇形，其角度大小与该类别所占比例成正比。

- **区域图（Area Chart）**：用于显示数据的累积值或分布情况。通过填充区域，我们可以观察到数据的总体趋势和变化。

- **散布图（Scatterplot Matrix）**：散布图矩阵是一种多变量可视化方法，用于显示多个变量之间的关系。它由多个散点图组成，每个散点图显示两个变量之间的关系。

- **热力图（Heatmap）**：用于显示数据的密度和分布情况。通过使用颜色编码，我们可以观察到不同数据值的频率和强度。

还有许多其他类型的图表可供选择，具体取决于数据的特性和目标。

### 数据-墨水比原则

用描述数据的墨水量除以所有图形使用的墨水量可以得到 **数据-墨水比**，此数据可表现出图表的关键信息程度（与关键信息对应的叫图表垃圾）。**数据-墨水比原则** 强调在数据可视化中最大化数据墨水的使用，以减少无关信息的噪音

数据-墨水比原则的核心思想是：**图表中的墨水应该主要用于表示和传达数据，而不是用于装饰或增加图表的复杂性**。通过最小化无关墨水的使用，我们可以提高图表的 `信息密度` 和 `可读性`。

一般用 **图表垃圾** 来描述对图表理解信息不必要或干扰信息理解的视觉元素。比如，粗重的网格线、不必要的文本、图形中的装饰图片、不合理的阴影或立体元素、坐标轴装饰元素。所以通常设计师对辅助线会设计比较纤细、表格不会用背景和边框、尽量用 2 维图表来表达信息，等等。

**设计图表时应该遵循以下原则**：

- 墨水应该主要用于表示数据：图表中的墨水应该用于直接表示和传达数据，而不是用于装饰或装饰图表元素。

- 最小化无关墨水的使用：避免使用不必要的线条、阴影、边框等装饰元素，以减少图表中无关信息的干扰。

- 简洁和清晰的图表设计：图表应该保持简洁、直观和易于理解。避免过多的标签、注释或其他冗余信息。

### 多变量数据可视化

**多变量数据可视化** 是指同时展示和比较多个变量之间关系的可视化方法。其目标是通过使用不同的视觉通道和图形元素来表示多个变量的值。

以下是一些常见的多变量数据可视化技术：

- 散点矩阵（Scatterplot Matrix）：一种显示多个变量之间关系的图表。它由多个散点图组成，其中每个散点图表示两个变量之间的关系。通过在矩阵中显示多个散点图，我们可以同时观察和比较多个变量之间的关系。

- 平行坐标图（Parallel Coordinates）：用于可视化多个连续变量之间的关系。它由一组平行的垂直线段组成，每个线段代表一个变量。通过连接每个变量的线段，我们可以观察到变量之间的关系和趋势。

- 热力图（Heatmap）：用于显示多个变量在多个类别或时间点上的值。它使用颜色编码来表示变量值的大小或密度。通过观察颜色的变化，我们可以发现不同变量之间的模式和关联。

- 平铺图（Tile Plot）：一种将多个变量的值以矩形图块的形式展示的图表。每个图块代表一个变量，并根据变量的值进行着色。通过排列和比较不同变量的图块，我们可以观察到变量之间的关系和趋势。

通过同时展示多个变量，可以让图表表达出多个变量之间、多变量与多变量总体之间的关系等，但随着变量增多，图表的数据承载会变多，变量的一些数据特征会下降，会造成用户对部分特征的专注度降低，同时图表渲染的性能也会降低。所以设计时需要有所取舍

### 三维可视化

三维可视化是一种将三维空间中的数据呈现为交互式图像的技术。

- **三维坐标系统**：三维可视化需要使用三维坐标系来表示和处理数据。三维坐标系由 X、Y 和 Z 三个坐标轴组成，每个轴代表一个相互垂直的维度。在三维空间中，对象的位置可以用三维坐标来描述。

- **视角**：在三维可视化中，视角代表观察者的视角或相机的位置和朝向。视角影响着三维场景的呈现方式和交互方式。用户可以通过改变视角来浏览三维场景。

- **渲染**：在三维可视化中，渲染指将三维数据转换为可视图像的过程。三维数据可以运用不同的算法和技术来呈现，如光照、材质、阴影、透视等。

- **交互**：在三维可视化中，用户可以使用交互方式对场景对象进行操作，如旋转、平移、缩放等。交互可以提高用户对数据的理解和感受，使其更加灵活和直观。

- **动画**：三维可视化中的动画可以用来模拟三维场景中的运动和变化，如物体的运动、旋转、缩放、出现和消失等。通过动画，用户可以更好地理解和感受数据，也能够提高用户的参与度和吸引力。

#### 建模

- **点的建模**：点是三维空间中最基本的元素之一，是一种无限小的实体，不具备长度、宽度和高度等尺寸和方向特征。而在计算机中，点则是由三维坐标 (x,y,z) 来构成的。例如，一组坐标 (0,0,0) 可以表示空间中的原点，以此类推，可以得到任意一个点在三维空间中的位置，如 (1,2,3)、(-1,-2,-3) 等。在三维建模中，点可被用于表示模型中的精细部分，例如雕塑中的细节，同时也可被用作其他元素的基础

- **线的建模**：线由两个点连接而成，其具有长度和方向特征，而在三维建模中，线是由多个点组成，并通过点的位置来描述线的路径。同样的，通过坐标轴上的取值，使得线在空间中得到精确定位。线的建模在三维建模中经常被用于描述建筑或产品的架构和结构，例如汽车车架、建筑物的框架等。在计算机中，曲线是由大量的直线段构成，是否圆滑取决于曲线的细分段数。`细分数越大会导致顶点数量变大，每个顶点由 3 个坐标值 xyz 控制，而且每个顶点会有颜色信息、法线信息、纹理信息等，所以选择合适的细分段数可以减少计算的损耗并提升性能`

- **面的建模**：面由多个线彼此连接而成，具有面积和方向特征。在计算机中，面的建模主要是通过多边形来实现的。多边形是一种由线段构成的封闭图形，它可以用来描述很多模型中的平面表面，例如物体的侧面、前面、背面、切面等。相比于线，面的建模更为复杂，建模需要考虑到表面的细节、表现方式和纹理等特征。

#### 网格细分

**网格细分** 是一种以网格为基础的对象表达方式。它将原始的网格分割成更小的面片，以提高模型精度和细节。网格细分的本质是分割，将原本“粗糙”的网格分割成更密集的点与线，通过逐步将粗糙度减少，来达到模型细节逼真且更精确的目的。这种做法常在角色、场景、特效等细节非常丰富、复杂而庞大的模型中使用。

网格细分有如下好处：

- **提高图形细节的显示和表现效果**。在三维建模中，通过网格细分可以将原本不够精细的模型分成更细的面片，使其在显示时更加平滑和自然，提高了图形的精度和真实度，使得模型具有更多的细节和质感。尤其是在制作超真实高精度模型、特效场景等方面，网格细分就是必要的最基本的功能。

- **加速渲染速度和优化模型性能**。通过网格细分可以将原始模型拆分成多个小网格，在渲染时逐个进行处理。这种方法使得模型的处理和渲染更加高效，加速开发的进程。

- **增强建模的可操作性和灵活性**。以网格细分为基础的建模，可以迅速解决一些复杂的问题，也有助于快速测试和验证开发者的想法。同时，使用网格细分技术，建模的过程更具有机动性和灵活性，能够更好地满足客户需求。

### 图表评估和改进

图表可以通过以下维度进行评估：

- 可读性评估：评估图表的可读性是确保图表能够被观众轻松理解和解读的重要一环。这包括评估图表的布局、标签的清晰度、坐标轴的刻度和单位、字体的大小等。通过评估可读性，我们可以确保图表的信息能够被准确地传达给观众。

- 数据精确性评估：评估图表中的数据精确性是确保数据的准确性和一致性的关键。这包括检查数据源、计算公式、数据转换等方面。通过评估数据精确性，我们可以确保图表中的数据表示准确无误。

- 图表类型选择评估：评估所选择的图表类型是否适合表达所要传达的信息和关系。这包括评估所使用的图表类型是否能够清晰地表达数据的特征和关联。如果图表类型不适合，可能需要考虑更合适的图表类型。

## CSS 可视化

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

#### Transform 的矩阵变换

Transform 的矩阵（matrix）使 CSS 有了处理三维场景的能力。

`matrix` 是用于应用仿射变换的函数。它可以将输入的参数转化成一个矩阵。

`transform: matrix(a, b, c, d, e, f)` 可以将其理解为：将目标节点的原始状态与 `matrix` 接收参数后生成的矩阵相乘，最后得到的矩阵就是节点变换后的状态。

**矩阵变换的数学基础**：

在数学上，矩阵变换是通过矩阵乘法实现的。对于 2D 变换，`matrix(a, b, c, d, e, f)` 可以表示为：

\[
\begin{bmatrix}
a & c & e \\
b & d & f \\
0 & 0 & 1
\end{bmatrix}
\]

这个矩阵接受一个 2D 向量 \((x, y)\) 并输出一个新的向量 \((x', y')\)：

\[
\begin{bmatrix}
x \\ y \\ 1
\end{bmatrix}
\begin{bmatrix} 
a & c & e \\ 
b & d & f \\ 
0 & 0 & 1
\end{bmatrix} = 
\begin{bmatrix}
x' \\y' \\1
\end{bmatrix}
\]

**Transform 可以使用的矩阵有两种**：

- matrix
  - 用于处理二维空间内的变换效果
  - 接收六个参数，构成一个 3 x 3 的矩阵，用于处理平面上的变换，如旋转、缩放、倾斜和位移等
  - 不支持直接设置透视效果
- matrix3d
  - 除了包含 matrix 的所有功能外，还能处理三维空间中的变换
  - 接收十六个参数，构成一个 4 x 4 的矩阵，用于处理三维空间中的变换，包括平面变换所有功能以及深度方向的缩放、旋转和位移
  - 支持设置透视效果，这是 3D 变换的一个重要特性。matrix3d 的最后一行四个数与透视相关


