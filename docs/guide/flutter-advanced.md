# Flutter进阶

## 布局探索

### 1. 紧约束
`紧约束` 一词来自于 `BoxConstraints` 类中的 `tight` 构造。通过 `BoxConstraints` 约束可以设置宽高的取值区间。如下所示，在 `tight` 构造中，最小和最大宽都是 `size.width` ，最小和最大高都是 `size.height` 。这就说明在该约束下，被约束者的 `尺寸` 只有一种取值可能。
~~~dart
---->[BoxConstraints]----
/// Creates box constraints that is respected only by the given size.
BoxConstraints.tight(Size size)
  : minWidth = size.width,
    maxWidth = size.width,
    minHeight = size.height,
    maxHeight = size.height;
~~~
看一个最简单的紧约束：如下，通过 `ColoredBox` 组件为这个默认区域进行着色：
~~~dart
void main() {
  runApp(const ColoredBox(color: Colors.blue));
}
~~~
在 `runApp` 方法中，展示的 `ColoredBox` 组件尺寸是 屏幕尺寸

从布局信息树中也可以看出： 此时 `ColoredBox` 对应的渲染对象尺寸是 `360*800` ，也就是屏幕尺寸。

通过 `SizedBox` 为 `ColoredBox` 指定 `100*100` 的尺寸会有什么效果：
~~~dart
void main() {
    runApp(
        const SizedBox(
            width: 100,
            height: 100,
            child: ColoredBox(color: Colors.blue),
        ),
    );
}
~~~
在父级是紧约束的条件下，`SizedBox` 无法对子级的尺寸进行修改。

虽然 `SizedBox` 为子级施加了一个额外的 `BoxConstraints(w=100,h=100)` 紧约束，但 `ColoredBox` 的约束仍为 `BoxConstraints(w=360,h=800)` 。


#### 如何打破紧约束
**1. 解除约束：UnconstrainedBox**
~~~dart
void main() {
    runApp(
        const UnconstrainedBox(
            child: ColoredBox(color: Colors.blue),
        ),
    );
}
~~~
因为 `ColoredBox` 的尺寸没有限制，后面通过源码可以知道 `ColoredBox` 的尺寸特点是取约束的最小值，所以这里尺寸就是 `Size(0,0)` 。

布局信息树所示：`ColoredBox` 变成了无约束 `unconstrained`，尺寸是 `Size(0,0)` ，所以屏幕上一片黑。另外注意一点： `UnconstrainedBox` 本身受到父级强约束限制，尺寸是 `Size(360,800)` 。

**2. 通过布局组件放松约束**
~~~dart
void main() {
    runApp(
        const Align(
            alignment: Alignment.topLeft,
            child: ColoredBox(color: Colors.blue),
        ),
    );
}
~~~
布局信息树所示：通过 `Align` 的参与，`ColoredBox` 的父级约束发生了变化，由原来的紧约束，变成了 `BoxConstraints(0.0<=w<=360.0,0.0<=h<=800.0)` 的宽松约束。所以 `ColoredBox` 它的尺寸仍为 `Size(0,0)` 。

除了 `Align` 组件有放宽约束的能力之外，还有如 `Flex`、`Column`、`Row`、`Wrap`、`Stack` 等组件可以让父级的紧约束在一定程度上变得宽松，至于它们具体会提供什么样的宽松约束，在后面涉及到时会进行详述。

**3. 自定义布局重新设置约束**

前面的两种方式是在原紧约束下，`解除` 或 `放松` 约束。有没有一种方式，可以让我们自由地改变子级的约束，改成什么约束就是什么约束？可以通过 `CustomSingleChildLayout` 组件进行实现。如下，自定义 `DiyLayoutDelegate` ，通过覆写 `getConstraintsForChild` 方法可以随意修改子级的约束。
~~~dart
void main() {
    runApp(
        CustomSingleChildLayout(
            delegate: DiyLayoutDelegate(),
            child: const ColoredBox(color: Colors.blue),
        ),
    );
}

class DiyLayoutDelegate extends SingleChildLayoutDelegate {
  
    @override
    bool shouldRelayout(covariant SingleChildLayoutDelegate oldDelegate) => false;

    @override
    BoxConstraints getConstraintsForChild(BoxConstraints constraints) {
        return BoxConstraints.tight(const Size(100, 100));// tag1
    }
}
~~~
布局信息树所示：`CustomSingleChildLayout` 组件施加的 `BoxConstraints(w=100,h=100)` 紧约束会直接作用于`ColoredBox` ，导致其尺寸限制为 `Size(100,100)`。

可以看出通过 `CustomSingleChildLayout` 设置的约束，是原封不动施加到子级身上的。这个组件是对单个孩子的，另外还有对于多个子组件自定义布局的 `CustomMultiChildLayout` 也有施加新约束的能力，这个在后面自定义布局会进行详细介绍。

**4. 小结**

一个组件想要打破原有 `紧约束` 的方式有：
~~~dart
[1] 通过 UnconstrainedBox [解除约束]，让自身约束变为 [无约束]。
[2] 通过 Align、Flex、Stack 等组件 [放松约束]，让自身约束变为 [松约束]。
[3] 通过 CustomSingleChildLayout 等自定义布局组件施加 [新约束]。
~~~

#### 盒约束的传递性
约束是父级渲染对象对子级渲染对象的尺寸限制。在子渲染对象布局时，父渲染对象会向子级传入约束信息。比如下图，`root` 节点会将 `BoxConstraints(w=360,h=800)` 约束传递给 `ColoredBox` 对应的渲染对象。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Flutter/2411545729.png)

如果在 `root` 和 `ColoredBox` 之间，添加一个 `Align` 节点，那么 `root` 节点会将约束传递给 `Align` 对应的渲染对象。 `Align` 对应的渲染对象会基于这个约束，向子级 `ColoredBox` 传递一个宽松的约束，这就是 `Align` 组件自身的布局特点。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Flutter/2480076856.png)

这样，对于 `ColoredBox` 而言，通过一个中间者，就可以很容易地实现自身约束的改变。

同理，如果在 `ColoredBox` 和 `Align` 之间添加 `SizedBox` 组件，这时 `Align` 对应的渲染对象会将约束传递给 `SizedBox` 对应的渲染对象。 接下来 `SizedBox` 对应的渲染对象会基于接收到的约束，生成一个新的紧约束传递给 `ColoredBox` 对应的渲染对象。 这就是 `SizedBox` 组件自身的布局特点。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Flutter/959204337.png)

所以盒约束会随着渲染树自上而下进行传递，每个渲染节点都会根据自身的布局特点，对接收到的约束进行处理，然后继续向下传递。这就是 `Flutter` 布局体系构成的要素之一：**盒约束传递链**。

### 2. 常用组件的约束

#### 如何查看组件的受到的盒约束

**1. 通过 Flutter Inspector 面板**

通过布局信息树，我们在组件的 `renderObject` 中可以看到渲染对象受到的盒约束。在日常开发中，遇到布局问题时，可以通过这个面板进行调试，更容易找到问题所在。

**2. 通过 LayoutBuilder 组件**

在代码中可以通过 `LayoutBuilder` 组件来获取父级渲染对象施加的约束。`LayoutBuilder` 组件提供一个 `builder` 回调方法来构建子组件，其中可以获取 `BoxConstraints` 对象，使用如下：
~~~dart
void main() {
  runApp(
    const LayoutBuilder(builder: _buildByLayout),
  );
}

Widget _buildByLayout(BuildContext context, BoxConstraints constraints) {
  print(constraints);
  return // 构建子级组件
}

---->[打印日志]----
BoxConstraints(w=360.0, h=800.0)
~~~

#### MaterialApp 与 Scaffold 下的盒约束
**1. MaterialApp 组件下约束信息**

`MaterialApp` 作为开发中必备的组件 ，其本身是 `StatefulWidget` ，所以它的本质是若干组件的集合体。其中集成了非常多的组件，来实现应用的基础需求，主要包括：

- 【1】 ：集成 `AnimatedTheme`、`Theme`、`Localizations` 组件处理应用主题和语言。

- 【2】 ：集成 `ScrollConfiguration`、`Directionality`、`PageStorage`、`PrimaryScrollController`、`MediaQuery` 等 `InheritedWidget` 组件为子级节点提供全局信息。

- 【3】 ：集成 `Navigator` 与 `Router` 组件处理路由跳转。

- 【4】 ：集成 `WidgetInspector`、`PerformanceOverlay` 等调试信息组件。

- 【5】 ：集成 `Shortcuts` 与 `Actions` 等组件处理桌面端快捷键。












