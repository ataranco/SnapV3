import * as THREE from 'three'

var scene;
var pointGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var pointMaterial = new THREE.MeshBasicMaterial( {color: 0x800080, transparent : true, wireframe : true} );       
var playermesh = null;
var points = [];
var tolerance = 0;
var raycaster = new THREE.Raycaster();
var colliders;
var camera;
var posX = 0;
var posY = 0;

export function init(_scene, _colliders, _camera){
    scene = _scene;
    colliders = _colliders;
    camera = _camera;
    document.body.addEventListener('pointermove', ((event) => { onDocumentMouseMove(event) }), false);
}

export function generateSnapPoint(objectSize){
    let raycastHit = raycastPointToWorld();
    console.log("raycastHit",raycastHit);
    if(raycastHit != null){
        let direction = new THREE.Vector3(0,0,0);
        direction.copy(raycastHit.normal);
        let left = new THREE.Vector3(-1,0,0);
        let rigth = new THREE.Vector3(1,0,0);
        let back = new THREE.Vector3(0,0,-1);
        let front = new THREE.Vector3(0,0,1);
        let up = new THREE.Vector3(0,1,0);
        let down = new THREE.Vector3(0,-1,0);

        let distance1 = direction.distanceTo(left);
        let distance2 = direction.distanceTo(rigth);
        let distance3 = direction.distanceTo(back);
        let distance4 = direction.distanceTo(front);
        let distance5 = direction.distanceTo(up);
        let distance6 = direction.distanceTo(down);

        let minDistance = Math.min(distance1, distance2, distance3, distance4, distance5, distance6);
        let distances = [distance1, distance2, distance3, distance4, distance5, distance6];
        let index = distances.indexOf(minDistance);
        let directions = [left, rigth, back, front, up, down];

        cleanSnap();
        let invertedDirection = directions[index].clone().negate();
        console.log("index",index);
        if(index == 4){
            generateFloorSnapPoint(raycastHit , objectSize, invertedDirection);
        }else if(index != 5){                
            generateWallSnapPoint(raycastHit , objectSize, index, invertedDirection);
        }
    }
}

function generateFloorSnapPoint( raycastHit , objectSize, direction){  
    if(raycastHit != null){
        let point = new THREE.Vector3(0,0,0);
        let sizeZ = objectSize.z/2;
        point.copy(raycastHit.point);
        point.y += objectSize.y / 2;
        tolerance = objectSize.y / 2;
        let distanceFront = getRayDistance(point.clone(), new THREE.Vector3(0,0,1));   
        let distanceBack = getRayDistance(point.clone(), new THREE.Vector3(0,0,-1)); 

        if(distanceFront == null){
            distanceFront = 5;
        }
        if(distanceBack == null){
            distanceBack = 5;
        }

        let pointFront = new THREE.Vector3(0,0,0);
        let pointBack = new THREE.Vector3(0,0,0);
        pointFront.copy(point);
        pointBack.copy(point);
        pointFront.z += distanceFront - sizeZ;
        pointBack.z -= distanceBack - sizeZ;
        interpolatePoints(point, pointFront, 0.5, 5, direction);       
        interpolatePoints(point, pointBack, 0.5, 5, direction);             
        let pointsLength = points.length;
        for (let i = 0; i < pointsLength; i++) {   
            let point_ = new THREE.Vector3(0,0,0);
            point_.copy(points[i].position)
            let distanceR = getRayDistance(point_, new THREE.Vector3(1,0,0));   
            let distanceL = getRayDistance(point_, new THREE.Vector3(-1,0,0));   

            if(distanceR == null){
                distanceR = 5;
            }  
            if(distanceL == null){
                distanceL = 5;
            }   

            let pointLeft_ = new THREE.Vector3(0,0,0);
            let pointRight_ = new THREE.Vector3(0,0,0);                
            pointLeft_.copy(point_);
            pointRight_.copy(point_);
            pointLeft_.x -=distanceL - objectSize.x/2;
            pointRight_.x +=distanceR - objectSize.x/2;
            interpolatePoints(point_, pointLeft_, 0.5, 5,direction);  
            interpolatePoints(point_, pointRight_, 0.5, 5,direction);  
        } 
                
    }  
}

function generateWallSnapPoint( raycastHit , objectSize, directionID, direction){ 
    if(raycastHit != null){
        let point = new THREE.Vector3(0,0,0);
        point.copy(raycastHit.point);
        switch(directionID){
            case 0:
                point.x -= objectSize.x / 2;
                tolerance = objectSize.x / 2;
            break;
            case 1:
                point.x += objectSize.x / 2;
                tolerance = objectSize.x / 2;
            break;
            case 2:
                point.z -= objectSize.z / 2;
                tolerance = objectSize.z / 2;
            break;
            case 3:
                point.z += objectSize.z / 2;
                tolerance = objectSize.z / 2;
            break;
        }
        let distanceUp = getRayDistance(point, new THREE.Vector3(0,1,0));   
        let distanceDown = getRayDistance(point, new THREE.Vector3(0,-1,0)); 
        console.log("distanceUp, distanceDown",distanceUp, distanceDown);
        if(distanceUp == null){
            distanceUp = 5;
        } 
        if(distanceDown == null){
            distanceDown = 5;
        } 
        console.log("distanceUp2, distanceDown2",distanceUp, distanceDown);
        let pointUp = new THREE.Vector3(0,0,0);
        let pointDown = new THREE.Vector3(0,0,0);
        pointUp.copy(point);
        pointDown.copy(point);
        pointUp.y += distanceUp - objectSize.y/2;            
        pointDown.y -= distanceDown - objectSize.y/2;
        console.log(directionID);
        if(distanceUp) interpolatePoints(point, pointUp, 0.5, 5, direction);       
        if(distanceDown) interpolatePoints(point, pointDown, 0.5, 5, direction);  
        let pointsLength = points.length;
        for (let i = 0; i < pointsLength; i++) {  
            if(directionID < 2) {
                let point = new THREE.Vector3(0,0,0);
                point.copy(points[i].position)
                let distanceF = getRayDistance(point, new THREE.Vector3(0,0,1));   
                let distanceB = getRayDistance(point, new THREE.Vector3(0,0,-1)); 

                if(distanceF == null){
                    distanceF = 5;
                }

                if(distanceB == null){
                    distanceB = 5;
                }

                let pointFront_ = new THREE.Vector3(0,0,0);
                let pointBack_ = new THREE.Vector3(0,0,0);   
                pointFront_.copy(point);
                pointBack_.copy(point);
                pointFront_.z +=distanceF - objectSize.z/2;
                pointBack_.z -=distanceB - objectSize.z/2;   
                console.log(point, pointFront_);           
                console.log(point, pointBack_);      
                interpolatePoints(point, pointFront_, 0.5, 5, direction);  
                interpolatePoints(point, pointBack_, 0.5, 5, direction); 
            }else{
                let point = new THREE.Vector3(0,0,0);
                point.copy(points[i].position)
                let distanceR = getRayDistance(point, new THREE.Vector3(1,0,0));   
                let distanceL = getRayDistance(point, new THREE.Vector3(-1,0,0));   
                
                if(distanceR == null){
                    distanceR = 5;
                }

                if(distanceL == null){
                    distanceL = 5;
                }
                
                let pointLeft_ = new THREE.Vector3(0,0,0);
                let pointRight_ = new THREE.Vector3(0,0,0);                
                pointLeft_.copy(point);
                pointRight_.copy(point);
                pointLeft_.x -=distanceL - objectSize.x/2;
                pointRight_.x +=distanceR - objectSize.x/2;
                interpolatePoints(point, pointLeft_, 0.5, 5, direction);  
                interpolatePoints(point, pointRight_, 0.5, 5, direction); 
            }
        }  
                        
    }  
}

function interpolatePoints(vectorA , vectorB , distance, radius, direction = null){
    let distanc = distance;
    let distanceTotal = vectorA.distanceTo(vectorB);
    let steps = Math.floor(distanceTotal / distanc);

    for (let i = 0; i <= steps; i++) {            
        let t = (i * distanc) / distanceTotal;
        let interpolatedPoint = new THREE.Vector3().lerpVectors(vectorA, vectorB, t);
        if(vectorA.distanceTo(interpolatedPoint) < radius){
            if(direction){
                let distance = getRayDistance(interpolatedPoint, direction); 
                if(distance) {
                    if(distance <= tolerance + 0.05){
                        points.push( createPoint(interpolatedPoint) );
                    }                    
                }                    
            }else{
                points.push( createPoint(interpolatedPoint) );
            }            
        }            
    }
}

function getRayDistance(point, normal) {  
    let pointRay = new THREE.Vector3(0,0,0);
    let direction = new THREE.Vector3(0,0,0);

    pointRay.copy(point);
    direction.copy(normal);

    let raycastHit = raycastPoint(pointRay,direction, );   
    if(raycastHit == null){
        return null;
    }else{    
        let distance = point.distanceTo(raycastHit.point);
        return distance;
    }
}

function createPoint(point){
    if(playermesh == null){
        playermesh = new THREE.Mesh(
            pointGeometry,
            pointMaterial
        );
    }       
    let clone = playermesh.clone();
    scene.add(clone);  
    clone.position.copy(point);
    return clone;
}

function cleanSnap() {
    for (let i = 0; i < points.length; i++) {            
        scene.remove(points[i]);        
    }
    points = [];
}

//HELPER FOR RAYCAST
function raycastPoint(origin, direction) {
    let raycastHit = null;
    raycaster.set(origin, direction);
    let intersects = raycaster.intersectObjects(colliders);

    if (intersects.length > 0) {
        raycastHit = {
            point: intersects[0].point,
            mesh: intersects[0].object,
            normal: intersects[0].face.normal
        };
    }    
    return raycastHit;
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    posX = (event.offsetX / document.body.clientWidth) * 2 - 1;
    posY = -(event.offsetY / document.body.clientHeight) * 2 + 1;
}

function raycastPointToWorld() {
    let raycastHit = null;
    let mousePos = new THREE.Vector2();
    mousePos.x = posX;
    mousePos.y = posY;
    
    camera.updateMatrixWorld();
    raycaster.setFromCamera(mousePos.clone(), camera);

    
    
    let intersects = raycaster.intersectObjects(colliders);
    

    if (intersects.length > 0) {
        raycastHit = {
            point: intersects[0].point,
            mesh: intersects[0].object,
            normal: intersects[0].face.normal
        };
    }    
    return raycastHit;
}