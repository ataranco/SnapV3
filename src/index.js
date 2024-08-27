
let events = {};

let actions = {
    LOOK: 'look',
    GATHER: 'gather',
};

export function init(){
    
}

export function subscribe(_event, listener) {
    if (!events[_event]) {
       events[_event] = [];
    }
    events[_event].push(listener);
}

export function unsubscribe(_event, listener) {
    if (events[_event]) {
       events[_event] = events[_event].filter(existingListener => {
          return existingListener !== listener;
       });
    }
}

export function emit(_event, data) {
    if (events[_event]) {
       events[_event].forEach(listener => {
          listener(data);
       });
    }
}


//////////////////////Host Buttons

//Gather(list actorId, list position, adminPosition, lookPosition)
/**
 * Calculates the position of each actor in a circle and the look direction towards the adminPosition.
 * @param {Array} actorList - List of actors with IDs.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Array} - List of objects containing the position and look direction of each actor.
 */
export function gather(actorList, adminPosition) {
    const actorListaux = convertObjectToArray(actorList);
    const radius = 5; // Radius of the circle
    const angleStep = (2 * Math.PI) / actorListaux.length;

    return actorListaux.map((actor, index) => {
        const angle = angleStep * index;
        const position = calculatePosition(angle, radius, adminPosition);
        const lookDirection = adminPosition;
        
        return {
            id: actor.userId,
            actorNr: actor.actorNr,
            position,
            lookDirection,
            action:'gather'
        };
    });
}
/**
 * Convierte un objeto de actores en un array de actores.
 * @param {Object} actorObject - Objeto de actores.
 * @returns {Array} - Array de actores.
 */
function convertObjectToArray(actorObject) {
    return Object.values(actorObject);
}
/**
 * Calculates the position of an actor in a circle based on an angle and radius.
 * @param {number} angle - Angle in radians.
 * @param {number} radius - Radius of the circle.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Object} - Position of the actor in format { x, y, z }.
 */
function calculatePosition(angle, radius, adminPosition) {
    return {
        x: adminPosition.x + radius * Math.cos(angle),
        y: adminPosition.y - adminPosition.y, // Keep y constant for 2D visualization
        z: adminPosition.z + radius * Math.sin(angle)
    };
}

/**
 * Calculates the look direction of an actor towards the adminPosition.
 * @param {Object} position - Position of the actor in format { x, y, z }.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Object} - Look direction in format { x, y, z }.
 */
function calculateLookDirection(position, adminPosition) {
    return {
        x: adminPosition.x - position.x,
        y: adminPosition.y - position.y,
        z: adminPosition.z - position.z
    };
}

/**
 * Calculates the position of each actor in a star pattern.
 * @param {number} index - Index of the actor.
 * @param {number} total - Total number of actors.
 * @param {number} radius - Radius of the star.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Object} - Position of the actor.
 */
function calculateStarPosition(index, total, radius, adminPosition) {
    const points = 10; // Number of points in the star
    const angle = (index % points) * (2 * Math.PI / points) - Math.PI / 2;
    const innerRadius = radius / 2; // Inner radius of the star

    // Alternate between outer and inner radius
    const currentRadius = index % 2 === 0 ? radius : innerRadius;

    return {
        x: adminPosition.x + currentRadius * Math.cos(angle),
        y: adminPosition.y,
        z: adminPosition.z + currentRadius * Math.sin(angle)
    };
}
/**
 * Calculates the position of each actor in a circular pattern.
 * @param {number} index - Index of the actor.
 * @param {number} total - Total number of actors.
 * @param {number} radius - Radius of the circle.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Object} - Position of the actor.
 */
function calculateCircularPosition(index, total, radius, adminPosition) {
    const angle = index * (2 * Math.PI / total);
    return {
        x: adminPosition.x + radius * Math.cos(angle),
        y: adminPosition.y,
        z: adminPosition.z + radius * Math.sin(angle)
    };
}

/**
 * Calculates the position of each actor in a square pattern.
 * @param {number} index - Index of the actor.
 * @param {number} total - Total number of actors.
 * @param {number} sideLength - Length of the side of the square.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Object} - Position of the actor.
 */
function calculateSquarePosition(index, total, sideLength, adminPosition) {
    const corners = [
        { x: adminPosition.x - sideLength / 2, y: adminPosition.y, z: adminPosition.z - sideLength / 2 }, // Top-left
        { x: adminPosition.x + sideLength / 2, y: adminPosition.y, z: adminPosition.z - sideLength / 2 }, // Top-right
        { x: adminPosition.x + sideLength / 2, y: adminPosition.y, z: adminPosition.z + sideLength / 2 }, // Bottom-right
        { x: adminPosition.x - sideLength / 2, y: adminPosition.y, z: adminPosition.z + sideLength / 2 }  // Bottom-left
    ];

    if (index < 4) {
        return corners[index];
    }

    const actorsPerSide = Math.ceil((total - 4) / 4);
    const side = Math.floor((index - 4) / actorsPerSide);
    const positionInSide = (index - 4) % actorsPerSide;
    const segment = sideLength / (actorsPerSide + 1);
    const offset = (positionInSide + 1) * segment;

    let x, z;

    switch (side) {
        case 0: // Top side (from left to right)
            x = adminPosition.x - sideLength / 2 + offset;
            z = adminPosition.z - sideLength / 2;
            break;
        case 1: // Right side (from top to bottom)
            x = adminPosition.x + sideLength / 2;
            z = adminPosition.z - sideLength / 2 + offset;
            break;
        case 2: // Bottom side (from right to left)
            x = adminPosition.x + sideLength / 2 - offset;
            z = adminPosition.z + sideLength / 2;
            break;
        case 3: // Left side (from bottom to top)
            x = adminPosition.x - sideLength / 2;
            z = adminPosition.z + sideLength / 2 - offset;
            break;
    }

    return {
        x: x,
        y: adminPosition.y,
        z: z
    };
}

/**
 * Generates positions and look directions for actors based on the specified pattern.
 * @param {string} pattern - The pattern type ('star', 'circular', 'square').
 * @param {Array} actorList - List of actors with IDs.
 * @param {Object} adminPosition - Position of the admin in format { x, y, z }.
 * @returns {Array} - List of objects containing the position and look direction of each actor.
 */
export function Pattern(actorList, patternType,adminPosition) {
    const radius = 100;
    const sideLength = 200;
    const total = actorList.length;

    return actorList.map((actor, index) => {
        let position;
        switch (patternType) {
            case 'star':
                position = calculateStarPosition(index, total, radius, adminPosition);
                break;
            case 'circular':
                position = calculateCircularPosition(index, total, radius, adminPosition);
                break;
            case 'square':
                position = calculateSquarePosition(index, total, sideLength, adminPosition);
                break;
            default:
                throw new Error('Invalid pattern type');
        }
        const lookDirection = adminPosition;
        return {
            id: actor.id,
            position,
            lookDirection
        };
    });
}

//Look(list actorId, positionLook)
//esta funcion de abajo deberia recibir actorposition
export function Look(actorList, positionLook) {
    let actors = [];
    for (let i = 0; i < actorList.length; i++) {

        let parameters = {
            positionLook: positionLook
        };

        let actor = {
            action: actions.LOOK,
            id: actorList[i].id,
            parameters: parameters
        };
        actors.push(actor);
    }

    emit("sendActionToNetwork",{
        actors
    });

    return actors;
}

//Orbit(list actorId, objectOrbit)
export function Orbit(actorId, objectOrbit) {
    emit("Orbit",{
        actorId: actorId,
        objectOrbit: objectOrbit,
    });
}

//FollowMe(list actorId, adminId)
export function FollowMe(actorId, adminId) {
    emit("FollowMe",{
        actorId: actorId,
        adminId: adminId,
    });
}

//Freeze(list actorId, bool camera, bool position)
export function Freeze(actorId, camera, position) {
    emit("Freeze",{
        actorId: actorId,
        camera: camera,
        position: position
    });
}

//UnFreeze(list actorId, bool camera, bool position)
export function UnFreeze(actorId, camera, position) {
    emit("UnFreeze",{
        actorId: actorId,
        camera: camera,
        position: position
    });
}


//GoToScene(sceneId)
export function GoToScene(sceneId) {
    emit("GoToScene",{
        sceneId: sceneId
    });
}


//////////////////////On received

//onGather(list actorId, list position, adminPosition, lookPosition)
export function onGather( position, lookPosition) {
    emit("onGather",{
        position: position,
        lookPosition: lookPosition
    });
}

//onOrbit(list actorId, objectOrbit)
export function onOrbit( objectOrbit) {
    emit("onOrbit",{
        objectOrbit: objectOrbit,
    });
}

//onFollowMe(list actorId, adminId)
export function onFollowMe(followId) {
    emit("onFollowMe",{
        followId: followId,
    });
}

//onFreeze(list actorId, bool camera, bool position)
export function onFreeze(camera, position) {
    emit("onFreeze",{
        camera: camera,
        position: position
    });
}
//onUnFreeze(list actorId, bool camera, bool position)
export function onUnFreeze(camera, position) {
    emit("onUnFreeze",{
        camera: camera,
        position: position
    });
}


//onGoToScene(sceneId)
export function onGoToScene(sceneId) {
    emit("onGoToScene",{
        sceneId: sceneId
    });
}

//onLook(list actorId, positionLook)
export function onLook( positionLook) {
    emit("onLook",{
        positionLook: positionLook,
    });
}

export function onHostActions(action, parameters) {
    console.log("action",action);
    switch(action){
        case actions.LOOK:
            onLook(parameters.positionLook);
        break;
    }
}