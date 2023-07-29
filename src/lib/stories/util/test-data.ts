import { faker } from '@faker-js/faker';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  married: boolean;
};

export function createPeopleList(size: number) {
  const people: Person[] = [];

  for (let i = 0; i < size; i++) {
    people.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 5, max: 99 }),
      married: faker.number.binary() === '0',
    });
  }

  return people;
}
