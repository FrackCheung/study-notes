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
        
        // 这里不应该使用模型矩阵, 因为我们希望该顶点始终都采样到同一个像素
        // 这样视图旋转时, 地球仪才能跟着旋转, 否则你将看到一个不会旋转的地球仪
        v_Position = a_Position;
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec3 v_Position;
    uniform samplerCube u_Sampler;

    void main() {

        // v_Position归一化与否都不影响结果, 因为textureCube会自动归一化
        // gl_FragColor = textureCube(u_Sampler, normalize(v_Position.xyz));
        gl_FragColor = textureCube(u_Sampler, v_Position.xyz);
    }
`;

/**
 * 处理立方体纹理
 * @param {WebGLRenderingContext} gl 
 */
const resolveCubeTexture = async (gl) => {
    const posX = await WebGLService.getImage('../assets/earth/posX.png', 0);
    const posY = await WebGLService.getImage('../assets/earth/posY.png', 1);
    const posZ = await WebGLService.getImage('../assets/earth/posZ.png', 2);
    const negX = await WebGLService.getImage('../assets/earth/negX.png', 3);
    const negY = await WebGLService.getImage('../assets/earth/negY.png', 4);
    const negZ = await WebGLService.getImage('../assets/earth/negZ.png', 5);
    document.body.removeChild(document.querySelector('.load-data'));
    
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

const points = GeometryService.getSpherePoints(0.65, 50, 100);

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
        WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0), 'matrix4');
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 0.8) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()
