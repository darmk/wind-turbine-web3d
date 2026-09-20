# 开发日志

## 展示名称与初始动画调整 — 2026-09-12

按用户新要求，页面标题、主标题、面包屑、信息面板、底部型号和下载截图名统一使用 TEST-182，集中定义在 src/data/turbine.ts。研究资料与内部资源 ID 保留原始追溯关系，不在页面展示原机型名。初始加载叶轮自动播放、默认2×；暂停/停止/拆解行为保持可控，恢复整机停止叶轮并保留2×速度。构建通过，7项生产浏览器回归通过，包含标题/正文无原机型名、2×默认值和实际转动检查。

模型取景与科技背景尚未实施新方案，待用户从三张独立视觉概念图中选择后再改。

## 最终交付复核 — 2026-09-12

- 新增独立 Detail / Bolts / Flanges / Platforms / Ladders / Handrails，现共24个语义部件。
- 再次实际 npm install：成功，0 vulnerabilities；postinstall 已复制本地 Draco 解码器。
- 三档 GLB 检查成功：LOD0 458096 bytes / 88864 unique triangles；LOD1 363012 bytes / 58384；LOD2 237448 bytes / 26600。Blender 源文件6249568 bytes。
- Blender几何校验：轮毂130m，叶片角度0/120/240度，测得扫掠直径181.100028m；140m独立配置校验成功。
- npm run build 成功；仅有 Three vendor chunk >500KB 的体积提示，已在已知限制中说明。
- npm run preview :4173 下7组自动测试全部通过，33.3秒，0 unexpected / 0 flaky；正常路径无 JS/WebGL/HTTP 错误。
- 桌面1600×1000实测60 FPS；移动390×844无横向溢出、部件选择通过；大屏3840×2160加载与布局通过，预热2.2秒后采样2.5秒实测60 FPS。大屏第一次状态采样包含初始化编译耗时，不能代表稳态性能；最终采样见 large-screen-check.json。
- 恢复/重载/卸载按GSAP生命周期处理，减弱动态效果时直接写入精确坐标。
- 本地开发地址 http://127.0.0.1:5173/；生产预览 http://127.0.0.1:4173/。未执行外网部署。

以下为逐阶段原始执行日志；早期统计代表当时版本，最终以本节、model-check.json、model_validation_report.json及test-results.json为准。

## Phase 1 / 2 复核

npm install 和初始 npm run build 实际通过。旧系统 Node 16 下的开发工具存在版本告警，因此改用已安装的 Node 24.19.0，通过 scripts/run.cjs 自动选择；升级 Vite 8.3、Playwright 1.63、tsx 4.23。安装完成后 audit=0 vulnerabilities。研究已完成：厂家 PDF 和政府部件表已读取，证书全文超时明确记录。

## Phase 9 — GLB Web 场景

实际 npm run build 通过；npm run dev 在 127.0.0.1:5173 启动。Edge 无头浏览器加载 6.5 MB 主 GLB 成功，canvas=1，pageerror/console error=[]，截图 phase9.png。GLB 名称检查 23 个语义组件全部存在。相机按 bounding sphere 和纵横视场计算，Blender Z-up 正确转为 glTF Y-up。

## Phase 1 — 项目初始化 · 2026-09-11

空目录中创建独立 en182-wind-turbine 项目。环境 Node 16.15.0 / npm 8.5.5；Blender 4.2.23 LTS 位于 D:/Program Files/Blender Foundation/Blender 4.2/blender.exe，附带 Python 可用。使用独立后台 Blender 进程，保护当前打开的 32 个对象场景。依赖版本选择兼容当前 Node 的 Vite 4；通过 lockfile 固定。初始化执行结果随后记录。


## Phase 3 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。143 mesh objects，12128 triangles。验证 errors=[]；参数配置 en182_config.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 4 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。149 mesh objects，42740 triangles。验证 errors=[]；参数配置 en182_config.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 5 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。253 mesh objects，51172 triangles。验证 errors=[]；参数配置 en182_config.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 6 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。257 mesh objects，57284 triangles。验证 errors=[]；参数配置 en182_config.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 7 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。330 mesh objects，241484 triangles。验证 errors=[]；参数配置 en182_config.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 8 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。330 mesh objects，241484 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD1

Blender 4.2.23 LTS 后台生成通过。234 mesh objects，95804 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。170 mesh objects，30196 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。


## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。


## Phase 8 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。330 mesh objects，241484 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD1

Blender 4.2.23 LTS 后台生成通过。234 mesh objects，95804 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。170 mesh objects，30196 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。330 mesh objects，91724 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD1

Blender 4.2.23 LTS 后台生成通过。234 mesh objects，59516 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。170 mesh objects，27476 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 11 — 浏览器实际验证

GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。


## Phase 7 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。170 mesh objects，27680 triangles。验证 errors=[]；参数配置 hh140.json。 本阶段完成参数化几何检查，后续阶段继续。

## Phase 8 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。330 mesh objects，91724 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD1

Blender 4.2.23 LTS 后台生成通过。234 mesh objects，59516 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。170 mesh objects，27476 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 11 — 浏览器实际验证

GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。


## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 11 — 浏览器实际验证

GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。


## Phase 8 — Blender 实际执行 / LOD0

Blender 4.2.23 LTS 后台生成通过。367 mesh objects，94444 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD1

Blender 4.2.23 LTS 后台生成通过。259 mesh objects，61804 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 8 — Blender 实际执行 / LOD2

Blender 4.2.23 LTS 后台生成通过。187 mesh objects，28580 triangles。验证 errors=[]；参数配置 en182_config.json。 已导出 GLB。

## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 11 — 浏览器实际验证

GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。


## Phase 10 — 浏览器实际验证

部件树选择齿轮箱、相机飞行、隐藏/显示、单独查看均通过；console pageerror=[]。截图 gearbox.png。


## Phase 11 — 浏览器实际验证

GSAP 2 秒分层拆解、动画暂停/继续、位置精确复位通过。恢复后各语义组件 local position 与初始快照相同。


## Phase 12 — 浏览器实际验证

外壳 0.23 透明度、内部 PBR 显示通过，截图 transparent.png。


## Phase 13 — 浏览器实际验证

Fresnel X-Ray shader 在 Edge WebGL 实际编译和渲染通过，无 WebGL/JS 错误；截图 xray.png。


## Phase 14 — 浏览器实际验证

X/Y/Z 剖切平面和滑块实时更新通过，材质 clipping 与 X-Ray 切换无错误；截图 section.png。


## Phase 15 — 浏览器实际验证

深蓝 UI 在 1600×1000 与 390×844 无横向溢出，移动端部件选择通过。截图 desktop.png / mobile.png。


## Phase 16 — 浏览器实际验证

三 LOD 可加载；本机 Edge 无头浏览器 rAF 实测 60 FPS（非跨设备性能保证）。螺栓合并为 InstancedMesh，详情见 performance.json。


## Phase 17 — 浏览器实际验证

模拟 GLB 网络失败，界面保留错误与重试入口；解除故障后重新加载成功。
