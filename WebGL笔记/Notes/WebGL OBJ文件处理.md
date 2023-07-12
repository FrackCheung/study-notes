# WebGL OBJ文件处理

**[返回主目录](../readme.md)**

#### OBJ文件
+ OBJ文件是3D建模软件创建的模型导出后生产的文件
+ 让我们来看一个典型的`立方体`的OBJ文件`cube.obj`
+ 这个文件是`Blender`软件制作并导出的
```OBJ
# Blender v2.80 (sub 75) OBJ File: ''
# www.blender.org
mtllib cube.mtl
o Cube
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 1.000000 -1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 1.000000
vt 0.375000 0.000000
vt 0.625000 0.000000
vt 0.625000 0.250000
vt 0.375000 0.250000
vt 0.375000 0.250000
vt 0.625000 0.250000
vt 0.625000 0.500000
vt 0.375000 0.500000
vt 0.625000 0.750000
vt 0.375000 0.750000
vt 0.625000 0.750000
vt 0.625000 1.000000
vt 0.375000 1.000000
vt 0.125000 0.500000
vt 0.375000 0.500000
vt 0.375000 0.750000
vt 0.125000 0.750000
vt 0.625000 0.500000
vt 0.875000 0.500000
vt 0.875000 0.750000
vn 0.0000 1.0000 0.0000
vn 0.0000 0.0000 1.0000
vn -1.0000 0.0000 0.0000
vn 0.0000 -1.0000 0.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 0.0000 -1.0000
usemtl Material
s off
f 1/1/1 5/2/1 7/3/1 3/4/1
f 4/5/2 3/6/2 7/7/2 8/8/2
f 8/8/3 7/7/3 5/9/3 6/10/3
f 6/10/4 2/11/4 4/12/4 8/13/4
f 2/14/5 1/15/5 3/16/5 4/17/5
f 6/18/6 5/19/6 1/20/6 2/11/6
```
+ 这个文件包含了WebGL绘制所必要的信息, 让我们来逐个描述
  - `#`开头的是注释, 这个没什么好说的
  - `mtllib`指定了该模型需要使用的外部`材质`文件, 后面跟着的`cube.mtl`就是材质文件名
  - `o`开头的表示该模型的名称, 通常在WebGL绘制出, 不需要使用
  - `v`开头的表示模型的`顶点坐标`数据
  - `vt`开头的表示模型顶点的`纹理坐标`
  - `vn`开头的表示模型顶点的`法向量`
  - `usemtl`表示`使用材质`, 这里使用了`cube.mtl`中名为`Material`的材质
  - `s off`表示禁用纹理缩放, 我们暂时不考虑使用纹理, 先放在一边
  - `f`表示`面`, 比如立方体有6个面, 这里就给出了6个`f`, `a/b/c`指定了该表面需要的数据, 分别是`顶点坐标索引/纹理坐标索引/法向量索引`
***
**TIPS1:**  以第一个`f`为例, 表示这个面的4个顶点索引分别是`1, 5, 7, 3`, 4个顶点的纹理坐标索引分别是`1, 2, 3, 4`, 4个顶点的法向量索引分别是`1, 1, 1, 1`, **注意:** 顶点索引从`1`开始, 而不是从`0`开始, 在解析代码中要记得`-1`

**TIPS2:** `usemtl`指定了在这行代码之后的表面`f`所使用的的材质, 如果有多个`usemtl`, 一定要注意, 每个`usemtl`只负责从它开始, 到下一个`usemtl`之前的`f`
***

#### OBJ文件解析(暂时不考虑纹理和材质)
+ 文件可以通过HTTP服务获取, 也可以通过本地文件上传, 不管哪种方式, 获取到的都是`文本文件`
+ 需要读取文本文件的内容, 并通过代码将里面有用的信息读取出来, 解析为WebGL需要的顶点/法向量/纹理数据
+ 我们暂时不考虑数据中的纹理坐标, 也不考虑材质, 来实现一个简易的解析器
+ 下方代码是我写的一个解析示例, 必须要说明的是, 这个解析器并不通用, 也并不适合解析所有的OBJ文件
+ 这是一本书的OBJ数据, 需要注意的是, 每个`f`使用的是3个顶点, 而每个`v`使用了6个数据, 前3个是坐标, 后3个是颜色
```TypeScript
@Injectable()
export class OBJParser {

    // 解析内容
    public parse(content: string): RenderingInformation {
        // 按行分割, 并去除前后空格
        const lineArray: string[] = content.split('\n').map(c => c.trim());

        // 保存解析出来的顶点
        const obj_V: Array<number[]> = [];

        // 保存解析出来的法向量
        const obj_VN: Array<number[]> = [];

        // 保存解析出来的面
        const obj_F: Array<string[]> = [];

        // 逐行处理
        lineArray.forEach(line => {
            // 如果是顶点, v开头
            if (line.startsWith('v ')) {
                const vertexes = line.replace('v ', '').split(' ').map(e => parseFloat(e));
                obj_V.push(vertexes);
            }
            // 如果是法向量, vn开头
            if (line.startsWith('vn ')) {
                const normals = line.replace('vn ', '').split(' ').map(e => parseFloat(e));
                obj_VN.push([normals[0], normals[1], normals[2]]);
            }
            // 如果是面, f开头
            if (line.startsWith('f ')) {
                obj_F.push(line.replace('f ', '').split(' '));
            }
        });

        // 最终的顶点数据
        const points: number[] = [];
        // 最终的法向量数据
        const normals: number[] = [];
        // 最终的顶点颜色数据
        const colors: number[] = [];
        
        // 逐面处理
        obj_F.forEach(face => {
            // 从f中提取出来的顶点索引, 要记得-1
            const vertexIndexes: number[] = face.map(f => parseInt(f.split('/')[0]) - 1);
            // 从f中提取出来的法向量索引, 要记得-1
            const normalIndexes: number[] = face.map(f => parseInt(f.split('/')[2]) - 1);

            points.push(
                // 根据顶点索引, 从顶点集合中读取对应的数据, 推入points, 注意, 顶点数据是6个, 只有前3个是坐标, 因此只需要推入前3个
                obj_V[vertexIndexes[0]][0], obj_V[vertexIndexes[0]][1], obj_V[vertexIndexes[0]][2],
                obj_V[vertexIndexes[1]][0], obj_V[vertexIndexes[1]][1], obj_V[vertexIndexes[1]][2],
                obj_V[vertexIndexes[2]][0], obj_V[vertexIndexes[2]][1], obj_V[vertexIndexes[2]][2]
            );

            colors.push(
                // 根据顶点索引, 从顶点集合中读取对应的数据, 推入colors, 注意, 顶点数据是6个, 只有后3个是坐标, 因此只需要推入后3个
                obj_V[vertexIndexes[0]][3], obj_V[vertexIndexes[0]][4], obj_V[vertexIndexes[0]][5],
                obj_V[vertexIndexes[1]][3], obj_V[vertexIndexes[1]][4], obj_V[vertexIndexes[1]][5],
                obj_V[vertexIndexes[2]][3], obj_V[vertexIndexes[2]][4], obj_V[vertexIndexes[2]][5]
            );

            normals.push(
                ...obj_VN[normalIndexes[0]],
                ...obj_VN[normalIndexes[1]],
                ...obj_VN[normalIndexes[2]]
            );
        });

        return {
            attributes: [
                { type: AttributeDataType.Points, name: 'a_Position', data: new Float32Array(points), count: 3, stride: 0, offset: 0 },
                { type: AttributeDataType.Normals, name: 'a_Normal', data: new Float32Array(normals), count: 3, stride: 0, offset: 0 },
                { type: AttributeDataType.Color, name: 'a_Color', data: new Float32Array(colors), count: 3, stride: 0, offset: 0 },
            ],
            uniforms: [

            ]
        }
    }
}
```
+ 将数据传入WebGL绘制, 将会看到如下的效果   
  ![](./Assets/webgl-obj-loader-without-mtl.gif)

#### 总结
+ OBJ文件中通过`v`, `vn`和`vt`定义了顶点的`坐标`数据, `法向量`数据, 以及`纹理`坐标数据, 通常来说, `v`顶点坐标每一行都是`3`个值, 包含 $x, y, z$ 分量; `vn`和`v`一样; `vt`顶点纹理坐标则每一行都是两个值, 只包含 $x, y$ 分量
+ 在一些不规范的OBJ文件中, `v`顶点坐标每一行可能有`6`个值, 前3个表示顶点`坐标`, 后3个表示顶点`颜色`
+ 解析的核心, 在于读取`f`行所在的信息, `f`行将一行所代表的`面`的顶点坐标, 纹理坐标, 法向量坐标的索引值给出, 将其解析并将最终的数据赋值给WebGL绘制
+ **注意:** `f`行可能每行并不一定是三组数据, 比如上方的立方体, 每一行包含了4个顶点的信息, 需要注意这点, 并合理的处理, 因为WebGL最多只能绘制三角形; 而上方书的文件中, 每个`f`都是三组数据, 就可以直接拿到, 并交给WebGL使用`gl.TRIANGLES`模式绘制
****
**[返回主目录](../readme.md)**