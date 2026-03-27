import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase';

function requireUser(currentUser) {
  if (!currentUser?.uid) {
    throw new Error('You must be signed in to do that.');
  }

  return currentUser;
}

function serializeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return null;
}

function serializeDocSnapshot(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    submittedAt: serializeTimestamp(data.submittedAt),
    savedAt: serializeTimestamp(data.savedAt),
    readAt: serializeTimestamp(data.readAt),
  };
}

function getUserDocRef(currentUser, ...pathParts) {
  const user = requireUser(currentUser);
  return doc(db, 'users', user.uid, ...pathParts);
}

function getUserCollection(currentUser, ...pathParts) {
  const user = requireUser(currentUser);
  return collection(db, 'users', user.uid, ...pathParts);
}

export async function getUserProfile(currentUser) {
  const snapshot = await getDoc(getUserDocRef(currentUser, 'profile', 'main'));
  return snapshot.exists() ? snapshot.data() : {};
}

export async function saveUserProfile(currentUser, profileData) {
  await setDoc(
    getUserDocRef(currentUser, 'profile', 'main'),
    {
      ...profileData,
      email: currentUser?.email || profileData.email || '',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return {
    ...profileData,
    email: currentUser?.email || profileData.email || '',
  };
}

export async function listUserFavorites(currentUser) {
  const favoritesQuery = query(
    getUserCollection(currentUser, 'favorites'),
    orderBy('savedAt', 'desc')
  );
  const snapshot = await getDocs(favoritesQuery);
  return snapshot.docs.map(serializeDocSnapshot);
}

export async function saveFavorite(currentUser, pet) {
  await setDoc(
    getUserDocRef(currentUser, 'favorites', pet.petKey),
    {
      ...pet,
      userId: currentUser.uid,
      savedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function removeFavorite(currentUser, petKey) {
  await deleteDoc(getUserDocRef(currentUser, 'favorites', petKey));
}

export async function listUserApplications(currentUser) {
  const applicationsQuery = query(
    getUserCollection(currentUser, 'applications'),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(applicationsQuery);
  return snapshot.docs.map(serializeDocSnapshot);
}

export async function createApplication(currentUser, applicationData) {
  const applicationRef = doc(getUserCollection(currentUser, 'applications'));
  const payload = {
    ...applicationData,
    applicantEmail: currentUser.email || '',
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: applicationData.status || 'Pending',
  };

  await setDoc(applicationRef, payload);

  return {
    id: applicationRef.id,
    ...applicationData,
    applicantEmail: currentUser.email || '',
    status: applicationData.status || 'Pending',
    submittedAt: new Date().toISOString(),
  };
}

export async function listUserNotifications(currentUser) {
  const notificationsQuery = query(
    getUserCollection(currentUser, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs.map(serializeDocSnapshot);
}

export async function createUserNotification(currentUser, notification) {
  await setDoc(
    getUserDocRef(currentUser, 'notifications', notification.id),
    {
      ...notification,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function markNotificationAsRead(currentUser, notificationId) {
  await updateDoc(getUserDocRef(currentUser, 'notifications', notificationId), {
    read: true,
    readAt: serverTimestamp(),
  });
}

export async function markAllNotificationsAsRead(currentUser, notifications) {
  const batch = writeBatch(db);

  notifications.forEach((notification) => {
    if (!notification.read) {
      batch.update(getUserDocRef(currentUser, 'notifications', notification.id), {
        read: true,
        readAt: serverTimestamp(),
      });
    }
  });

  await batch.commit();
}

export async function createSightingReport({
  species,
  date,
  location,
  details,
  photoFile,
  reporter,
}) {
  let photo = '';

  if (photoFile) {
    const safeName = `${Date.now()}-${photoFile.name.replace(/\s+/g, '-')}`;
    const photoRef = ref(storage, `sightings/${safeName}`);
    await uploadBytes(photoRef, photoFile);
    photo = await getDownloadURL(photoRef);
  }

  const payload = {
    animal: species,
    date,
    location,
    details,
    photo,
    gender: '',
    name: '',
    age: '',
    breed: '',
    fromSighting: true,
    source: 'sighting',
    status: 'Reported sighting',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reporterEmail: reporter?.email || null,
    reporterId: reporter?.uid || null,
  };

  const sightingRef = await addDoc(collection(db, 'sightings'), payload);

  return {
    id: sightingRef.id,
    ...payload,
    photo,
    createdAt: new Date().toISOString(),
  };
}

export async function listSightings() {
  const sightingsQuery = query(
    collection(db, 'sightings'),
    orderBy('createdAt', 'desc'),
    limit(40)
  );
  const snapshot = await getDocs(sightingsQuery);
  return snapshot.docs.map(serializeDocSnapshot);
}
