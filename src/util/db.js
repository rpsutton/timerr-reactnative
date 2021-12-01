import {useReducer, useEffect, useRef, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
/**** USERS ****/

// Fetch user data (hook)
// This is called automatically by auth.js and merged into auth.user
export function useUser(uid) {
  return useQuery(uid && firestore().collection('users').doc(uid));
}

// Update an existing user
export function updateUser(uid, data) {
  return firestore().collection('users').doc(uid).update(data);
}

// Create a new user
export function createUser(uid, data) {
  return firestore()
    .collection('users')
    .doc(uid)
    .set({uid, ...data}, {merge: true});
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Fetch all runs of a specified team
export function getRunsByTeam(teamId) {
  var runs = [];
  firestore()
    .collection('runs')
    .where('teamId', '==', teamId)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        runs.push(documentSnapshot.data());
      });
    });
  return runs;
}

// Fetch all items by owner (hook)
export function useItemsByOwner(owner) {
  return useQuery(
    owner && firestore().collection('items').where('owner', '==', owner),
  );
}

// Fetch run data
export function useRun(id) {
  return useQuery(id && firestore().collection('runs').doc(id));
}

// Create a run
export function createRun(data) {
  return firestore().collection("runs").add(data);
}

// Update an item
export function updateItem(id, data) {
  return firestore().collection('items').doc(id).update(data);
}

export function setEventComplete(eventId, uid) {
  return firestore()
    .collection('events')
    .doc(eventId)
    .update({
      eventCompletedPlayers: firestore.FieldValue.arrayUnion(uid),
    })
    .catch(e => console.log(e));
}

// Create a new item
export function createItem(data) {
  return firestore().collection('items').add(data);
}

// Create Post
export function createPost(data) {
  return firestore().collection('posts').add(data);
}

export function checkValidTeamId(teamId) {
  return firestore()
    .collection('teams')
    .doc(teamId)
    .get()
    .then(doc => {
      return doc.exists;
    })
    .catch(e => console.log(e));
}

export function useTeam(teamId) {
  return useQuery(teamId && firestore().collection('teams').doc(teamId));
}

export function useRunsByTeamAndDay(teamId, date) {
  return useQuery(
    teamId &&
      date &&
      firestore
        .collection('runs')
        .where('resource.teamId', 'in', teamId)
        .where('start', '==', date),
  );
}

/**** HELPERS ****/

// Reducer for useQuery hook state and actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'idle':
      return {status: 'idle', data: undefined, error: undefined};
    case 'loading':
      return {status: 'loading', data: undefined, error: undefined};
    case 'success':
      return {status: 'success', data: action.payload, error: undefined};
    case 'error':
      return {status: 'error', data: undefined, error: action.payload};
    default:
      throw new Error('invalid action');
  }
};

function useQuery(query) {
  // Our initial state
  // Start with an "idle" status if query is falsy, as that means hook consumer is
  // waiting on required data before creating the query object.
  // Example: useQuery(uid && firestore.collection("profiles").doc(uid))
  const initialState = {
    status: query ? 'loading' : 'idle',
    data: undefined,
    error: undefined,
  };

  // Setup our state and actions
  const [state, dispatch] = useReducer(reducer, initialState);

  // Gives us previous query object if query is the same, ensuring
  // we don't trigger useEffect on every render due to query technically
  // being a new object reference on every render.
  const queryCached = useMemoCompare(query, prevQuery => {
    // Use built-in Firestore isEqual method to determine if "equal"
    return prevQuery && query && query.isEqual(prevQuery);
  });

  useEffect(() => {
    // Return early if query is falsy and reset to "idle" status in case
    // we're coming from "success" or "error" status due to query change.
    if (!queryCached) {
      dispatch({type: 'idle'});
      return;
    }

    dispatch({type: 'loading'});

    // Subscribe to query with onSnapshot
    // Will unsubscribe on cleanup since this returns an unsubscribe function
    return queryCached.onSnapshot(
      response => {
        // Get data for collection or doc
        const data = response.docs
          ? getCollectionData(response)
          : getDocData(response);
        dispatch({type: 'success', payload: data});
      },
      error => {
        dispatch({type: 'error', payload: error});
      },
    );
  }, [queryCached]); // Only run effect if queryCached changes

  return state;
}

// Get doc data and merge doc.id
function getDocData(doc) {
  return doc.exists === true ? {id: doc.id, ...doc.data()} : null;
}

// Get array of doc data from collection
async function getCollectionData(collection) {
  return collection.docs.map(getDocData);
}

// Used by useQuery to store Firestore query object reference
function useMemoCompare(next, compare) {
  // Ref for storing previous value
  const previousRef = useRef();
  const previous = previousRef.current;

  // Pass previous and next value to compare function
  // to determine whether to consider them equal.
  const isEqual = compare(previous, next);

  // If not equal update previousRef to next value.
  // We only update if not equal so that this hook continues to return
  // the same old value if compare keeps returning true.
  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  // Finally, if equal then return the previous value
  return isEqual ? previous : next;
}
