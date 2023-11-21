export class GeometryService {

    /**
     * 立方体顶点数据
     * @param {number} r 
     * @returns {Float32Array}
     */
    static getCubePoints(radius = 0.5) {
        return new Float32Array([
            // 正面
            -radius, -radius, radius, radius, -radius, radius, radius, radius, radius, radius, radius, radius, -radius, radius, radius, -radius, -radius, radius,
            // 背面
            -radius, -radius, -radius, radius, -radius, -radius, radius, radius, -radius, radius, radius, -radius, -radius, radius, -radius, -radius, -radius, -radius,
            // 左边
            -radius, -radius, -radius, -radius, -radius, radius, -radius, radius, radius, -radius, radius, radius, -radius, radius, -radius, -radius, -radius, -radius,
            // 右边
            radius, -radius, -radius, radius, -radius, radius, radius, radius, radius, radius, radius, radius, radius, radius, -radius, radius, -radius, -radius,
            // 上侧
            -radius, radius, radius, radius, radius, radius, radius, radius, -radius, radius, radius, -radius, -radius, radius, -radius, -radius, radius, radius,
            // 下侧
            -radius, -radius, radius, radius, -radius, radius, radius, -radius, -radius, radius, -radius, -radius, -radius, -radius, -radius, -radius, -radius, radius,
        ]);
    }

    /**
     * 立方体法向量
     * @returns {Float32Array}
     */
    static getCubeNormals() {
        return new Float32Array([
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
        ]);
    }

    /**
     * 立方体纹理坐标
     * @returns {Float32Array}
     */
    static getCubeTextureCoord() {
        return new Float32Array([
            // 正面
            0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0,
            // 背面
            1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0,
            // 左边
            0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0,
            // 右边
            1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0,
            // 上侧
            0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0,
            // 下侧
            1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0,
        ]);
    }

    /**
     * 球体顶点数据
     * @param {number} radius 
     * @param {number} latitudeCount 纬线数量
     * @param {number} longitudeCount 经线数量
     * @returns {Float32Array}
     */
    static getSpherePoints(radius = 0.5, latitudeCount = 10, longitudeCount = 20) {

        /**
         * 获取经纬线交叉点的坐标
         * @param {number} radius 
         * @param {number} latitudeIndex 纬线序列
         * @param {number} longitudeIndex 经线序列
         * @param {number} latitudeCount 纬线总数
         * @param {number} longitudeCount 经线总数
         * @returns {number[]}
         */
        const getCrossPointCoord = (radius, latitudeIndex, longitudeIndex, latitudeCount, longitudeCount) => {
            const latitudeAngle = (latitudeIndex / latitudeCount) * Math.PI;
            const longitudeAngle = (longitudeIndex / longitudeCount) * Math.PI * 2;

            const x = radius * Math.sin(latitudeAngle) * Math.cos(longitudeAngle);
            const y = radius * Math.cos(latitudeAngle);
            const z = radius * Math.sin(latitudeAngle) * Math.sin(longitudeAngle);
            return [x, y, z];
        }

        const points = [];
        for (let latitudeIndex = 0; latitudeIndex < latitudeCount; latitudeIndex++) {
            for (let longitudeIndex = 0; longitudeIndex < longitudeCount; longitudeIndex++) {
                points.push(...getCrossPointCoord(radius, latitudeIndex, longitudeIndex, latitudeCount, longitudeCount));
                points.push(...getCrossPointCoord(radius, latitudeIndex + 1, longitudeIndex, latitudeCount, longitudeCount));
                points.push(...getCrossPointCoord(radius, latitudeIndex + 1, longitudeIndex + 1, latitudeCount, longitudeCount));
                points.push(...getCrossPointCoord(radius, latitudeIndex + 1, longitudeIndex + 1, latitudeCount, longitudeCount));
                points.push(...getCrossPointCoord(radius, latitudeIndex, longitudeIndex + 1, latitudeCount, longitudeCount));
                points.push(...getCrossPointCoord(radius, latitudeIndex, longitudeIndex, latitudeCount, longitudeCount));
            }
        }
        return new Float32Array(points);
    }
}