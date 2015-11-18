(function() {

var scene, camera, renderer;
var geometry, material, mesh;

var size = 15;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 30;

    geometry = createBufferPointCloud();
    material = new THREE.PointsMaterial( { size: 0.1, vertexColors: THREE.VertexColors } );

    mesh = new THREE.Points( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    
    

}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.01;

    renderer.render( scene, camera );

}

function createPointCloud() {
    var geometry = new THREE.Geometry();
    var points = [];
    for (var z = -size; z <= size; z++) {
        var plane = [];
        for (var y = -size; y <= size; y++) {
            var line = [];
            for (var x = -size; x <= size; x++) {
                
                var val = Math.max(0, ((size*size) - (x*x + y*y + z*z)) / (size*size));
                
                geometry.vertices.push(new THREE.Vector3(x, y, z));
                geometry.colors.push(new THREE.Color((1-val)/2, val, 0));
                
                line.push(0);
            }
            plane.push(line);
        }
        points.push(plane);
    }
    
    return geometry;
}


function createBufferPointCloud() {
    var geometry = new THREE.BufferGeometry();
    
    var arraySize = Math.pow(size*2+1, 3) * 3;
    var positions = new Float32Array(arraySize);
    var colors = new Float32Array(arraySize);
    var points = [];
    var counter = 0;
    for (var z = -size; z <= size; z++) {
        var plane = [];
        for (var y = -size; y <= size; y++) {
            var line = [];
            for (var x = -size; x <= size; x++) {
                
                var val = Math.max(0, ((size*size) - (x*x + y*y + z*z)) / (size*size));
                
                positions[counter*3] = x;
                positions[counter*3+1] = y;
                positions[counter*3+2] = z;
                
                colors[counter*3] = (1-val) / 2;
                colors[counter*3+1] = val;
                colors[counter*3+2] = 0;
                
                line.push(val);
                
                counter++;
            }
            plane.push(line);
        }
        points.push(plane);
    }
    
    console.log(counter, arraySize);
    
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    
    return geometry;
}



})();
