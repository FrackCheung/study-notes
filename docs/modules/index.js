import { GeometryService } from "./geometry.service.js";
import { MatrixService } from "./matrix.service.js";
import { WebGLService } from "./webgl.service.js";

const V_SOURCE = `
    attribute vec3 a_Position;
    attribute vec3 a_Normal;
    varying vec3 v_Normal;
    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform mat4 u_Projection;

    void main() {
        gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
        v_Normal = mat3(u_Model) * a_Normal;
    }
`;
const F_SOURCE = `
    precision mediump float;
    varying vec3 v_Normal;
    const vec3 lightDirection = vec3(1.0, 1.0, 1.0);
    const vec3 vertexColor = vec3(0.0, 1.0, 0.11);

    void main() {
        float light = max(0.3, dot(normalize(v_Normal), normalize(lightDirection)));
        gl_FragColor = vec4(vertexColor * light, 1.0);
    }
`;

const gl = WebGLService.getContext('.cs');
const program = WebGLService.getProgram(gl, V_SOURCE, F_SOURCE);

const cubePoints = GeometryService.getCubePoints(0.2);
const cubeNormals = GeometryService.getCubeNormals();

const spherePoints = GeometryService.getSpherePoints(0.3, 20, 40);
const sphereNormals = spherePoints;

let degree = 0;

const render = () => {
    gl.useProgram(program);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    WebGLService.resizeCanvas(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
    const { width, height } = gl.canvas;
    WebGLService.setUniform(gl, program, 'u_Projection', MatrixService.perspective(45, width / height, 1, 100), 'matrix4');
    WebGLService.setUniform(gl, program, 'u_View', MatrixService.lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0), 'matrix4');

    // 立方体
    const cubeModel = MatrixService.multiply(MatrixService.cubeRotate(degree), MatrixService.translate(0.0, 0.5, 0.0));
    WebGLService.setAttribute(gl, program, 'a_Position', cubePoints, 3);
    WebGLService.setAttribute(gl, program, 'a_Normal', cubeNormals, 3);
    WebGLService.setUniform(gl, program, 'u_Model', cubeModel, 'matrix4');
    gl.drawArrays(gl.TRIANGLES, 0, cubePoints.length / 3);

    // 立方体
    const sphereModel = MatrixService.multiply(MatrixService.rotateY(degree), MatrixService.translate(0.0, -0.5, 0.0));
    WebGLService.setAttribute(gl, program, 'a_Position', spherePoints, 3);
    WebGLService.setAttribute(gl, program, 'a_Normal', sphereNormals, 3);
    WebGLService.setUniform(gl, program, 'u_Model', sphereModel, 'matrix4');
    gl.drawArrays(gl.LINES, 0, spherePoints.length / 3);

    degree = (degree + 1.0) % 36000;
    requestAnimationFrame(render);
};

render();
