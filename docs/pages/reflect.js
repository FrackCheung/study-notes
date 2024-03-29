import { GeometryService } from "../modules/geometry.service.js";
import { MatrixService } from "../modules/matrix.service.js";
import { WebGLService } from "../modules/webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_Position;
    attribute vec3 a_Normal;
    varying vec3 v_Position;
    varying vec3 v_Normal;

    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;

    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        
        // 法向量和顶点位置只和模型矩阵有关, 传入片段着色器
        v_Normal = mat3(u_Model) * a_Normal;
        v_Position = mat3(u_Model) * a_Position;
    }
`;

const F_SOURCE = `
    precision mediump float;
    varying vec3 v_Position;
    varying vec3 v_Normal;
    uniform samplerCube u_Sampler;

    const vec3 eyePos = vec3(0.0, 0.0, 3.0);

    void main() {

        // from为入射光线, 即从视点指向顶点的向量
        vec3 from = normalize(v_Position - eyePos);
        vec3 normal = normalize(v_Normal);

        // reflect根据入射光线和法向量, 计算出反射向量
        vec3 to = reflect(from, normal);
        gl_FragColor = textureCube(u_Sampler, to);
    }
`;

/**
 * 处理立方体纹理
 * @param {WebGLRenderingContext} gl 
 */
const resolveCubeTexture = async (gl) => {
    const posX = await WebGLService.getImage('../assets/mountain/posX.jpg', 0);
    const posY = await WebGLService.getImage('../assets/mountain/posY.jpg', 1);
    const posZ = await WebGLService.getImage('../assets/mountain/posZ.jpg', 2);
    const negX = await WebGLService.getImage('../assets/mountain/negX.jpg', 3);
    const negY = await WebGLService.getImage('../assets/mountain/negY.jpg', 4);
    const negZ = await WebGLService.getImage('../assets/mountain/negZ.jpg', 5);
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

const points = GeometryService.getCubePoints(0.4);
const normals = GeometryService.getCubeNormals();

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
        WebGLService.setAttribute(gl, program, 'a_Normal', normals, 3);
        WebGLService.setUniform(gl, program, 'u_Model', MatrixService.cubeRotate(degree), 'matrix4');
        WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, width / height, 1, 100), 'matrix4');
        WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0), 'matrix4');
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

        degree = (degree + 0.5) % 36000;
        requestAnimationFrame(render);
    };
    render();
})()
