import { listSightings } from '../services/firestoreData';

const fallbackNames = {
  Dog: ['Buddy', 'Milo', 'Max', 'Bruno', 'Hazel', 'Nora'],
  Cat: ['Luna', 'Simba', 'Mochi', 'Ivy', 'Nina', 'Leo'],
  Rabbit: ['Clover', 'Snowy', 'Pip'],
  Bird: ['Rio', 'Sunny', 'Kiwi'],
  Animal: ['Companion'],
};

function getFallbackName(animal, id) {
  const options = fallbackNames[animal] || fallbackNames.Animal;
  return options[(Number(id) || 1) % options.length];
}

export function normalizePetRecord(pet, index = 0) {
  const animal = pet.animal || pet.type || 'Animal';
  const source = pet.fromSighting || pet.source === 'sighting' ? 'sighting' : 'adoption';
  const baseId = pet.id ?? index + 1;

  return {
    ...pet,
    id: baseId,
    petKey: pet.petKey || `${source}-${baseId}`,
    source,
    animal,
    name: pet.name || getFallbackName(animal, baseId),
    gender: pet.gender || 'Unknown',
    age: pet.age || 'Unknown',
    image: pet.photo || pet.image || '',
    location:
      pet.location ||
      (source === 'sighting' ? 'Community report' : 'Partner foster network'),
    details:
      pet.details ||
      pet.summary ||
      (source === 'sighting'
        ? 'Shared by the community and awaiting follow-up.'
        : 'Ready to meet the right adopter.'),
    status: pet.status || (source === 'sighting' ? 'Reported sighting' : 'Available'),
    isSighting: source === 'sighting',
    date: pet.date || null,
  };
}

export async function loadPetCatalog() {
  const [adoptionResponse, sightings] = await Promise.all([
    fetch('/data/adoptions.json').then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load adoption listings');
      }

      return response.json();
    }),
    listSightings(),
  ]);

  const normalizedSightings = sightings
    .map((pet, index) => normalizePetRecord({ ...pet, source: 'sighting' }, index))
    .sort((left, right) => Number(right.id) - Number(left.id));

  const normalizedAdoptions = adoptionResponse.map((pet, index) =>
    normalizePetRecord({ ...pet, source: 'adoption' }, index)
  );

  return [...normalizedAdoptions, ...normalizedSightings];
}

export async function findPetByKey(petKey) {
  const catalog = await loadPetCatalog();
  return catalog.find((pet) => pet.petKey === petKey) || null;
}
