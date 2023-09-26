# 服务端工具库收集

## 压测工具: [Vegeta](https://github.com/tsenart/vegeta)

### 一、特点
- 命令行和Go第三方库都可以使用
- 命令行使用UNIX风格设计
- 可扩展多种压测报告形式
- 对于分布式测试也非常简单易用
- 易安装、易使用
### 二、安装
#### 2.1 MacOS下安装
`macos`下使用`brew`即可安装，如下：
~~~shell
brew update && brew install vegeta
~~~
#### 2.2 Arch Linux下安装
~~~shell
pacman -S vegeta
~~~
#### 2.3 FreeBSD下安装
~~~shell
pkg install vegeta
~~~
#### 2.4 自行编译
~~~shell
git clone https://github.com/tsenart/vegeta
cd vegeta
make vegeta
mv vegeta ~/bin # Or elsewhere, up to you.
~~~
### 三、使用教程
`vegeta`工具主要有4个子命令组成，分别是`attack`、`encode`、`report`、`plot`。
- `attack子命令`：该子命令主要设置和要压测的接口请求有关。比如要压测的接口地址、接口的`body`参数、接口的`header`头、并发的请求数量、压测的时间、压测的速率等等。
- `encode子命令`：该子命令主要是指定压测结果输出的位置以及输出的格式。比如以`csv`格式输出还是以`json`格式输出，输出到哪个文件。
- `report子命令`：该子命令主要是针对压测结果生成统计报告。
- `plot子命令`： 该子命令的功能主要是将测试结果以图表的形式进行展示。

#### 3.1 指定压测的接口地址
在指定压测地址时有两种方式：通过标准的`stdin`(标准输入)和指定具体的文件。

通过`stdin`(标准输入)指定压测地址
~~~shell
echo "GET https://www.baidu.com" | vegeta attack -duration=5s
~~~
如上所示，通过管道的方式将要压测的接口地址输出给`vegeta`的`attack`命令。这里需要注意，在指定压测接口时，一定要指定请求的方法，同时请求方法必须都是大写。例如`GET`、`POST`。而`Get`或`Post`则是无效的方法。
- 通过`targets`参数指定文件

通过文件可以指定一个或多个要压测的`url`地址。指定格式如下：
~~~shell
GET https://foo.bar/a/b/c
Header-X: 123
Header-Y: 321

POST https://foo.bar/b/c/a
Header-X: 123
@/path/to/body/file
~~~
在文件中，通过空行来区分两个`url`的部分。每个`url`部分以方法名和`url`地址开头，后续可以跟着对应的`Header`头信息。在`POST`请求中，可以通过`@`指定具体的`body`体内容的文件。

#### 3.2 指定body体内容
要指定`body`体，只能通过文件的方式来指定。`vegeta attack`有两种方式来指定`body`的文件名。第一种是刚才上面提到，在`targets`的文件中，可以通过`“@”`符号来指定对应的`body`体。第二种是通过命令行参数`-body`指定一个文件名：
~~~shell
vegeta attack -body
~~~

#### 3.3 指定接口返回内容为止
通过`vegeta encode`子命令来指定接口自身输出的内容（即接口的响应值）被保存的位置以及输出内容的格式（`csv`、`json`等） 这里主要有两个参数项：
- `-output string`：指定接口响应被存储的位置
- `-to string`：指定内容输出的格式。例如`csv`、`json`、`gob`。默认为`json`。
  
#### 3.4 生成测试报告
`vegeta` 的测试报告是通过 `report` 子命令来生成的。该命令的输入数据是 `encode` 子命令产生的输出。如下示例所示：
~~~shell
sh-3.2# echo "GET https://www.baidu.com" | vegeta attack -duration=5s | vegeta report
Requests      [total, rate, throughput]         250, 50.21, 49.11
Duration      [total, attack, wait]             5.09s, 4.979s, 111.653ms
Latencies     [min, mean, 50, 90, 95, 99, max]  18.132ms, 32.41ms, 21.998ms, 55.54ms, 106.41ms, 171.889ms, 276.545ms
Bytes In      [total, mean]                     56750, 227.00
Bytes Out     [total, mean]                     0, 0.00
Success       [ratio]                           100.00%
Status Codes  [code:count]                      200:250 
~~~
可以看到，在报表中输出的信息有：
- 请求相关的统计：请求总数、速率以及吞吐量。
- 持续时间：压测的总时长、实际发送请求的时长以及等待的时间。
- 响应延迟：最小、最大延迟。50分位、90分位、95分位响应延迟。
- 输入、输出的字节
- 响应成功率。
- 状态码统计。
  
通过 `-type` 参数可以按响应时间区间统计，如下：
~~~shell
sh-3.2# echo "GET https://www.baidu.com" | vegeta attack -duration=5s | vegeta report -type="hist[0,100ms,200ms,300ms]"
Bucket           #    %       Histogram
[0s,     100ms]  247  98.80%  ##########################################################################
[100ms,  200ms]  3    1.20%   
[200ms,  300ms]  0    0.00%   
[300ms,  +Inf]   0    0.00% 
~~~
按不同的响应时间的区间统计响应的结果量。

### 四、总结
`vegeta`是一个命令行的工具。一个压测工具最基本的功能就是输入`url`及参数、启动指定量的协程来进行压力测试，同时把响应结果保存下来，并以报表的形式进行统计输出。同时，该开源包也是大家学习使用`golang`进行命令行开发较好的参考。建议有兴趣的朋友可以阅读下源码。

## 视觉库: [OpenCV](https://opencv.org)

### 一、特点
`OpenCV` 提供了丰富的图像处理和计算机视觉算法，包括但不限于以下功能：
- 图像读取和显示：可以读取和显示多种图像格式，如JPEG、PNG等。
- 图像处理：包括图像滤波、边缘检测、图像变换等操作。
- 特征检测和描述：提供了各种特征点检测算法，如SIFT、SURF、ORB等，并支持生成特征描述符。
- 目标检测和跟踪：包括人脸检测、物体检测、运动目标跟踪等。
- 机器学习：集成了机器学习算法，包括分类、聚类、回归等。
- 视频处理：支持视频文件读取、视频流处理、视频帧抽取等。
- 相机标定和立体视觉：提供了相机标定和立体视觉算法，用于计算深度和三维重建等应用。

使用 `OpenCV`，您可以利用其丰富的功能和算法进行图像处理、计算机视觉和计算机图形学等方面的开发。它在计算机视觉领域得到广泛应用，包括目标检测、人脸识别、图像处理、机器人视觉等领域。

### 二、安装
在 `Mac` 上安装 `OpenCV` 可以使用 `Homebrew` 进行快速安装，同时还需要手动下载 `OpenCV` 的 `XML` 分类器文件。我们可以通过设置环境变量 `PKG_CONFIG_PATH` 来配置 `OpenCV` 的环境。

安装`OpenCV`:
~~~shell
brew install opencv
~~~
配置`PKG_CONFIG_PATH`环境变量:
~~~shell
export PKG_CONFIG_PATH="/usr/local/opt/opencv@4/lib/pkgconfig:$PKG_CONFIG_PATH"
~~~
验证安装:
~~~shell
pkg-config --cflags --libs opencv4
~~~

### 使用Go进行人脸识别
1. 安装 `Go` 的 `OpenCV` 绑定库：
    ~~~shell
    go get -u gocv.io/x/gocv
    ~~~
2. [下载 haarcascade_frontalface_default.xml 文件](https://github.com/opencv/opencv/blob/4.x/data/haarcascades/haarcascade_frontalface_default.xml)

3. 项目目录
    ~~~shell
    .
    ├── go.mod
    ├── go.sum
    ├── haarcascade_frontalface_default.xml
    └── main.go
    ~~~
4. 完整代码如下
    ~~~go
    package main

    import (
        "fmt"
        "gocv.io/x/gocv"
        "image/color"
    )

    func main() {
        // 步骤1：打开摄像头设备
        webcam, err := gocv.VideoCaptureDevice(0)
        if err != nil {
            fmt.Println("打开摄像头设备失败:", err)
            return
        }
        defer webcam.Close()

        // 步骤2：加载人脸识别分类器
        classifier := gocv.NewCascadeClassifier()
        defer classifier.Close()

        if !classifier.Load("haarcascade_frontalface_default.xml") {
            fmt.Println("加载分类器文件失败")
            return
        }

        // 步骤3：创建一个窗口用于显示图像
        window := gocv.NewWindow("Face Detection")
        defer window.Close()

        img := gocv.NewMat()
        defer img.Close()

        for {
            // 步骤4：从摄像头读取图像帧
            if ok := webcam.Read(&img); !ok || img.Empty() {
                fmt.Println("无法从摄像头读取图像帧")
                break
            }

            // 步骤5：将图像转换为灰度图像，因为人脸识别通常在灰度图像上进行
            gray := gocv.NewMat()
            defer gray.Close()

            gocv.CvtColor(img, &gray, gocv.ColorBGRToGray)

            // 步骤6：检测人脸
            rects := classifier.DetectMultiScale(gray)
            fmt.Printf("检测到 %d 个人脸\n", len(rects))

            // 步骤7：在图像上绘制人脸边界框
            for _, r := range rects {
                gocv.Rectangle(&img, r, color.RGBA{0, 255, 0, 0}, 2)
            }

            // 步骤8：显示图像
            window.IMShow(img)

            // 步骤9：等待用户按下ESC键退出
            if window.WaitKey(1) == 27 {
                break
            }
        }
    }
    ~~~
5. 步骤说明
   1. 我们使用 `gocv.VideoCaptureDevice` 函数打开摄像头设备，`0` 表示使用默认的摄像头。
   2. 我们使用 `gocv.NewCascadeClassifier` 函数创建一个人脸识别分类器，并使用 `classifier.Load` 方法加载  `haarcascade_frontalface_default.xml` 分类器文件。
   3. 我们使用 `gocv.NewWindow` 函数创建一个名为 `"Face Detection"` 的窗口，用于显示图像。
   4. 我们使用 `webcam.Read` 方法从摄像头读取图像帧，并检查是否成功读取图像。
   5. 我们使用 `gocv.CvtColor` 函数将图像转换为灰度图像，因为人脸识别通常在灰度图像上进行。
   6. 我们使用 `classifier.DetectMultiScale` 方法检测人脸，并得到人脸在图像中的矩形区域。
   7. 我们使用 `gocv.Rectangle` 函数在图像上绘制人脸边界框，以便标记出人脸位置。
   8. 我们使用 `window.IMShow` 方法将标记后的图像显示在窗口中。
   9. 我们使用 `window.WaitKey` 方法等待用户按下 `ESC` 键，如果按下 `ESC` 键则退出程序。

















