# Web 实现说明

Vue3 + TypeScript + Vite，Three.js r170，GSAP3。App 维护选择、可见性反馈、模式、拆解层级、叶轮状态、LOD；TurbineViewer 在 mounted 建立场景，在 beforeUnmount 释放 requestAnimationFrame、OrbitControls、GSAP 时间线、几何、材质、PMREM、后处理、事件、ResizeObserver 和 Draco worker。异步模型晚于组件卸载到达时直接回收。

|模块|职责|
|---|---|
|SceneManager|WebGLRenderer、灯光、PMREM、低调地面网格、EffectComposer、OutlinePass、OutputPass；无 Bloom/实时阴影|
|CameraManager|依据包围球与水平/垂直视场较小值自动取景；GSAP 1.2 秒相机过渡|
|ModelLoader|GLTFLoader / GLB 与 glTF 格式解析，Draco/Meshopt，进度/异常处理与螺栓实例化|
|ModelHierarchy|语义索引、父链选择、隐藏与隔离逻辑|
|SelectionManager|Raycaster，拖动距离阈值、透明壳穿透、可见性和裁切检查|
|HighlightManager|OutlinePass 选中边缘|
|TransparencyManager|保存原材质、仅修改克隆；非选中降亮、外壳透明、Fresnel、局部裁切|
|ExplodedView|2 秒分层 timeline、暂停、继续、精确复位|
|SectionPlane|Three +X/+Y/+Z 三轴裁切；范围按选中组件包围盒计算|
|AnimationManager|Rotor 局部 X 轴转动，默认停止，倍率默认 0.5×；停止复原 quaternion|

正常模式采用 PBR。透视模式壳体 opacity=0.23、depthWrite=false，内部保留不透明。X-Ray 壳体视角边缘 Fresnel，透明度随边缘变化且克制发光；使用标准材质 shader 插入，保留 clipping 支持。剖切使用 localClippingEnabled 与 materials.clippingPlanes；不伪造封闭截面帽。

PC 默认 LOD0，较窄视口 LOD1，移动 LOD2；手动切换显式重新载入并复位。DPR 上限桌面1.75、移动1.25；后处理桌面2 samples，移动0。浏览器切换后台暂停场景更新，恢复时限制动画单帧步长。性能统计累计所有后处理调用，而不是最后一个全屏 pass。

移动端侧栏折叠，保留部件选择、显示模式和拆解；平板隐藏右侧详情。尊重 prefers-reduced-motion，GSAP 过渡变为瞬时，默认不开启自动运动。按钮有 aria-label、键盘焦点，进度/错误 live region。当前 UI 无真实 SCADA 或遥测数据，状态仅表示模型是否加载。

GLTFLoader 支持 GLB/glTF 资源，但当前产品入口加载本项目固定模型，不提供任意文件上传编辑器。对另一份资源需符合统一命名并修改 ModelLoader 的调用 URL。截图导出画布 PNG，不含 DOM 侧栏。

开发服务器绑定 127.0.0.1；如需局域网大屏，可显式运行 npm run dev -- --host 0.0.0.0，部署建议使用 npm run build 后的静态 dist。window.turbineDiagnostics() 是只读诊断快照，浏览器自动测试用于检查位置/相机/状态，不提供远程控制端点。
