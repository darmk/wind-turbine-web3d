import {displayModelName} from './turbine';
export interface ComponentDefinition {
  id: string; name: string; english: string; category: string; parent?: string;
  objectNames: string[]; specification: string; description: string;
  source: 'OFFICIAL' | 'PUBLIC-REFERENCE' | 'ENGINEERING-ESTIMATE'; estimated: boolean;
  explosionOffset: [number, number, number]; cameraOffset: [number, number, number];
}
type Row = [string,string,string,string,string|undefined,string,string,ComponentDefinition['source'],[number,number,number]];
const rows: Row[] = [
 ['turbine','风力发电机','Wind turbine','EN182_WindTurbine',undefined,`${displayModelName} · 5 MW`,'用于结构展示的测试数字样机。外形和内部几何采用工程近似，不是官方原始 CAD。','ENGINEERING-ESTIMATE',[0,0,0]],
 ['rotor','叶轮系统','Rotor assembly','Rotor','turbine','Ø 181.1 m · 三叶片','三片叶片以 120° 间隔布置。转动速度为演示倍率，不代表真实运行转速。','OFFICIAL',[24,4,0]],
 ['blade_01','叶片 01','Blade 01','Blade_01','rotor','EN89 VL · 约 89 m','截面包含弦长、扭转、厚度、后掠与渐缩。完整原厂翼型未公开，叶片外形为工程近似。','PUBLIC-REFERENCE',[0,20,0]],
 ['blade_02','叶片 02','Blade 02','Blade_02','rotor','EN89 VL · 约 89 m','与叶片 01 共享参数化翼型定义；沿转子轴旋转 120° 安装。','PUBLIC-REFERENCE',[0,20,0]],
 ['blade_03','叶片 03','Blade 03','Blade_03','rotor','EN89 VL · 约 89 m','与叶片 01 共享参数化翼型定义；沿转子轴旋转 240° 安装。','PUBLIC-REFERENCE',[0,20,0]],
 ['hub','轮毂','Hub & pitch system','Hub','rotor','三接口 · 电动变桨','含整流罩、变桨轴承、驱动电机和安装骨架。变桨形式公开可查，布局尺寸为近似。','OFFICIAL',[15,0,0]],
 ['nacelle','机舱系统','Nacelle assembly','Nacelle','turbine','传动链 / 发电 / 控制','流线型复合材料外壳内布置主要传动和电气组件。双击聚焦后可切换透视或拆解。','ENGINEERING-ESTIMATE',[0,0,0]],
 ['nacelle_cover','机舱外壳','Nacelle cover','Nacelle_Cover','nacelle','分体外壳 · 检修舱口','带圆角渐变截面的薄壁罩壳，含散热百叶及风向仪视觉细节。外形尺寸均为工程近似。','ENGINEERING-ESTIMATE',[0,17,-12]],
 ['main_frame','主机架','Main frame','MainFrame','nacelle','承载底座 / 偏航轴承','纵梁、横梁与偏航支承的简化结构。未进行强度计算。','ENGINEERING-ESTIMATE',[0,-9,0]],
 ['main_shaft','主轴','Main shaft','MainShaft','nacelle','低速传动轴','连接轮毂与齿轮箱输入端，包含锻造轴体和连接法兰。尺寸为工程估算。','ENGINEERING-ESTIMATE',[13,1,0]],
 ['main_bearing','主轴承','Main bearing','MainBearing','nacelle','Spherical roller bearing','政府公开部件清单确认调心滚子轴承。模型表现双列滚子和内外圈，滚子数量及尺寸为近似。','PUBLIC-REFERENCE',[7,6,9]],
 ['gearbox','齿轮箱','Gearbox','Gearbox','nacelle','WE7200Y','三级传动：Planetary ×2 · Helical ×1。公开资料确认传动级形式；模型中的齿数、模数、轴距和尺寸为视觉近似。','PUBLIC-REFERENCE',[0,5,14]],
 ['planetary_stage_01','一级行星传动','Planetary stage 01','PlanetaryStage_01','gearbox','太阳轮 / 行星轮 / 齿圈 / 行星架','低速输入级。三行星布置仅用于解释结构，不用于啮合或载荷分析。','PUBLIC-REFERENCE',[3,0,0]],
 ['planetary_stage_02','二级行星传动','Planetary stage 02','PlanetaryStage_02','gearbox','第二行星增速级','基于两级行星传动公开描述建立的简化第二级。','PUBLIC-REFERENCE',[-2,0,0]],
 ['helical_stage','斜齿传动级','Helical stage','HelicalStage','gearbox','高速斜齿轮副','包含带螺旋角的大小齿轮视觉几何。齿廓不具有制造精度。','PUBLIC-REFERENCE',[-5,0,0]],
 ['coupling','联轴器','Coupling','Coupling','nacelle','高速弹性联轴器','齿轮箱与发电机连接部件的结构示意。','ENGINEERING-ESTIMATE',[-4,3,6]],
 ['generator','发电机','Generator','Generator','nacelle','DFIG · 双馈异步发电机','包含转子、定子外壳、轴、端盖、散热筋及铜绕组示意。机型类型公开确认，内部细节采用工程近似。','OFFICIAL',[-16,3,0]],
 ['brake','制动系统','Brake system','Brake','nacelle','制动盘 / 卡钳 / 液压','厂家手册披露液压次级制动。盘式结构和安装位置为视觉近似。','OFFICIAL',[-7,8,-8]],
 ['converter','变流器','Power converter','Converter','nacelle','电力电子变流柜','电气柜体与散热结构的简化示意，无完整电气回路。','ENGINEERING-ESTIMATE',[-8,0,14]],
 ['cooling','冷却系统','Cooling system','CoolingSystem','nacelle','散热器 / 风扇','展示辅助散热模块，规格与管路布局为工程估算。','ENGINEERING-ESTIMATE',[-7,13,0]],
 ['control_cabinet','控制柜','Control cabinet','ControlCabinet','nacelle','控制与监测柜','控制柜外壳、柜门、把手及散热百叶的视觉示意。','ENGINEERING-ESTIMATE',[-13,0,-12]],
 ['tower','塔筒','Tubular steel tower','Tower','turbine','130 m 轮毂配置 · 四段式','钢管塔含法兰、螺栓、检修平台、梯子和电缆。130/140 m 配置有公开依据，分段与尺寸为近似。','PUBLIC-REFERENCE',[0,0,0]],
 ['foundation','基础','Foundation','Foundation','turbine','混凝土基础 / 塔底承台','仅表示地上基础轮廓；基础尺寸为工程近似，未模拟地基或地下配筋。','ENGINEERING-ESTIMATE',[0,0,0]],
 ['detail','检修附件','Access & details','Detail','turbine','螺栓 / 法兰 / 平台 / 梯子 / 护栏','独立 Detail 层级组织基础锚栓、底部法兰与检修入口附件。布局和尺寸为工程近似。','ENGINEERING-ESTIMATE',[0,0,0]]
];
export const components: ComponentDefinition[] = rows.map(([id,name,english,object,parent,specification,description,source,explosionOffset]) => ({id,name,english,category:parent||'turbine',parent,objectNames:[object],specification,description,source,estimated:true,explosionOffset,cameraOffset:[1,.5,1.4]}));
export const componentMap = new Map(components.map(c=>[c.id,c]));
