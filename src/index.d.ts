declare module 'action_linkroom_template' {
/**
 * Gathers actors at a specific position.
 * @param actorList - List of actors with IDs.
 * @param adminPosition - Gathering position in format { x: number; y: number; z: number }.
 * @returns List of objects containing the position of each actor.
 */
export function gather(
    actorList: { id: string }[],
    adminPosition: { x: number; y: number; z: number }
): { id: string; position: { x: number; y: number; z: number } }[];

/**
 * Generates positions and look directions for actors based on the specified pattern.
 * @param patternType - The type of pattern ('star', 'circular', 'square').
 * @param actorList - List of actors with IDs.
 * @param adminPosition - Admin position in format { x: number; y: number; z: number }.
 * @returns List of objects containing the position and look direction of each actor.
 */
export function pattern(
    actorList: { id: string }[],
    patternType: 'star' | 'circular' | 'square',
    adminPosition: { x: number; y: number; z: number }
): { id: string; position: { x: number; y: number; z: number }; lookAt: { x: number; y: number; z: number } }[];

/**
 * Sets the look direction of actors.
 * @param actorList - List of actors with IDs.
 * @param positionLook - Position to look at in format { x: number; y: number; z: number }.
 * @returns List of objects containing the look direction of each actor.
 */
export function look(
    actorList: { id: string }[],
    positionLook: { x: number; y: number; z: number }
): { id: string; lookAt: { x: number; y: number; z: number } }[];

/**
 * Makes actors orbit around a specific position.
 * @param actorList - List of actors with IDs.
 * @param orbitCenter - Orbit center in format { x: number; y: number; z: number }.
 * @param radius - Orbit radius.
 * @returns List of objects containing the position of each actor in the orbit.
 */
export function orbit(
    actorList: { id: string }[],
    orbitCenter: { x: number; y: number; z: number },
    radius: number
): { id: string; position: { x: number; y: number; z: number } }[];

/**
 * Freezes actors in their current position.
 * @param actorList - List of actors with IDs.
 * @returns List of objects containing the frozen position of each actor.
 */
export function freeze(
    actorList: { id: string }[]
): { id: string; position: { x: number; y: number; z: number } }[];

/**
 * Unfreezes actors, allowing them to move again.
 * @param actorList - List of actors with IDs.
 * @returns List of objects containing the current position of each actor.
 */
export function unfreeze(
    actorList: { id: string }[]
): { id: string; position: { x: number; y: number; z: number } }[];

/**
 * Moves actors to a specific scene.
 * @param actorList - List of actors with IDs.
 * @param sceneName - Name of the scene to move actors to.
 * @returns List of objects containing the position of each actor in the new scene.
 */
export function gotoScene(
    actorList: { id: string }[],
    sceneName: string
): { id: string; position: { x: number; y: number; z: number } }[];
}