import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const SKYBOX_V_SOURCE = `
    attribute vec3 a_position;
    uniform mat4 u_inverseVP;
    varying vec4 v_position;
    void main() {
        gl_Position = vec4(a_position, 1.0);
        v_position = u_inverseVP * vec4(a_position, 1.0);
    }
`;

const SKYBOX_F_SOURCE = `
    precision mediump float;
    varying vec4 v_position;
    uniform samplerCube u_sampler;
    void main() {
        gl_FragColor = textureCube(u_sampler, normalize(v_position.xyz));
    }
`;

const REFLECT_V_SOURCE = `
    attribute vec3 a_Position;
    attribute vec3 a_Normal;
    varying vec3 v_Position;
    varying vec3 v_Normal;

    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;

    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        v_Normal = mat3(u_Model) * a_Normal;
        v_Position = mat3(u_Model) * a_Position;
    }
`;

const REFLECT_F_SOURCE = `
    precision mediump float;
    varying vec3 v_Position;
    varying vec3 v_Normal;
    uniform samplerCube u_Sampler;
    uniform vec3 u_eyePos;

    void main() {
        vec3 from = normalize(v_Position - u_eyePos);
        vec3 normal = normalize(v_Normal);
        vec3 to = reflect(from, normal);
        gl_FragColor = textureCube(u_Sampler, to);
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
const skyboxProgram = WebGLService.getProgram(gl, SKYBOX_V_SOURCE, SKYBOX_F_SOURCE);
const reflectProgram = WebGLService.getProgram(gl, REFLECT_V_SOURCE, REFLECT_F_SOURCE);

// const points = GeometryService.getCubePoints(1);

const skyboxPoints = new Float32Array([
    -1, -1, -1, 1, -1, -1, 1, 1, -1,
    1, 1, -1, -1, 1, -1, -1, -1, -1
]);

const reflectPoints = GeometryService.getCubePoints(0.5);
const reflectNormals = GeometryService.getCubeNormals();

let degree = 0;

(async () => {
    await resolveCubeTexture(gl);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const render = () => {
        WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        const { width, height } = gl.canvas;
        const radius = degree * Math.PI / 180;
        const cos = Math.cos(radius);
        const sin = Math.sin(radius);

        gl.useProgram(skyboxProgram);
        gl.disable(gl.DEPTH_TEST);
        const viewMatrix = MatrixService.lookAt(0, 0, 0, sin, 0, -cos, 0, 1, 0);
        const projectionMatrix = MatrixService.perspective(45, width / height, 0.1, 100);
        const inverse = MatrixService.inverse(MatrixService.multiply(viewMatrix, projectionMatrix));
        WebGLService.setUniform(gl, skyboxProgram, 'u_inverseVP', inverse, 'matrix4');
        WebGLService.setAttribute(gl, skyboxProgram, 'a_position', skyboxPoints, 3);
        gl.drawArrays(gl.TRIANGLES, 0, skyboxPoints.length / 3);

        gl.useProgram(reflectProgram);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        WebGLService.setAttribute(gl, reflectProgram, 'a_Position', reflectPoints, 3);
        WebGLService.setAttribute(gl, reflectProgram, 'a_Normal', reflectNormals, 3);
        WebGLService.setUniform(gl, reflectProgram, 'u_Model', MatrixService.cubeRotate(degree * 5), 'matrix4');
        WebGLService.setUniform(gl, reflectProgram, 'u_View', MatrixService.lookAt(-5 * sin, 0, 5 * cos, 0, 0, 0, 0, 1, 0), 'matrix4');
        WebGLService.setUniform(gl, reflectProgram, 'u_Projection', MatrixService.perspective(45, width / height, 0.1, 100), 'matrix4');
        WebGLService.setUniform(gl, reflectProgram, 'u_eyePos', [-5 * sin, 0, 5 * cos], 'vec3');
        gl.drawArrays(gl.TRIANGLES, 0, reflectPoints.length / 3);

        degree = (degree + 0.1) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()
