# 交付验收记录

环境：Windows / Blender 4.2.23 LTS + Python 3.11.7 / Node 24.19.0（系统默认16由启动器适配）/ Microsoft Edge。开发2026-09-11，最终复核2026-09-12。最终生产预览测试7/7通过。

|项目|状态|证据|
|---|---|---|
|Vue3 / TS / Vite / Three / GSAP|通过|package.json、构建结果|
|实际 Blender Python 参数化建模|通过|开发日志 Phase3—8、blender/en182-5mw.blend|
|130 m 高度 / 181.1 m 转子 / 120° 三叶片|通过|public/models/model_validation_report.json geometry_facts|
|140 m 配置生成|通过|docs/height-140-check.json；隔离测试输出，没有替换130m主模型|
|近似翼型 / 轮毂 / 机舱 / 塔筒 / 基础|通过|参数文件及 Blender 源码|
|主轴 / 轴承 / 两行星一级斜齿 / DFIG / 制动 / 柜体|通过|GLB命名检查、内部视图与齿轮箱截图|
|Detail 检修附件层级|通过|Bolts / Flanges / Platforms / Ladders / Handrails|
|GLB 三 LOD / Draco / 实例化|通过|docs/model-check.json；本地解码器；ModelLoader|
|部件树 / 点击 / 高亮 / 聚焦 / 隐藏 / 单独查看|通过|浏览器测试 Phase10 与射线点击用例|
|2秒拆解 / 暂停 / 继续 / 精确复位|通过|浏览器测试 Phase11，逐组件坐标比较|
|透视 / Fresnel X-Ray / X-Y-Z 剖切|通过|浏览器测试 Phase12—14，无 shader 编译错误|
|叶轮播放 / 暂停 / 停止 / 倍率 / 自动环绕|通过|浏览器交互测试|
|加载进度 / 错误 / 重试|通过|模拟网络故障后恢复用例|
|桌面 / 移动适配 / 减少动态效果|通过|1600×1000 / 390×844 截图与对应交互测试|
|4K大屏视口|通过|3840×2160 无溢出、无资源错误；预热后实测60FPS；large-screen-check.json|
|npm install / dev / build / preview|通过|实际执行；生产 preview 的完整测试|
|无 TypeError / ReferenceError / WebGL error / 404|正常流程通过|浏览器收集 pageerror、console error、HTTP>=400；故障注入用例有预期错误|
|研究 / 模型 / Web / 映射 / 限制 / 开发文档|已交付|docs 与 README|
|无 Logo / 无水印|通过|无外部品牌贴图；GLB images为空；无品牌几何或文字对象|

性能实测见 performance.json。30/60 FPS 目标只能在具体设备测量，不作为所有 GPU 的保证。叶片完整翼型、原厂完整内部 CAD、精确齿廓和工程载荷验证不在本次公开资料可支持的范围。剖切没有实体截面封帽。以上明确限制见 known-limitations.md。

测试中修复了：GSAP 浮点舍入导致的拆装位置残差、减少动态效果时零时长 timeline 的回调边界、长塔段端面法线、金属过曝、窄屏包围球取景过远、后处理性能计数只统计最后一遍，以及重新加载后的交互状态恢复。
