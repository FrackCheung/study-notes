import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_Position;
    attribute vec2 a_Texcoord;
    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;
    varying vec2 v_Texcoord;
    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        v_Texcoord = a_Texcoord;
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec2 v_Texcoord;
    uniform sampler2D u_Sampler;
    const vec3 lightDirection = vec3(1.0, 1.0, 1.0);
    void main() {

        // 这里的坐标不需要归一化, 因为GeometryService给出的纹理坐标就是[0, 1]的
        vec4 color = texture2D(u_Sampler, v_Texcoord.xy);
        gl_FragColor = color;
    }
`;

/**
 * 创建视频纹理
 * @param {WebGLRenderingContext} gl 
 * @returns {Promise<HTMLVideoElement>}
 */
const createVideoTexture = async gl => {
    const video = await WebGLService.getVideo('../assets/video/video.mp4');
    const texture = gl.createTexture();
    if (!texture) {
        throw new Error('Failed to create texture.');
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return video;
}

/**
 * 更新视频纹理
 * @param {WebGLRenderingContext} gl 
 * @param {HTMLVideoElement} video 
 */
const updateVideoTexture = (gl, video) => {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.activeTexture(gl.TEXTURE0);
}

/**
 * 创建悬浮提示
 */
const createTips = () => {
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.position = 'absolute';
    span.style.left = '10px';
    span.style.top = '10px';
    span.style.fontSize = '20px';
    span.style.fontWeight = 'bold';
    span.textContent = '点击屏幕任意位置, 可切换静音/声音';
    document.body.appendChild(span);
};

const gl = WebGLService.getContext('.cs');
const program = WebGLService.getProgram(gl, V_SOURCE, F_SOURCE);

const points = GeometryService.getCubePoints(0.4);
const textureCoord = GeometryService.getCubeTextureCoord();

(async () => {
    const video = await createVideoTexture(gl);
    document.body.removeChild(document.querySelector('.load-data'));
    createTips();

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    
    let degree = 0;
    WebGLService.setAttribute(gl, program, 'a_Position', points, 3);
    WebGLService.setAttribute(gl, program, 'a_Texcoord', textureCoord, 2);
    WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, -3, 0, 0, 0, 0, 1, 0), 'matrix4');

    const render = () => {
        WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const aspect = gl.canvas.width / gl.canvas.height;
        WebGLService.setUniform(gl, program, 'u_Model', MatrixService.cubeRotate(degree), 'matrix4');
        WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, aspect, 1, 100), 'matrix4');

        updateVideoTexture(gl, video);
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 0.5) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()