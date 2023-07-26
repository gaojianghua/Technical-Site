# Photoshop

## MAC 版安装 & 汉化
[下载资源包](https://pan.baidu.com/s/14QJNp_8uXIjbYKbP1xq8xw?pwd=7w2q)

1. 双击 `Creative_Cloud_Installer.dmg` 进行安装。
2. 双击 `Adobe Photoshop 2023 v24.2 [HCiSO].dmg` 打开，将里面的 `installer` `patch` 文件都拖到桌面上。
3. 打开终端，输入 `sudo xattr -r -d com.apple.quarantine`，然后将桌面的 `installer` 文件拖入终端中并按回车执行命令。
4. 继续在终端中输入 `sudo xattr -r -d com.apple.quarantine`，然后将桌面的 `patch` 文件拖入终端中并按回车执行命令。
5. 打开桌面的 `installer` 文件，点击里面的 install 进行安装。
6. 打开桌面的 `patch` 文件，双击里面的 pkg 文件进行安装。
7. 打开文件 `/Applications/Adobe Photoshop 2023/Locales` 将 `zh_CN` 汉化包解压后放进去，然后重启 PS。
8. 在 PS 中找到 首选项-界面-文本，然后点击用户界面语言选择简体中文，点击确定后重启。