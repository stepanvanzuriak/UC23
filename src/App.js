import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { AGE_CERTIFICTIONS, CSV_TITLES, GENRES, ROLES } from './constants';

function App() {
  const [data, setData] = useState({});
  const [currentView, setCurrentView] = useState('titles');

  const generateFakeData = () => {
    const titleType = faker.helpers.arrayElement(['movie', 'series']);

    const fakeTitles = [];
    const fakeCredits = [];

    for (let i = 0; i < 130; i++) {
      const id = i + 1;
      const title = {
        id: id,
        title: faker.word.words(3),
        description: faker.lorem.sentence(),
        release_year: faker.date.past({ years: 30 }).getFullYear(),
        age_certification: faker.helpers.arrayElement(AGE_CERTIFICTIONS),
        runtime: faker.number.int({ min: 60, max: 180 }),
        genres: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.helpers.arrayElement(GENRES),
        ),
        production_country: faker.location.countryCode(),
        seasons:
          titleType === 'series' ? faker.number.int({ min: 1, max: 10 }) : '',
      };
      fakeTitles.push(title);

      // Generating credits for each title
      for (let j = 0; j < faker.number.int({ min: 100, max: 120 }); j++) {
        fakeCredits.push({
          id: i * 10 + j + 1, // Making sure credit ids are unique
          title_id: id,
          real_name: faker.person.firstName(),
          character_name: faker.person.firstName(),
          role: faker.helpers.arrayElement(ROLES),
        });
      }
    }

    setData({
      titles: fakeTitles,
      credits: fakeCredits,
    });
  };

  const saveToCSV = (entity) => {
    const headers = CSV_TITLES[entity];

    const csvRows = data[entity].map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          return JSON.stringify(Array.isArray(val) ? val.join('|') : val);
        })
        .join(','),
    );

    csvRows.unshift(headers.join(','));
    const csv = csvRows.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${entity}.csv`);
    link.click();
  };

  return (
    <div className="App">
      <button onClick={generateFakeData}>Generate Data</button>
      {data.titles && data.credits && (
        <>
          <div>
            <button onClick={() => setCurrentView('titles')}>
              Show Titles
            </button>
            <button onClick={() => setCurrentView('credits')}>
              Show Credits
            </button>
          </div>
          <button onClick={() => saveToCSV(currentView)}>
            Save {currentView} as CSV
          </button>
          {currentView === 'titles' && (
            <pre>{JSON.stringify(data.titles, null, 2)}</pre>
          )}
          {currentView === 'credits' && (
            <pre>{JSON.stringify(data.credits, null, 2)}</pre>
          )}
        </>
      )}
    </div>
  );
}

export default App;
