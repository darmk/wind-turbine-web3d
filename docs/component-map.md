# 统一部件映射

权威运行时定义：src/data/components.ts。Blender Empty 自定义属性 componentId 经 glTF extras 保存，Web 名称检查与模型点击回溯使用同一 ID。每行 source 描述规格证据，所有几何都 estimated=true；不要把“规格有公开依据”误读为“全部尺寸官方”。

|ID|GLB 节点|父 ID|
|---|---|---|
|turbine|EN182_WindTurbine|根|
|foundation|Foundation|turbine|
|detail|Detail（Bolts / Flanges / Platforms / Ladders / Handrails）|turbine|
|tower|Tower|turbine|
|rotor|Rotor|turbine|
|hub|Hub|rotor|
|blade_01 / blade_02 / blade_03|Blade_01 / Blade_02 / Blade_03|rotor|
|nacelle|Nacelle|turbine|
|nacelle_cover|Nacelle_Cover|nacelle|
|main_frame|MainFrame|nacelle|
|main_shaft|MainShaft|nacelle|
|main_bearing|MainBearing|nacelle|
|gearbox|Gearbox|nacelle|
|planetary_stage_01|PlanetaryStage_01|gearbox|
|planetary_stage_02|PlanetaryStage_02|gearbox|
|helical_stage|HelicalStage|gearbox|
|coupling|Coupling|nacelle|
|generator|Generator|nacelle|
|brake|Brake|nacelle|
|converter|Converter|nacelle|
|cooling|CoolingSystem|nacelle|
|control_cabinet|ControlCabinet|nacelle|

拆解偏移配置在每个 ComponentDefinition.explosionOffset。偏移按父节点局部 glTF 坐标解释，叶片额外通过本身的安装 quaternion 将 +Y 径向偏移转换到 Rotor 空间。原点坐标在 ModelHierarchy 加载后缓存；GSAP 动画完成时复制精确目标坐标，避免重复拆装的浮点舍入残差。

一级移动 Rotor；二级进一步抬起罩壳并展开机舱主组件；完全拆解再拆分轮毂、三叶片与齿轮箱内部三级。齿轮箱级节点相对于 Gearbox 移动，继承父级位移。整体拆解不随机散开。
