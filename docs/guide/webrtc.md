# WebRTC
## 源码目录结构

|         api         |        WebRTC接口层, 浏览器都是通过该接口调用WebRTC        |
| :-----------------: | :--------------------------------------------------------: |
|      **call**       | **数据流的管理层, Call代表同一个端点的所有数据的流入流出** |
|      **video**      |                    **与视频相关的逻辑**                    |
|      **audio**      |                    **与音频想关的逻辑**                    |
|  **common_audio**   |                      **音频算法相关**                      |
|  **common_video**   |                      **视频算法相关**                      |
|      **media**      |       **与多媒体相关的逻辑处理, 如编解码的逻辑处理**       |
|     **logging**     |                        **日志相关**                        |
|     **module**      |                  **最重要的目录, 子模块**                  |
|       **pc**        |           **Peer Connection, 连接相关的逻辑层**            |
|       **p2p**       |               **端对端相关代码, stun, turn**               |
|    **rtc_base**     |         **基础代码, 如线程, 锁相关的统一接口代码**         |
|    **rtc_tool**     |                **音视频分析相关的工具代码**                |
|   **tool_webrtc**   |         **WebRTC测试相关的工具代码, 如网络模拟器**         |
| **system_wrappers** |    **与具体操作系统相关的代码, 如CPU特性, 原子操作等**     |
|      **stats**      |                **存放各种数据统计相关的类**                |
|       **sdk**       |      **存放Android和IOS层代码, 如视频的采集, 渲染等**      |

Modules目录

|         audio_coding         |       音频编解码相关代码       |
| :--------------------------: | :----------------------------: |
|       **audio_device**       | **音频采集与音频播放相关代码** |
|       **audio_mixer**        |        **混音相关代码**        |
|     **audio_processing**     |   **音频前后处理的相关代码**   |
|    **bitrate_controller**    |      **码率控制相关代码**      |
|  **congestion_controller**   |        **流控相关代码**        |
|     **desktop_capture**      |      **桌面采集相关代码**      |
|          **pacing**          | **码率探测及平滑处理相关代码** |
| **remote_bitrate_estimator** |   **远端码率估算相关的代码**   |
|         **rtp_rtcp**         |   **rtp/rtcp协议相关的代码**   |
|      **video_capture**       |     **视频采集相关的代码**     |
|       **video_coding**       |    **视频编解码相关的代码**    |
|     **video_processing**     |   **视频前后处理相关的代码**   |



## 运行机制

轨与流:

Track ( 轨 )

MediaStream ( 媒体流 )

重要类:

MediaStream

RTCPeerConnection

RTCDataChannel

## enumerateDevices

~~~js
let ePromise = navigator.mediaDevices.enumerateDevices()
~~~

MediaDevicesInfo

| 属性     | 说明                                      |
| -------- | ----------------------------------------- |
| deviceID | 设备ID                                    |
| label    | 设备的名称                                |
| kind     | 设备的种类                                |
| groupID  | 两个设备groupID相同, 说明是同一个物理设备 |