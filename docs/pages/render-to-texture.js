import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_Position;
    attribute vec3 a_Normal;
    attribute vec2 a_Tex;
    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;
    varying vec3 v_Normal;
    varying vec2 v_Tex;
    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        v_Normal = mat3(u_Model) * a_Normal;
        v_Tex = a_Tex;
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec3 v_Normal;
    varying vec2 v_Tex;
    uniform sampler2D u_Sampler;
    const vec3 lightDirection = vec3(1.0, 1.0, 1.0);
    void main() {
        vec4 color = texture2D(u_Sampler, v_Tex);
        float light = max(0.5, dot(normalize(v_Normal), normalize(lightDirection)));
        gl_FragColor = vec4(color.rgb * light, 1.0);
    }
`;

const WIDTH = 1024;
const HEIGHT = 1024;

/**
 * 创建纹理对象
 * @param {WebGLRenderingContext} gl 
 * @param {number} width 
 * @param {number} height 
 * @param {ArrayBuffer | null} pixels 
 * @returns {WebGLTexture}
 */
const createDataTexture = (gl, width, height, pixels) => {
    const texture = gl.createTexture();
    if (!texture) {
        throw new Error('Failed to create texture.');
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

/**
 * 使用纹理, 在绘制时需要反复切换纹理
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLTexture} texture 
 */
const useTexture = (gl, texture) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);
}

/**
 * 创建渲染缓冲, 作为帧缓冲深度关联对象
 * @param {WebGLRenderingContext} gl 
 * @param {number} width
 * @param {number} height
 * @returns {WebGLRenderbuffer}
 */
const createRenderBuffer = (gl, width, height) => {
    const renderbuffer = gl.createRenderbuffer();
    if (!renderbuffer) {
        throw new Error('Failed to create render buffer.');
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    // 该渲染缓冲将作为深度缓冲区
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    return renderbuffer;
}

/**
 * 创建帧缓冲
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLTexture} texture 
 * @param {WebGLRenderbuffer} renderbuffer 
 * @returns {WebGLFramebuffer}
 */
const createFrameBuffer = (gl, texture, renderbuffer) => {
    const frameBuffer = gl.createFramebuffer();
    if (!frameBuffer) {
        throw new Error('Failed to create frame buffer.');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    // 设置深度关联对象
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    // 设置颜色关联对象
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Failed to config color or depth attachment.')
    }
    return frameBuffer;
}

const gl = WebGLService.getContext('.cs');
const program = WebGLService.getProgram(gl, V_SOURCE, F_SOURCE);

const points = GeometryService.getCubePoints(0.4);
const normals = GeometryService.getCubeNormals();
const tex = GeometryService.getCubeTextureCoord();

// 帧缓冲纹理, 用于绘图
const framebufferTexture = createDataTexture(gl, WIDTH, HEIGHT, null);

// 魔方纹理, 用于呈现
const magicTexture = createDataTexture(gl, 3, 3, new Uint8Array([
    255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
    0, 255, 0, 255, 0, 0, 255, 255, 255, 0, 0, 255,
    0, 0, 255, 255, 255, 0, 0, 255, 0, 255, 0, 255
]));

const renderbuffer = createRenderBuffer(gl, WIDTH, HEIGHT);
const framebuffer = createFrameBuffer(gl, framebufferTexture, renderbuffer);

(() => {
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    // 不变的数据可以预先设置
    WebGLService.setAttribute(gl, program, 'a_Position', points, 3);
    WebGLService.setAttribute(gl, program, 'a_Normal', normals, 3);
    WebGLService.setAttribute(gl, program, 'a_Tex', tex, 2);
    WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0), 'matrix4');
    let degree = 0;
    const render = () => {
        WebGLService.setUniform(gl, program, 'u_Model', MatrixService.cubeRotate(degree), 'matrix4');

        // 在帧缓冲中绘制
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.clearColor(0.81, 1, 0.11, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        WebGLService.resizeCanvas(gl, WIDTH, HEIGHT);
        useTexture(gl, magicTexture);
        WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, 1, 1, 100), 'matrix4');
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        // 在Canvas中绘制
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.clearColor(0.18, 0.18, 0.18, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        useTexture(gl, framebufferTexture);
        const { width, height } = gl.canvas;
        WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, width / height, 1, 100), 'matrix4');
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 1.0) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()