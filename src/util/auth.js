import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from 'react';
import queryString from 'query-string';
import auth from '@react-native-firebase/auth';
import {useUser, createUser, updateUser} from './db';

// Whether to merge extra user data from database into auth.user
const MERGE_DB_USER = true;
// Whether to send email verification on signup
const EMAIL_VERIFICATION = false;

const authContext = createContext();

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export function ProvideAuth({children}) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  // Store auth user object
  const [user, setUser] = useState(null);

  // Format final user object and merge extra data from database
  const finalUser = usePrepareUser(user);

  // Handle response from authentication functions
  async function handleAuth(response, firstName, lastName) {
    const {user, additionalUserInfo} = response;
    // Ensure Firebase is actually ready before we continue
    await waitForFirebase();

    // Create the user in the database if they are new
    if (additionalUserInfo.isNewUser) {
      await createUser(user.uid, {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        teamId: null,
        userType: 'player',
      });

      // Send email verification if enabled
      if (EMAIL_VERIFICATION) {
        auth().currentUser.sendEmailVerification();
      }
    }

    // Update user in state
    setUser(user);
    console.log(user);
    return user;
  }

  const signup = (email, password, firstName, lastName) => {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => handleAuth(response, firstName, lastName));
  };

  const signin = (email, password) => {
    // eslint-disable-next-line prettier/prettier
    return auth()
      .signInWithEmailAndPassword(email, password)
      .then(handleAuth);
  };

  const signinWithProvider = (name) => {
    // Get provider data by name ("password", "google", etc)
    const providerData = allProviders.find((p) => p.name === name);

    const provider = new providerData.providerMethod();

    if (providerData.parameters) {
      provider.setCustomParameters(providerData.parameters);
    }

    return auth().signInWithPopup(provider).then(handleAuth);
  };

  const signout = () => {
    return auth().signOut();
  };

  const sendPasswordResetEmail = (email) => {
    return auth().sendPasswordResetEmail(email);
  };

  const confirmPasswordReset = (password, code) => {
    // Get code from query string object
    const resetCode = code || getFromQueryString('oobCode');

    return auth().confirmPasswordReset(resetCode, password);
  };

  const updateEmail = (email) => {
    return auth()
      .currentUser.updateEmail(email)
      .then(() => {
        // Update user in state (since onAuthStateChanged doesn't get called)
        setUser(auth().currentUser);
      });
  };

  const updatePassword = (password) => {
    return auth().currentUser.updatePassword(password);
  };

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    await auth().currentUser.updateProfile(data);

    // Persist all data to the database
    await updateUser(user.uid, data);

    // Update user in state
    setUser(auth().currentUser);
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return {
    user: finalUser,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updateEmail,
    updatePassword,
    updateProfile,
  };
}

// Format final user object and merge extra data from database
function usePrepareUser(user) {
  // Fetch extra data from database (if enabled and auth user has been fetched)
  const userDbQuery = useUser(MERGE_DB_USER && user && user.uid);

  // Memoize so we only create a new object if user or userDbQuery changes
  return useMemo(() => {
    // Return if auth user is null (loading) or false (not authenticated)
    if (!user) {
      return user;
    }

    // Data we want to include from auth user object
    let finalUser = {
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.photoURL,
      email: user.email,
      phoneNumber: user.phoneNumber,
      phoneNumberVerified: user.phoneNumberVerified,
    };

    // Include an array of user's auth providers, such as ["password", "google", etc]
    // Components can read this to prompt user to re-auth with the correct provider
    finalUser.providers = user.providerData.map(({providerId}) => {
      return allProviders.find((p) => p.id === providerId).name;
    });

    // If merging user data from database is enabled ...
    if (MERGE_DB_USER) {
      switch (userDbQuery.status) {
        case 'idle':
          // Return null user until we have db data to merge
          return null;
        case 'loading':
          return null;
        case 'error':
          // Log query error to console
          console.error(userDbQuery.error);
          return null;
        case 'success':
          // If user data doesn't exist we assume this means user just signed up and the createUser
          // function just hasn't completed. We return null to indicate a loading state.
          if (userDbQuery.data === null) {
            return null;
          }

          // Merge user data from database into finalUser object
          Object.assign(finalUser, userDbQuery.data);

        // no default
      }
    }

    return finalUser;
  }, [user, userDbQuery]);
}

// Handle Firebase email link for reverting to original email
export const handleRecoverEmail = (code) => {
  let originalEmail;
  return auth()
    .checkActionCode(code)
    .then((info) => {
      originalEmail = info.data.email;
      // Revert to original email by applying action code
      return auth().applyActionCode(code);
    })
    .then(() => {
      // Send password reset email so user can change their pass if they
      // think someone else has access to their account.
      return auth().sendPasswordResetEmail(originalEmail);
    })
    .then(() => {
      // Return original email so it can be displayed by calling component
      return originalEmail;
    });
};

// Handle Firebase email link for verifying email
export const handleVerifyEmail = (code) => {
  return auth().applyActionCode(code);
};

const allProviders = [
  {
    id: "password",
    name: "password",
  },
  {
    id: "google.com",
    name: "google",
    providerMethod: auth().GoogleAuthProvider,
  },
  {
    id: "facebook.com",
    name: "facebook",
    providerMethod: auth().FacebookAuthProvider,
    parameters: {
      // Tell fb to show popup size UI instead of full website
      display: "popup",
    },
  },
  {
    id: "twitter.com",
    name: "twitter",
    providerMethod: auth().TwitterAuthProvider,
  },
  {
    id: "github.com",
    name: "github",
    providerMethod: auth().GithubAuthProvider,
  },
];

// Waits on Firebase user to be initialized before resolving promise
// This is used to ensure auth is ready before any writing to the db can happen
const waitForFirebase = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user); // Resolve promise when we have a user
        unsubscribe(); // Prevent from firing again
      }
    });
  });
};

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
