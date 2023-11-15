import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_Position;
    varying vec3 v_Position;

    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;

    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        v_Position = a_Position;
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec3 v_Position;
    uniform samplerCube u_Sampler;

    void main() {
        gl_FragColor = textureCube(u_Sampler, normalize(v_Position.xyz));
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
    const posX = await getImage('../assets/earth/posX.png');
    const posY = await getImage('../assets/earth/posY.png');
    const posZ = await getImage('../assets/earth/posZ.png');
    const negX = await getImage('../assets/earth/negX.png');
    const negY = await getImage('../assets/earth/negY.png');
    const negZ = await getImage('../assets/earth/negZ.png');

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

const points = GeometryService.getSpherePoints(0.5, 50, 100);

let degree = 0;

(async () => {
    await resolveCubeTexture(gl);
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const render = () => {
        WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const { width, height } = gl.canvas;

        WebGLService.setAttribute(gl, program, 'a_Position', points, 3);
        WebGLService.setUniform(gl, program, 'u_Model', MatrixService.rotateY(degree), 'matrix4');
        WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, width / height, 1, 100), 'matrix4');
        WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, 5, 0, 0, 0, 0, 1, 0), 'matrix4');
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 0.8) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()
