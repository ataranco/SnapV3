
let events = {};

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
export function Gather(actorId, position, adminPosition, lookPosition) {
    emit("Gather",{
        actorId: actorId,
        position: position,
        adminPosition: adminPosition,
        lookPosition: lookPosition
    });
}

//Pattern(list actorId, string patternType)
export function Pattern(actorId, patternType) {
    emit("Pattern",{
        actorId: actorId,
        patternType: patternType,
    });
}

//Look(list actorId, positionLook)
export function Look(actorId, positionLook) {
    emit("Look",{
        actorId: actorId,
        positionLook: positionLook,
    });
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

//onLook(list actorId, positionLook)
export function onLook( positionLook) {
    emit("onLook",{
        positionLook: positionLook,
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