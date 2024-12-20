import {
  findClosestId,
  drawLine,
  removeOddIndexItems,
  drawText,
  drawCurve,
  drawPolyline,
} from './utils.js';

export default class KlineChart {
  /** 时间集合 */
  times = [];
  /** k线图集合 */
  kList = [];
  /** k线图渲染长度 */
  kLen = 0;
  /** 是否是第一次渲染 */
  firstInto = true;

  series = [];

  /** 渲染区域数据 */
  view = {
    /** 系列集合 */
    series: [],
    lineSeries: [],
    /** 时间集合 */
    times: [],
    /** 过滤挤占时间集合 */
    filterTimes: [],
    /** k线图集合 */
    kList: [],
    /** y轴标签集合 */
    yLabels: [],
    /** x轴刻度x坐标集合 (适配后) */
    xTicks: [],
    /** x轴刻度x坐标集合（全部刻度）*/
    xTicksSum: [],
    /** k线渲染个数 */
    kLen: 0,
    /** k线区域坐标 */
    lb: { x: 0, y: 0 },
    rt: { x: 0, y: 0 },
    rb: { x: 0, y: 0 },
    lt: { x: 0, y: 0 },
    /** k线区域尺寸 */
    width: 0,
    height: 0,
    /** 实心宽度 */
    solidWidth: 0,
    /** 绘图区域Y轴的val范围 */
    yMaxVal: 0,
    yMinVal: 0,
    yAreaVal: 0,
    /** 安全区域Y轴的val范围 */
    yMaxSafeVal: 0,
    yMinSafeVal: 0,
    /** 范围id */
    start: 0,
    end: 0,
    /** 实体中心坐标集合 */
    candleCenters: [],
    /** y 轴label的差值 */
    yLabelDiff: 0,
  };

  /** 事件相关数据 */
  event = {
    /** 鼠标位置 */
    pointer: { x: 0, y: 0 },
    downPointer: { x: 0, y: 0 }, // 按下位置
    upPointer: { x: 0, y: 0 }, // 抬起位置
    inner: false,
    activeId: -1,
    activeOriginData: null,
  };

  constructor(option) {
    // 解析 option，方便获取数据
    this.option = option;
    this.times = option.xAxis.data;
    this.kList = option.series[0].data;
    this.kLen = this.kList.length;
    this.view.start = option.area.start;
    this.view.end = option.area.end;
    this.series = option.series.slice(1, option.series.length);
    this.init();
    this.render();
  }

  /**
   * 初始化 canvas 并记录相关数据
   */
  init() {
    // 获取上下文
    const canvas = document.getElementById('myCanvas');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // dpr 适配，为了解决高清屏的尺寸模糊问题
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;

    /**
     * 原点设置为左下角
     * - canvas 默认是屏幕坐标系，也就是原点在左上角，右侧为 x 轴的正轴，下侧为 y 轴的正轴。
     * - 但为了使用笛卡尔坐标系更舒服，需要左下角为原点，右侧为 x 轴的正轴，上侧为 y 轴的正轴。
     * - 这实际就是镜像翻转。但同时镜像翻转会带来一个问题 —— 文字倒置，需要在对应地方进行特殊处理。
     */
    canvas.style.transform = 'scaleY(-1)';
    canvas.style.transform = `translate(${canvas.width})`;
  }

  draw() {
    /** 绘制 X 轴 */
    this.drawAxisX();
    /** 绘制 Y 轴 */
    this.drawAxisY();
    /** 绘制 X 比例尺 */
    this.drawScaleX();
    /** 绘制 Y 比例尺 */
    this.drawScaleY();
    /** 绘制网格线 */
    this.drawGrid();
    /** 绘制 k 线 */
    this.drawK();
    /** 绘制均线 */
    this.drawAveLine();
    /** 绘制辅助线 */
    this.drawHelpLine();
  }

  /**
   * 绘制 X 轴
   */
  drawAxisX() {
    const { lb, rb } = this.view;
    const { theme } = this.option;
    drawLine(this.ctx, lb.x, lb.y, rb.x, rb.y, theme.bgLineColor);
  }

  /**
   * 绘制 Y 轴
   */
  drawAxisY() {
    const { lb, lt, rb } = this.view;
    const { theme } = this.option;
    drawLine(this.ctx, lb.x, lb.y, lt.x, lt.y, theme.bgLineColor);
    drawLine(this.ctx, rb.x, lb.y, rb.x, lt.y, theme.bgLineColor);
  }

  /**
   * 绘制 X 比例尺
   */
  drawScaleX() {
    const { ctx } = this;
    const { xTicks, lb, filterTimes } = this.view;
    const { theme } = this.option;

    // 1.绘制刻度
    // xTick: x 轴的刻度 x 坐标值的集合
    xTicks.forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, lb.y);
      ctx.lineTo(x, lb.y - 10);
      ctx.stroke();
    });

    /**
     * 为了让翻转行为不影响之后的上下文绘制，
     * 所以在翻转之前先 ctx.save 保存状态到栈顶，
     * 然后在翻转之后 ctx.restore 恢复到存储在栈顶的状态
     */
    ctx.save();
    // 垂直翻转，解决文字倒置的问题
    ctx.scale(1, -1);
    // 2. 绘制标注
    xTicks.forEach((x, index) => {
      ctx.fillStyle = theme.textColor;
      // -(lb.y - 20) 对绘制文本的 view.lb.y 取反，解决文字倒置的问题
      ctx.fillText(filterTimes[index], x - 25, -(lb.y - 20));
    });
    ctx.restore();
  }

  /**
   * 绘制 Y 比例尺
   */
  drawScaleY() {
    const { ctx } = this;
    const { lb, height, yLabels } = this.view;
    const { theme } = this.option;

    const divide = height / (yLabels.length - 1);

    /**
     * 为了让翻转行为不影响之后的上下文绘制，
     * 所以在翻转之前先 ctx.save 保存状态到栈顶，
     * 然后在翻转之后 ctx.restore 恢复到存储在栈顶的状态
     */
    ctx.save();
    // 垂直翻转，解决文字倒置的问题
    ctx.scale(1, -1);
    // 绘制标注
    yLabels.forEach((val, index) => {
      ctx.fillStyle = theme.textColor;
      // -(lb.y + index * divide - 3) 对绘制文本的 view.lb.y 取反，解决文字倒置的问题
      ctx.fillText(val, 10, -(lb.y + index * divide - 3));
    });
    ctx.restore();
  }

  /**
   * 绘制网格线
   */
  drawGrid() {
    const { lb, rb, yLabels } = this.view;
    const { theme } = this.option;
    const divide = this.height / yLabels.length;
    yLabels.forEach((val, index) => {
      if (index) {
        const y = lb.y + index * divide;
        drawLine(this.ctx, lb.x, y, rb.x, y, theme.bgLineColor);
      }
    });
  }

  /**
   * 绘制辅助线
   */
  drawHelpLine() {
    const { ctx } = this;
    const { lb, lt, rt, rb, candleCenters, times } = this.view;
    const { pointer, inner } = this.event;
    const { theme, grid, xAxis } = this.option;
    const xCandles = candleCenters.map((item) => item.x);
    if (inner) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      const X = pointer.x + grid.left;
      const Y = pointer.y - grid.top;

      // 辅助线只会依附在最近的实体，所以需要临进计算
      const { id, x } = findClosestId(xCandles, X);
      this.event.activeId = id;
      // 计算实际源数据
      this.event.activeOriginData = {
        y: this.view.kList[id],
        x: times[id],
      };
      // 计算展示 label 数据
      const labelY = this.pos_toY(Y - grid.bottom - xAxis.offset).toFixed(1);
      // 绘制垂线
      drawLine(this.ctx, x, lb.y, x, lt.y, theme.helpColor);
      // 绘制水平线
      drawLine(this.ctx, lb.x, Y, rt.x, Y, theme.helpColor);
      ctx.restore();
      // 绘制数据label
      ctx.fillStyle = theme.textColor;
      // 文本设置的尺寸一半
      const helpLabelFontSizeHalf = theme.helpLabelFontSize * 0.5;
      const yLabelWidth = labelY.length * 5.3;
      const xLabelWidth = times[id].length * 5.3;

      // 绘制Y轴label
      ctx.fillRect(
        rb.x + helpLabelFontSizeHalf,
        Y - theme.helpLabelFontSize,
        yLabelWidth,
        20
      );
      drawText(
        ctx,
        labelY,
        rb.x + helpLabelFontSizeHalf,
        Y - helpLabelFontSizeHalf + 2,
        { color: theme.bgLineColor, fontSize: theme.helpLabelFontSize }
      );

      // 绘制X轴label
      ctx.fillRect(x - xLabelWidth * 0.5, lb.y - 26, xLabelWidth, 20);
      drawText(ctx, times[id], x - xLabelWidth * 0.5, lb.y - 20, {
        color: theme.bgLineColor,
        fontSize: theme.helpLabelFontSize,
      });
    }
  }

  /**
   * 绘制 k 线
   */
  drawK() {
    let candleCenters = [];
    this.view.kList.forEach((item, index) => {
      const { center } = this.drawCandle(item, this.view.times[index]);
      // 收集蜡烛实体的中心坐标，方便辅助线的绘制
      candleCenters.push(center);
    });
    this.view.candleCenters = candleCenters;
  }

  /**
   * 绘制均线
   */
  drawAveLine() {
    this.view.series.forEach((item) => {
      drawCurve(this.ctx, item.lines, item.lineStyle.color, 1);
    });
  }

  onMouseMove(e) {
    const { grid } = this.option;
    const { clientX, clientY } = e;
    const pos = this.canvas.getBoundingClientRect();
    const leftInner = clientX - pos.left - grid.left;
    const topInner = clientY - pos.top - grid.top;

    if (
      leftInner >= 0 &&
      leftInner <= this.view.width &&
      topInner >= 0 &&
      topInner <= this.view.height
    ) {
      this.event.pointer.x = leftInner;
      this.event.pointer.y = this.height - topInner;
      this.event.inner = true;
    } else {
      this.event.inner = false;
      console.log('超出区域');
    }
  }

  onMouseDown(e) {
    this.event.downPointer.x = e.clientX;
    this.event.downPointer.y = e.clientY;
  }

  onMouseup(e) {
    this.event.upPointer.x = e.clientX;
    this.event.upPointer.y = e.clientY;
    const { upPointer, downPointer } = this.event;
    if (Math.abs(upPointer.x - downPointer.x) > this.view.solidWidth) {
      if (upPointer.x < downPointer.x) {
        console.log('向左滑');
        this.view.start -= 1;
        this.view.end -= 1;
      } else {
        console.log('向右滑');
        this.view.start += 1;
        this.view.end += 1;
      }
    }
  }

  onWheel(e) {
    // 获取滚轮滚动的方向，使用 Math.sign() 函数可以将滚轮滚动的垂直方向速度转换为一个正负值，正值表示向上滚动（放大），负值表示向下滚动（缩小）
    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
      console.log('放大数据');
      this.view.start = Math.max(this.view.start - 1, 0);
      this.view.end = Math.min(this.view.end + 1, 100);
    } else if (delta < 0) {
      console.log('缩小数据');
      if (this.view.start + 2 < this.view.end) {
        this.view.start += 1;
        this.view.end -= 1;
      }
    }
  }

  watchEvent() {
    this.firstInto = false;
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseup.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
  }

  removeEvent() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mousedown', this.onMouseDown.bind(this));
    window.removeEventListener('mouseup', this.onMouseup.bind(this));
    window.removeEventListener('wheel', this.onWheel.bind(this));
  }

  /**
   * 限制 option 数据
   * - 将 data 数据做分割，方便滚动事件做缩放数据范围的处理
   */
  limitArea() {
    const { start, end } = this.view;
    const start_id = Math.floor((start * this.kLen) / 100);
    const end_id = Math.floor((end * this.kLen) / 100);
    this.view.times = this.times.slice(start_id, end_id + 1);
    this.view.kList = this.kList.slice(start_id, end_id + 1);
    this.view.kLen = this.view.kList.length;

    this.view.series = this.series.map((item) => {
      return { ...item, data: item.data.slice(start_id, end_id + 1) };
    });
  }

  calcView() {
    const { grid, xAxis } = this.option;
    const { width, height } = this;
    const distance = 20;
    const step = 5;
    let max_value = 0,
      min_value = Infinity;

    // 计算视口坐标
    this.view.lb = { x: grid.left, y: grid.bottom + xAxis.offset };
    this.view.rt = { x: width - grid.right, y: height - grid.top };
    this.view.rb = { x: width - grid.right, y: grid.bottom + xAxis.offset };
    this.view.lt = { x: grid.left, y: height - grid.top };

    this.view.width = this.view.rb.x - this.view.lb.x;
    this.view.height = this.view.rt.y - this.view.rb.y;

    // 计算 y 轴的范围值，之所以是范围值，是因为在 Y 轴的值是随时变化的，需要缩放值映射到 0 到 100 的范围
    this.view.kList.forEach((item) => {
      max_value = Math.max(max_value, ...item);
      min_value = Math.min(min_value, ...item);
    });
    this.view.yMaxSafeVal = max_value;
    this.view.yMinSafeVal = min_value;
    const min_integer = Math.floor(min_value - (min_value % 10));
    const max_integer = Math.floor(max_value + (10 - (max_value % 10)));
    this.view.yMinVal = min_integer - distance;
    this.view.yMaxVal = max_integer + distance;
    this.view.yAreaVal = this.view.yMaxVal - this.view.yMinVal;
    const size = Math.floor(this.view.yAreaVal / step);

    // 计算 y 的 label 集合
    let yLabels = [this.view.yMinVal];
    let curY = this.view.yMinVal;
    for (let i = 0; i < step; i++) {
      curY = curY + size;
      yLabels.push(curY);
    }
    this.view.yLabels = yLabels;
    this.view.yLabelDiff = yLabels.at(-1) - yLabels[0];

    // 计算实体宽度
    this.view.solidWidth = +(this.view.width / (this.view.kLen * 2)).toFixed(2);

    // 计算 x 轴刻度坐标
    let xTicks = [];
    let filterTimes = this.view.times;

    const xDivide = this.view.width / (this.view.times.length - 1);
    this.view.times.forEach((item, index) => {
      xTicks.push(+(index * xDivide + this.view.lb.x).toFixed(2));
    });
    this.view.xTicksSum = xTicks;

    // 兼容 x 轴挤占问题
    const calcXTicks = (xTicks) => {
      let ticksLen = xTicks.length;
      const textWidth = 50;
      let textDistance =
        (this.view.width - textWidth * ticksLen - textWidth) / (ticksLen - 1);
      if (textDistance < 2) {
        xTicks = removeOddIndexItems(xTicks);
        return calcXTicks(xTicks);
      } else {
        return xTicks;
      }
    };
    xTicks = calcXTicks(xTicks);
    filterTimes = calcXTicks(filterTimes);

    this.view.xTicks = xTicks;
    this.view.filterTimes = filterTimes;

    // 转换折线
    // ['-', '-', 11, 22, 33] -> [[x1, y1], [x2, y2], [x3, y3]]
    this.view.series.forEach((item) => {
      let lines = [];
      const data = item.data;
      data.forEach((x, j) => {
        const val = data[j];
        if (val !== '-') {
          lines.push([this.view.xTicksSum[j], this.y_toPos(val)]);
        }
      });
      item.lines = lines;
    });
  }

  /**
   * y 数值转为 y 轴坐标
   */
  y_toPos(val) {
    const { height, yAreaVal, yMinSafeVal, yMaxSafeVal, yMinVal, yMaxVal, lb } =
      this.view;
    const safeBottomH = ((yMinSafeVal - yMinVal) / yAreaVal) * height;
    const safeTopH = ((yMaxVal - yMaxSafeVal) / yAreaVal) * height;
    const valH =
      ((val - yMinSafeVal) / (yMaxSafeVal - yMinSafeVal)) *
      (height - safeBottomH - safeTopH);
    return +(lb.y + safeBottomH + valH).toFixed(2);
  }

  /**
   * y 轴坐标转为 y 数值
   */
  pos_toY(val) {
    // 根据视口比例换算到实际数值
    const { yLabelDiff, yLabels } = this.view;
    return (val / this.view.height) * yLabelDiff + yLabels[0];
  }

  /**
   * x 数值转为x轴坐标
   */
  x_toPos(name) {
    let { times, width, kLen, lb } = this.view;
    const idx = times.findIndex((item) => item === name);
    const x_divide = width / (kLen - 1);
    return +(lb.x + x_divide * idx).toFixed(2);
  }

  /**
   * 绘制蜡烛
   */
  drawCandle(item, name) {
    const { ctx } = this;
    const { theme } = this.option;

    // 缩放后的 实心底部，实心顶部，lowest，highest 的 y 值
    const solidBottom = Math.min(this.y_toPos(item[0]), this.y_toPos(item[1]));
    const solidTop = Math.max(this.y_toPos(item[0]), this.y_toPos(item[1]));
    const lowest = this.y_toPos(item[2]);
    const highest = this.y_toPos(item[3]);
    const h = Math.abs(solidTop - solidBottom);
    const w = this.view.solidWidth;
    const half_w = w * 0.5;
    const half_h = h * 0.5;

    const isUp = item[1] > item[0];
    const color = isUp ? theme.upColor : theme.downColor;

    // 实心区域中心点
    const center = {
      x: this.x_toPos(name),
      y: solidBottom + half_h,
    };
    // 绘制蜡烛图的上下影线
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(center.x, highest);
    ctx.lineTo(center.x, lowest);
    ctx.stroke();
    // 绘制蜡烛图的实体部分
    ctx.fillStyle = color;
    ctx.fillRect(center.x - half_w, center.y - half_h, w, h);

    return { center };
  }

  requestAnimation() {
    const _self = this;
    const { ctx, firstInto, canvas } = this;
    const { theme } = this.option;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.bgColor;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 限制 option 数据
    this.limitArea();

    // 计算视口数据
    this.calcView();

    // 执行一次监听事件
    if (firstInto) this.watchEvent();

    // 绘制
    this.draw();
    requestAnimationFrame(this.requestAnimation.bind(_self));
  }

  render() {
    this.requestAnimation();
  }
}
