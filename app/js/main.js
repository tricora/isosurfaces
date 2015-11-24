(function () {

    var slider;

    var values;
    var scene, camera, renderer;
    var geometry, material, rootNode, isoMesh, isoMaterial;

    var size = 20;
    var randomizer = 0.05;
    var width = 800, height = 800;
    

    init();
    animate();

    function init() {
        
        

        scene = new THREE.Scene();
        rootNode = new THREE.Object3D();

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
        camera.position.z = size*2;

        // LIGHT
        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );
        
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 1, 1, 0 );
        scene.add( directionalLight );

        geometry = createBufferPointCloud();
        material = new THREE.PointsMaterial({size: 0.1, vertexColors: THREE.VertexColors});

        mesh = new THREE.Points(geometry, material);
        rootNode.add( mesh );

        values = createValues();
        
        scene.add(rootNode);
        
        var obj = new THREE.Object3D();
        



        renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        document.body.appendChild(renderer.domElement);

        slider = document.getElementById('isolevelSlider');
        slider.oninput = updateIsoLevel;
        updateIsoLevel();
        
        renderer.render(scene, camera);
    }
    
    function updateIsoLevel() {
        rootNode.remove(isoMesh);
        
        var isoGeom = marchingCube(values, slider.value);

        isoGeom.computeFaceNormals();
        isoGeom.computeVertexNormals();

        isoMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, side: THREE.DoubleSide});

        isoMesh = new THREE.Mesh(isoGeom, isoMaterial);
        
        var posOffset = -size;
        
        isoMesh.position.x = posOffset;
        isoMesh.position.y = posOffset;
        isoMesh.position.z = posOffset;
        
        rootNode.add(isoMesh);
    };

    function animate() {

        requestAnimationFrame(animate);

        rootNode.rotation.x += 0.001;
        rootNode.rotation.y += 0.01;

        renderer.render(scene, camera);

    }

    function createPointCloud() {
        var geometry = new THREE.Geometry();
        var points = [];
        for (var z = -size; z <= size; z++) {
            var plane = [];
            for (var y = -size; y <= size; y++) {
                var line = [];
                for (var x = -size; x <= size; x++) {

                    var val = Math.max(0, ((size * size) - (x * x + y * y + z * z)) / (size * size));

                    geometry.vertices.push(new THREE.Vector3(x, y, z));
                    geometry.colors.push(new THREE.Color((1 - val) / 2, val, 0));

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

        var arraySize = Math.pow(size * 2 + 1, 3) * 3;
        var positions = new Float32Array(arraySize);
        var colors = new Float32Array(arraySize);
        var points = [];
        var counter = 0;
        for (var z = -size; z <= size; z++) {
            var plane = [];
            for (var y = -size; y <= size; y++) {
                var line = [];
                for (var x = -size; x <= size; x++) {

                    var val = Math.max(0, ((size * size) - (x * x + y * y + z * z)) / (size * size));

                    positions[counter * 3] = x;
                    positions[counter * 3 + 1] = y;
                    positions[counter * 3 + 2] = z;

                    colors[counter * 3] = (1 - val) / 2;
                    colors[counter * 3 + 1] = val;
                    colors[counter * 3 + 2] = 0;

                    line.push(val);

                    counter++;
                }
                plane.push(line);
            }
            points.push(plane);
        }

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeBoundingBox();

        return geometry;
    }

    function createValues() {
        var points = new Float32Array(Math.pow(size*2+1, 3));
        var size2 = size*size;
        var i = 0;
        for (var z = -size; z <= size; z++) {
            for (var y = -size; y <= size; y++) {
                for (var x = -size; x <= size; x++) {

                    var val = (size2 - (x * x + y * y + z * z)) / (size * size);
                    val += Math.random()*randomizer - randomizer/2;

                    points[i++] = val;
                }
            }
        }

        return points;
    }



})();
