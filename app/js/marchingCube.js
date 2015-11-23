/*
    adapted from:

        Three.js "tutorials by example"
        Author: Lee Stemkoski
        Date: July 2013 (three.js v59dev)
*/

var marchingCube = function(values, isolevel) {
    
    var geometry = new THREE.Geometry();
    var vertexIndex = 0;
    
    var size = Math.cbrt(values.length);
    
    var size2 = size*size;
    
    var vlist = new Array(12);
    
    for (var z = 0; z < size-1; z++) {
        for (var y = 0; y < size-1; y++) {
            for (var x = 0; x < size-1; x++) {
                var vec = new THREE.Vector3(x, y, z),
                    vecX = new THREE.Vector3(x+1, y, z),
                    vecY = new THREE.Vector3(x, y+1, z),
                    vecXY = new THREE.Vector3(x+1, y+1, z),
                    vecZ = new THREE.Vector3(x, y, z+1),
                    vecXZ = new THREE.Vector3(x+1, y, z+1),
                    vecYZ = new THREE.Vector3(x, y+1, z+1),
                    vecXYZ = new THREE.Vector3(x+1, y+1, z+1);
                        
                
                // index of base point, and also adjacent points on cube
		var p    = x + size * y + size2 * z,
			px   = p   + 1,
			py   = p   + size,
			pxy  = py  + 1,
			pz   = p   + size2,
			pxz  = px  + size2,
			pyz  = py  + size2,
			pxyz = pxy + size2;
		
		// store scalar values corresponding to vertices
		var value0 = values[ p    ],
			value1 = values[ px   ],
			value2 = values[ py   ],
			value3 = values[ pxy  ],
			value4 = values[ pz   ],
			value5 = values[ pxz  ],
			value6 = values[ pyz  ],
			value7 = values[ pxyz ];
		
		// place a "1" in bit positions corresponding to vertices whose
		//   isovalue is less than given constant.
		
		var cubeindex = 0;
		if ( value0 < isolevel ) cubeindex |= 1;
		if ( value1 < isolevel ) cubeindex |= 2;
		if ( value2 < isolevel ) cubeindex |= 8;
		if ( value3 < isolevel ) cubeindex |= 4;
		if ( value4 < isolevel ) cubeindex |= 16;
		if ( value5 < isolevel ) cubeindex |= 32;
		if ( value6 < isolevel ) cubeindex |= 128;
		if ( value7 < isolevel ) cubeindex |= 64;
		
		// bits = 12 bit number, indicates which edges are crossed by the isosurface
		var bits = THREE.edgeTable[ cubeindex ];
		
		// if none are crossed, proceed to next iteration
		if ( bits === 0 ) continue;
		
		// check which edges are crossed, and estimate the point location
		//    using a weighted average of scalar values at edge endpoints.
		// store the vertex in an array for use later.
		var mu = 0.5; 
		
		// bottom of the cube
		if ( bits & 1 )
		{		
			mu = ( isolevel - value0 ) / ( value1 - value0 );
			vlist[0] = vec.clone().lerp( vecX, mu );
		}
		if ( bits & 2 )
		{
			mu = ( isolevel - value1 ) / ( value3 - value1 );
			vlist[1] = vecX.clone().lerp( vecXY, mu );
		}
		if ( bits & 4 )
		{
			mu = ( isolevel - value2 ) / ( value3 - value2 );
			vlist[2] = vecY.clone().lerp( vecXY, mu );
		}
		if ( bits & 8 )
		{
			mu = ( isolevel - value0 ) / ( value2 - value0 );
			vlist[3] = vec.clone().lerp( vecY, mu );
		}
		// top of the cube
		if ( bits & 16 )
		{
			mu = ( isolevel - value4 ) / ( value5 - value4 );
			vlist[4] = vecZ.clone().lerp( vecXZ, mu );
		}
		if ( bits & 32 )
		{
			mu = ( isolevel - value5 ) / ( value7 - value5 );
			vlist[5] = vecXZ.clone().lerp( vecXYZ, mu );
		}
		if ( bits & 64 )
		{
			mu = ( isolevel - value6 ) / ( value7 - value6 );
			vlist[6] = vecYZ.clone().lerp( vecXYZ, mu );
		}
		if ( bits & 128 )
		{
			mu = ( isolevel - value4 ) / ( value6 - value4 );
			vlist[7] = vecZ.clone().lerp( vecYZ, mu );
		}
		// vertical lines of the cube
		if ( bits & 256 )
		{
			mu = ( isolevel - value0 ) / ( value4 - value0 );
			vlist[8] = vec.clone().lerp( vecZ, mu );
		}
		if ( bits & 512 )
		{
			mu = ( isolevel - value1 ) / ( value5 - value1 );
			vlist[9] = vecX.clone().lerp( vecXZ, mu );
		}
		if ( bits & 1024 )
		{
			mu = ( isolevel - value3 ) / ( value7 - value3 );
			vlist[10] = vecXY.clone().lerp( vecXYZ, mu );
		}
		if ( bits & 2048 )
		{
			mu = ( isolevel - value2 ) / ( value6 - value2 );
			vlist[11] = vecY.clone().lerp( vecYZ, mu );
		}
		
		// construct triangles -- get correct vertices from triTable.
		var i = 0;
		cubeindex <<= 4;  // multiply by 16... 
		// "Re-purpose cubeindex into an offset into triTable." 
		//  since each row really isn't a row.
		 
		// the while loop should run at most 5 times,
		//   since the 16th entry in each row is a -1.
		while ( THREE.triTable[ cubeindex + i ] != -1 ) 
		{
			var index1 = THREE.triTable[cubeindex + i];
			var index2 = THREE.triTable[cubeindex + i + 1];
			var index3 = THREE.triTable[cubeindex + i + 2];
			
			geometry.vertices.push( vlist[index1].clone() );
			geometry.vertices.push( vlist[index2].clone() );
			geometry.vertices.push( vlist[index3].clone() );
			var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
			geometry.faces.push( face );

			//geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

			vertexIndex += 3;
			i += 3;
		}
                
            }
        }
        
    }
    
    return geometry;
    
};