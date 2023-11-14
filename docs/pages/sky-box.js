import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_position;
    uniform mat4 u_inverseVP;
    varying vec4 v_position;
    void main() {
        gl_Position = vec4(a_position, 1.0);
        v_position = u_inverseVP * vec4(a_position, 1.0);
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec4 v_position;
    uniform samplerCube u_sampler;
    void main() {
        gl_FragColor = textureCube(u_sampler, normalize(v_position.xyz));
    }
`;

/**
 * 获取图片
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
const getImage = src => new Promise(resolve => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        resolve(image);
    }
});

/**
 * 处理立方体纹理
 * @param {WebGLRenderingContext} gl 
 */
const resolveCubeTexture = async (gl) => {
    const posX = await getImage('../assets/mountain/posX.png');
    const posY = await getImage('../assets/mountain/posY.png');
    const posZ = await getImage('../assets/mountain/posZ.png');
    const negX = await getImage('../assets/mountain/negX.png');
    const negY = await getImage('../assets/mountain/negY.png');
    const negZ = await getImage('../assets/mountain/negZ.png');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.activeTexture(gl.TEXTURE0);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posX);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posY);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posZ);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negX);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negY);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negZ);

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}

const gl = WebGLService.getContext('.cs');
const program = WebGLService.getProgram(gl, V_SOURCE, F_SOURCE);

// const points = GeometryService.getCubePoints(1);

const points = new Float32Array([
    -1, -1, -1, 1, -1, -1, 1, 1, -1,
    1, 1, -1, -1, 1, -1, -1, -1, -1
]);

let degree = 0;

(async () => {
    await resolveCubeTexture(gl);
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const render = () => {
        WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const radius = degree * Math.PI / 180;
        const cos = Math.cos(radius);
        const sin = Math.sin(radius);
        const { width, height } = gl.canvas;

        const viewMatrix = MatrixService.lookAt(0, 0, 0, sin, 0, -cos, 0, 1, 0);
        const projectionMatrix = MatrixService.perspective(45, width / height, 0.1, 100);
        const inverse = MatrixService.inverse(MatrixService.multiply(viewMatrix, projectionMatrix));
        WebGLService.setUniform(gl, program, 'u_inverseVP', inverse, 'matrix4');
        WebGLService.setAttribute(gl, program, 'a_position', points, 3);
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 0.05) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()