# EN-182/5.0 公开资料研究

获取日期：2026-09-11。用途：公开资料驱动的视觉数字样机，非原厂 CAD。未使用品牌 Logo、贴图、水印。

## 来源登记

|ID / 优先级|资料及 URL|官方性 / 阅读状态|采用内容 / 可信度|
|---|---|---|---|
|S1 / P0|[Envision India Onshore WTG, May 2025, p2](https://www.envision-energy.in/assets/frontend/images/documents/Envision-WTG-5-MW-V2-May-2025-LR.pdf)|厂家公开手册，已读取 PDF|5 MW、181.1 m、DFIG、三级传动、130/140 m；高，OFFICIAL|
|S2 / P1-P2|[Major component details EN-182/5.0 IEC S 50Hz, 2026-02](https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2026/02/202602101129651878.pdf)|印度政府 CDN 发布部件表，已读取全部 3 页；非厂家原始 CAD|EN89 VL、WE7200Y 两行星一级斜齿、钢管塔 HH130/140、调心滚子轴承；高，PUBLIC-REFERENCE|
|S3 / P1|[IECRE.WE.TC.25.0168-R2 Type Certificate](https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2025/10/202510011569428572.pdf)|政府公开的 IECRE 证书；检索索引可读，全文两次获取超时|索引交叉支持机型、叶片及齿轮箱；不据此推断全文未核实尺寸。暂不升级为 PUBLIC-CERTIFIED|
|S4 / P0|[Envision Wind Turbines](https://www.envision-group.com/en/windturbines.html)|厂家产品介绍，已读取|平台与外观语境；未披露目标机型内部 CAD|
|S5 / P4|[The Wind Power EN-182/5.0](https://www.thewindpower.net/turbine_en_2072_en-182-5.0.php)|第三方数据库，仅交叉校验|182 m、3 叶片；中，PUBLIC-REFERENCE，不当作官方参数|

## 建模参数与证据边界

|参数|值|标签|依据|需工程近似|
|---|---|---|---|---|
|型号 / 额定功率|EN-182/5.0 / 5 MW|[OFFICIAL]|S1|否|
|转子直径|181.1 m|[OFFICIAL]|S1|否；统一建模值|
|轮毂高度|130 m，支持 140 m|[OFFICIAL]|S1|塔段细分与直径为近似|
|叶片数量|3|[PUBLIC-REFERENCE]|S5 与产品外观|否|
|叶片型号|EN89 VL|[PUBLIC-REFERENCE]|S2 p1|型号否；几何是|
|叶片长度|约 89 m|[ENGINEERING-ESTIMATE]|用户提供名义长度，与 EN89 命名一致；所读手册未列精确长度|是，不能称精确官方尺寸|
|齿轮箱|WE7200Y，两级行星＋一级斜齿|[PUBLIC-REFERENCE]|S2 p1|结构类型否，齿数/尺度是|
|发电机类型|DFIG 双馈异步|[OFFICIAL]|S1 p2；S2 p2 为异步|尺寸/绕组布局是|
|主轴承|调心滚子轴承|[PUBLIC-REFERENCE]|S2 p2|滚子数量/曲率/尺度是|
|塔筒|Tubular Steel Tower|[PUBLIC-REFERENCE]|S2 p1|壁厚/法兰/平台是|
|变桨|电动变桨 / 三排滚子轴承|[OFFICIAL] / [PUBLIC-REFERENCE]|S1 / S2 p2|安装布局是|
|次级制动|液压制动|[OFFICIAL]|S1|盘/钳布局是|
|机舱尺寸、传动件尺寸、柜体布局|见 JSON engineering 字段|[ENGINEERING-ESTIMATE]|无公开完整工程尺寸|是|

公开资料存在约182m的工程化表述。本模型采用厂家手册 181.1 m，不认定 182 m 表述错误。约 89 m 叶片与半径 90.55 m 通过 1.55 m 根部基准半径关联；弦长方向与后掠存在局部偏移，叶尖半径由代码约束到 90.55 m。

标签语义：OFFICIAL=厂家明确披露；PUBLIC-CERTIFIED=成功核实证书全文支持；PUBLIC-REFERENCE=公开部件/项目资料支持；ENGINEERING-ESTIMATE=明确工程假定。本轮未用无法读取的证书全文授予任何参数 PUBLIC-CERTIFIED。
