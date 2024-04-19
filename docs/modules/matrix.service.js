export class MatrixService {

    /**
     * 单位矩阵
     * @returns {number[]}
     */
    static getIdentityMatrix() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    }

    /**
     * 矩阵相乘 - 右乘
     * @param  {...number[]} matrix4 
     * @returns {number[]}
     */
    static multiply(...matrix4) {
        /**
         * 两个矩阵相乘
         * @param {number[]} m 
         * @param {number[]} n 
         * @returns {number[]}
         */
        const multi = (m, n) => [
            m[0] * n[0] + m[1] * n[4] + m[2] * n[8] + m[3] * n[12],
            m[0] * n[1] + m[1] * n[5] + m[2] * n[9] + m[3] * n[13],
            m[0] * n[2] + m[1] * n[6] + m[2] * n[10] + m[3] * n[14],
            m[0] * n[3] + m[1] * n[7] + m[2] * n[11] + m[3] * n[15],
            m[4] * n[0] + m[5] * n[4] + m[6] * n[8] + m[7] * n[12],
            m[4] * n[1] + m[5] * n[5] + m[6] * n[9] + m[7] * n[13],
            m[4] * n[2] + m[5] * n[6] + m[6] * n[10] + m[7] * n[14],
            m[4] * n[3] + m[5] * n[7] + m[6] * n[11] + m[7] * n[15],
            m[8] * n[0] + m[9] * n[4] + m[10] * n[8] + m[11] * n[12],
            m[8] * n[1] + m[9] * n[5] + m[10] * n[9] + m[11] * n[13],
            m[8] * n[2] + m[9] * n[6] + m[10] * n[10] + m[11] * n[14],
            m[8] * n[3] + m[9] * n[7] + m[10] * n[11] + m[11] * n[15],
            m[12] * n[0] + m[13] * n[4] + m[14] * n[8] + m[15] * n[12],
            m[12] * n[1] + m[13] * n[5] + m[14] * n[9] + m[15] * n[13],
            m[12] * n[2] + m[13] * n[6] + m[14] * n[10] + m[15] * n[14],
            m[12] * n[3] + m[13] * n[7] + m[14] * n[11] + m[15] * n[15]
        ];

        let temp = this.getIdentityMatrix();
        matrix4.forEach(m => {
            temp = multi(temp, m);
        });
        return temp;
    }

    /**
     * 矩阵转置
     * @param {number[]} matrix4
     * @returns {number[]} 
     */
    static tranpose(matrix4) {
        return [
            matrix4[0], matrix4[4], matrix4[8], matrix4[12],
            matrix4[1], matrix4[5], matrix4[9], matrix4[13],
            matrix4[2], matrix4[6], matrix4[10], matrix4[14],
            matrix4[3], matrix4[7], matrix4[11], matrix4[15],
        ];
    }

    /**
     * 逆矩阵
     * @param {number[]} m 
     * @returns {number[]}
     */
    static inverse(m) {
        /**
         * 三阶矩阵的秩, 即三阶行列式的值
         * @param {number[]} matrix 
         * @returns {number}
         */
        const calcMatrix3Rank = m3 => (
            m3[0] * m3[4] * m3[8] + m3[1] * m3[5] * m3[6] + m3[2] * m3[3] * m3[7]
            - m3[2] * m3[4] * m3[6] - m3[1] * m3[3] * m3[8] - m3[0] * m3[5] * m3[7]
        );

        /**
         * 四阶矩阵的秩, 使用代数余子式计算, 展开第一行
         * @param {number[]} m4 
         * @returns {number}
         */
        const calcMatrix4Rank = m4 => [
            m4[0] * calcMatrix3Rank([m4[5], m4[6], m4[7], m4[9], m4[10], m4[11], m4[13], m4[14], m4[15]]),
            -1 * m4[1] * calcMatrix3Rank([m4[4], m4[6], m4[7], m4[8], m4[10], m4[11], m4[12], m4[14], m4[15]]),
            m4[2] * calcMatrix3Rank([m4[4], m4[5], m4[7], m4[8], m4[9], m4[11], m4[12], m4[13], m4[15]]),
            -1 * m4[3] * calcMatrix3Rank([m4[4], m4[5], m4[6], m4[8], m4[9], m4[10], m4[12], m4[13], m4[14]])
        ].reduce((a, b) => a + b);

        const rank = calcMatrix4Rank(m);
        if (rank === 0) {
            return m;
        }

        // 伴随矩阵
        const adjointMatrix = this.tranpose([
            calcMatrix3Rank([m[5], m[6], m[7], m[9], m[10], m[11], m[13], m[14], m[15]]),
            -1 * calcMatrix3Rank([m[4], m[6], m[7], m[8], m[10], m[11], m[12], m[14], m[15]]),
            calcMatrix3Rank([m[4], m[5], m[7], m[8], m[9], m[11], m[12], m[13], m[15]]),
            -1 * calcMatrix3Rank([m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]]),

            -1 * calcMatrix3Rank([m[1], m[2], m[3], m[9], m[10], m[11], m[13], m[14], m[15]]),
            calcMatrix3Rank([m[0], m[2], m[3], m[8], m[10], m[11], m[12], m[14], m[15]]),
            -1 * calcMatrix3Rank([m[0], m[1], m[3], m[8], m[9], m[11], m[12], m[13], m[15]]),
            calcMatrix3Rank([m[0], m[1], m[2], m[8], m[9], m[10], m[12], m[13], m[14]]),

            calcMatrix3Rank([m[1], m[2], m[3], m[5], m[6], m[7], m[13], m[14], m[15]]),
            -1 * calcMatrix3Rank([m[0], m[2], m[3], m[4], m[6], m[7], m[12], m[14], m[15]]),
            calcMatrix3Rank([m[0], m[1], m[3], m[4], m[5], m[7], m[12], m[13], m[15]]),
            -1 * calcMatrix3Rank([m[0], m[1], m[2], m[4], m[5], m[6], m[12], m[13], m[14]]),


            -1 * calcMatrix3Rank([m[1], m[2], m[3], m[5], m[6], m[7], m[9], m[10], m[11]]),
            calcMatrix3Rank([m[0], m[2], m[3], m[4], m[6], m[7], m[8], m[10], m[11]]),
            -1 * calcMatrix3Rank([m[0], m[1], m[3], m[4], m[5], m[7], m[8], m[9], m[11]]),
            calcMatrix3Rank([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]),
        ]);
        return adjointMatrix.map(m => m / rank);
    }

    /**
     * 缩放矩阵
     * @param {number} x 
     * @param {number} y 
     * @param {number} z
     * @returns {number[]} 
     */
    static scale(x, y, z) {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]
    }

    /**
     * 平移矩阵
     * @param {number} x 
     * @param {number} y 
     * @param {number} z
     * @returns {number[]} 
     */
    static translate(x, y, z) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]
    }

    /**
     * X旋转
     * @param {number} degree 
     * @returns {number[]}
     */
    static rotateX(degree) {
        const radius = degree * Math.PI / 180;
        const cos = Math.cos(radius);
        const sin = Math.sin(radius)
        return [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Y旋转
     * @param {number} degree 
     * @returns {number[]}
     */
    static rotateY(degree) {
        const radius = degree * Math.PI / 180;
        const cos = Math.cos(radius);
        const sin = Math.sin(radius)
        return [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Z旋转
     * @param {number} degree 
     * @returns {number[]}
     */
    static rotateZ(degree) {
        const radius = degree * Math.PI / 180;
        const cos = Math.cos(radius);
        const sin = Math.sin(radius)
        return [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * 立方体经典旋转
     * @param {number} degree 
     * @returns {number[]}
     */
    static cubeRotate(degree) {
        return this.multiply(
            this.rotateX(degree),
            this.rotateY(degree * 0.7),
            this.rotateZ(degree * 0.3)
        );
    }

    /**
     * 视图矩阵
     * @param {number} eye1 
     * @param {number} eye2 
     * @param {number} eye3 
     * @param {number} target1 
     * @param {number} target2 
     * @param {number} target3 
     * @param {number} up1 
     * @param {number} up2 
     * @param {number} up3 
     * @returns {number[]}
     */
    static lookAt(eye1, eye2, eye3, target1, target2, target3, up1, up2, up3) {
        // 第一步: 计算R向量

        // 先计算视线向量
        const rx = target1 - eye1;
        const ry = target2 - eye2;
        const rz = target3 - eye3;

        // 单位化视线向量
        const rSquareSum = Math.sqrt(rx * rx + ry * ry + rz * rz);

        // 得到视线向量的单位向量, R = -视线向量
        const rxn = rx / rSquareSum;
        const ryn = ry / rSquareSum;
        const rzn = rz / rSquareSum;

        // 第二步: 计算p向量, P = -R X up

        // 点计算 -R X up, -R就是视线向量
        const px = ryn * up3 - rzn * up2;
        const py = rzn * up1 - rxn * up3;
        const pz = rxn * up2 - ryn * up1;

        // 单位化该项量
        const pSquareSum = Math.sqrt(px * px + py * py + pz * pz);

        // 得到P向量的单位向量
        const pxn = px / pSquareSum;
        const pyn = py / pSquareSum;
        const pzn = pz / pSquareSum;

        // 计算Q向量 Q = R X P = P X (-R), -R就是视线向量
        const qxn = pyn * rzn - pzn * ryn;
        const qyn = pzn * rxn - pxn * rzn;
        const qzn = pxn * ryn - pyn * rxn;

        // P, Q, R顺序对应X, Y, Z, 注意, R = -视线向量

        return [
            pxn, qxn, -rxn, 0,
            pyn, qyn, -ryn, 0,
            pzn, qzn, -rzn, 0,
            -eye1 * pxn - eye2 * pyn - eye3 * pzn,
            -eye1 * qxn - eye2 * qyn - eye3 * qzn,
            eye1 * rxn + eye2 * ryn + eye3 * rzn,
            1
        ];
    }

    /**
     * 透视投影矩阵
     * @param {number} fov 
     * @param {number} aspect 
     * @param {number} near 
     * @param {number} far 
     * @returns 
     */
    static perspective(fov, aspect, near, far) {
        const radius = (fov / 2) * Math.PI / 180;
        const tan = Math.tan(radius);
        return [
            1 / (aspect * tan), 0, 0, 0,
            0, 1 / tan, 0, 0,
            0, 0, -1 * (far + near) / (far - near), -1,
            0, 0, -2 * near * far / (far - near), 0
        ];
    }

    /**
     * 正射投影矩阵
     * @param {number} left 
     * @param {number} right 
     * @param {number} bottom 
     * @param {number} top 
     * @param {number} near 
     * @param {number} far 
     * @returns {number[]}
     */
    static orth(left, right, bottom, top, near, far) {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 0, -2 / (far - near),
            -(right + left) / (right - left),
            -(top + bottom) / (top - bottom),
            -(far + near) / (far - near), 1
        ];
    }
}
